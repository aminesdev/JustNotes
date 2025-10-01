export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001/api";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "LockNote";

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    NOTES: "/notes",
    CATEGORIES: "/categories",
    PROFILE: "/profile",
};

export const STORAGE_KEYS = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER_DATA: "userData",
    ENCRYPTION_KEYS: "encryptionKeys",
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Network error. Please check your connection.",
    UNAUTHORIZED: "Please login to continue.",
    FORBIDDEN: "You do not have permission to access this resource.",
    DEFAULT: "Something went wrong. Please try again.",
};
