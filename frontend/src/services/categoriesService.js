import api from "./api";

export const categoriesService = {
    getCategories: async () => {
        const response = await api.get("/categories");
        return response.data;
    },

    getCategoryById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    createCategory: async (categoryData) => {
        const response = await api.post("/categories", categoryData);
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
