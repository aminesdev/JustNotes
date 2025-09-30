import { STORAGE_KEYS } from "./constants";

export const getStorageItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
    }
};

export const setStorageItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error("Error writing to localStorage:", error);
        return false;
    }
};

export const removeStorageItem = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error("Error removing from localStorage:", error);
        return false;
    }
};

export const clearStorage = () => {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error("Error clearing localStorage:", error);
        return false;
    }
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
