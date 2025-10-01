import api from "./api";

export const categoriesService = {
    getCategories: async () => {
        try {
            const response = await api.get("/categories");
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error("Authentication required. Please login again.");
            }
            if (error.response?.status === 404) {
                return [];
            }
            throw error;
        }
    },

    getCategoryById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    createCategory: async (categoryData) => {
        const payload = {
            name: categoryData.name.trim(),
            description: categoryData.description?.trim() || null,
            color: categoryData.color || "#6B73FF",
        };

        const response = await api.post("/categories", payload);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },

    getCategoryNotes: async (id) => {
        const response = await api.get(`/categories/${id}/notes`);
        return response.data;
    },
};
