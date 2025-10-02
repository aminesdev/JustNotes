import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No access token found");
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle network errors
        if (!error.response) {
            console.error("Network error:", error);
            const networkError = new Error(
                "Cannot connect to server. Please check your connection."
            );
            networkError.response = null;
            return Promise.reject(networkError);
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear auth data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");
            localStorage.removeItem("auth-storage");

            // Redirect to login
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }

            const authError = new Error("Session expired. Please login again.");
            authError.response = error.response;
            return Promise.reject(authError);
        }

        // Preserve the original error with response data
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            error.message ||
            "Request failed";

        // Create a new error but keep the response object
        const enhancedError = new Error(errorMessage);
        enhancedError.response = error.response;
        enhancedError.config = error.config;

        return Promise.reject(enhancedError);
    }
);

export default api;
