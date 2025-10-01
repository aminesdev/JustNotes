import api from "./api";

export const passwordService = {
    // Forgot password - request reset code
    forgotPassword: async (email) => {
        const response = await api.post("/auth/password/forgot", { email });
        return response.data;
    },

    // Reset password with code
    resetPassword: async (code, newPassword) => {
        const response = await api.post("/auth/password/reset", {
            code,
            newPassword,
        });
        return response.data;
    },
};
