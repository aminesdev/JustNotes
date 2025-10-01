import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

api.interceptors.request.use(
    (config) => {
        // Try to get token from multiple sources
        let token = localStorage.getItem("accessToken");

        // If not found, try to get from Zustand persist storage
        if (!token) {
            try {
                const authStorage = localStorage.getItem("auth-storage");
                if (authStorage) {
                    const parsed = JSON.parse(authStorage);
                    token = parsed.state?.accessToken;
                }
            } catch (e) {
                console.error("Error parsing auth storage:", e);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (!error.response) {
            throw new Error(
                "Cannot connect to server. Please check your connection."
            );
        }

        if (error.response?.status === 401) {
            // Clear all auth data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");
            localStorage.removeItem("auth-storage");
        }

        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            error.message ||
            "Request failed";
        throw new Error(errorMessage);
    }
);

export default api;
