export const API_BASE_URL = "https://justnotes.onrender.com/api";
export const APP_NAME = "JustNotes";

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
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Network error. Please check your connection.",
    UNAUTHORIZED: "Please login to continue.",
    FORBIDDEN: "You do not have permission to access this resource.",
    DEFAULT: "Something went wrong. Please try again.",
};
