import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
            isInitialized: false,

            initialize: () => {
                try {
                    const token = localStorage.getItem("accessToken");
                    const userData = localStorage.getItem("userData");
                    const refreshToken = localStorage.getItem("refreshToken");

                    console.log("Auth initialization:", {
                        hasToken: !!token,
                        hasUserData: !!userData,
                    });

                    if (token && userData) {
                        try {
                            const user = JSON.parse(userData);
                            set({
                                user,
                                accessToken: token,
                                refreshToken: refreshToken,
                                isInitialized: true,
                                isLoading: false,
                            });
                            console.log(
                                "Auth initialized with user:",
                                user.email
                            );
                        } catch (parseError) {
                            console.error(
                                "Error parsing user data:",
                                parseError
                            );
                            get().clearAuth();
                            set({ isInitialized: true, isLoading: false });
                        }
                    } else {
                        set({ isInitialized: true, isLoading: false });
                        console.log("Auth initialized - no user data");
                    }
                } catch (error) {
                    console.error("Auth initialization error:", error);
                    get().clearAuth();
                    set({ isInitialized: true, isLoading: false });
                }
            },

            setUser: (user) => {
                set({ user });
                if (user) {
                    localStorage.setItem("userData", JSON.stringify(user));
                }
            },

            login: async (credentials) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.login(credentials);
                    const { user, accessToken, refreshToken } = response.data;

                    console.log("Login successful:", {
                        user: user.email,
                        hasToken: !!accessToken,
                    });

                    // Store in both Zustand state AND localStorage
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    localStorage.setItem("userData", JSON.stringify(user));

                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isLoading: false,
                        error: null,
                    });

                    return response;
                } catch (error) {
                    console.error("Login error:", error);
                    set({ isLoading: false, error: error.message });
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
                    console.error("Register error:", error);
                    set({ isLoading: false, error: error.message });
                    throw error;
                }
            },

            verifyEmail: async (code) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.verifyEmail(code);

                    if (response.data.user && response.data.accessToken) {
                        const { user, accessToken, refreshToken } =
                            response.data;

                        console.log("Email verification successful:", {
                            user: user.email,
                        });

                        localStorage.setItem("accessToken", accessToken);
                        localStorage.setItem("refreshToken", refreshToken);
                        localStorage.setItem("userData", JSON.stringify(user));

                        set({
                            user,
                            accessToken,
                            refreshToken,
                            isLoading: false,
                            error: null,
                        });
                    }

                    return response;
                } catch (error) {
                    console.error("Email verification error:", error);
                    set({ isLoading: false, error: error.message });
                    throw error;
                }
            },

            resendVerification: async (email) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.resendVerification(
                        email
                    );
                    set({ isLoading: false });
                    return response;
                } catch (error) {
                    console.error("Resend verification error:", error);
                    set({ isLoading: false, error: error.message });
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
                    // Clear everything
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("userData");
                    localStorage.removeItem("auth-storage");
                    localStorage.removeItem("notes-storage");
                    localStorage.removeItem("categories-storage");

                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isLoading: false,
                        error: null,
                    });

                    console.log("Logout completed");
                }
            },

            clearAuth: () => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userData");

                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    error: null,
                });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);
