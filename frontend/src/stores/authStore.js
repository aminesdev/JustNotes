import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";
import {
    getStorageItem,
    setStorageItem,
    removeStorageItem,
} from "../utils/helpers";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
            isAuthenticated: false,

            login: async (credentials) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.login(credentials);
                    const { user, accessToken, refreshToken } = response.data;

                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isAuthenticated: true,
                        isLoading: false,
                        error: null,
                    });

                    setStorageItem("accessToken", accessToken);
                    setStorageItem("refreshToken", refreshToken);
                    setStorageItem("userData", user);

                    return response;
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.msg || "Login failed";
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.register(userData);
                    set({ isLoading: false, error: null });
                    return response;
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.msg || "Registration failed";
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true });
                try {
                    await authService.logout();
                } catch (error) {
                    console.error("Logout error:", error);
                } finally {
                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isAuthenticated: false,
                        isLoading: false,
                        error: null,
                    });

                    removeStorageItem("accessToken");
                    removeStorageItem("refreshToken");
                    removeStorageItem("userData");
                }
            },

            verifyEmail: async (code) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await authService.verifyEmail(code);
                    const currentUser = get().user;
                    if (currentUser) {
                        set({
                            user: { ...currentUser, isVerified: true },
                            isLoading: false,
                        });
                    }
                    return response;
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.msg ||
                        "Email verification failed";
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            clearError: () => set({ error: null }),

            setUser: (user) => set({ user }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
);
