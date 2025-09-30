import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};

export const useAuth = () => {
    const [user, setUser] = useLocalStorage("userData", null);
    const [token, setToken] = useLocalStorage("accessToken", null);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("userData");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };

    return {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
    };
};
