import api from "./api";

export const authService = {
    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },

    verifyEmail: async (code) => {
        const response = await api.post("/auth/email/verify", { code });
        return response.data;
    },

    resendVerification: async (email) => {
        const response = await api.post("/auth/email/resend", { email });
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post("/auth/password/forgot", { email });
        return response.data;
    },

    resetPassword: async (code, newPassword) => {
        const response = await api.post("/auth/password/reset", {
            code,
            newPassword,
        });
        return response.data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            try {
                await api.post("/auth/logout", { refreshToken });
            } catch (error) {
                console.error("Logout error:", error);
            }
        }
    },
};
