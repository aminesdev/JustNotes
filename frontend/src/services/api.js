import axios from "axios";
import { API_BASE_URL } from "../utils/constants";
import {
    getStorageItem,
    setStorageItem,
    removeStorageItem,
} from "../utils/helpers";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = getStorageItem("accessToken");
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
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = getStorageItem("refreshToken");
                if (!refreshToken) {
                    throw new Error("No refresh token available");
                }

                const response = await axios.post(
                    `${API_BASE_URL}/auth/refresh`,
                    {
                        refreshToken,
                    }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data.data;
                setStorageItem("accessToken", accessToken);
                setStorageItem("refreshToken", newRefreshToken);

                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                removeStorageItem("accessToken");
                removeStorageItem("refreshToken");
                removeStorageItem("userData");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;