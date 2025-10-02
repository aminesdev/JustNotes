import api from "./api";

export const categoriesService = {
    getCategories: async () => {
        try {
            const response = await api.get("/categories");
            const data = response.data?.data || response.data || [];
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Categories service - getCategories error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config,
            });
            throw error;
        }
    },

    getCategoryById: async (id) => {
        try {
            const response = await api.get(`/categories/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Categories service - getCategoryById error:", error);
            throw error;
        }
    },

    createCategory: async (categoryData) => {
        try {
            // Match the exact API payload structure from your docs
            const payload = {
                name: categoryData.name?.trim() || "",
                description: categoryData.description?.trim() || null,
                color: categoryData.color || "#6B73FF",
            };

            console.log("Creating category with payload:", payload);

            // Validate required fields
            if (!payload.name) {
                throw new Error("Category name is required");
            }

            const response = await api.post("/categories", payload);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Categories service - createCategory error:", error);
            throw error;
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            const payload = {
                name: categoryData.name?.trim() || "",
                description: categoryData.description?.trim() || null,
                color: categoryData.color || "#6B73FF",
            };

            console.log("Updating category with payload:", payload);

            if (!payload.name) {
                throw new Error("Category name is required");
            }

            const response = await api.put(`/categories/${id}`, payload);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Categories service - updateCategory error:", error);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            const response = await api.delete(`/categories/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Categories service - deleteCategory error:", error);
            throw error;
        }
    },

    getCategoryNotes: async (id) => {
        try {
            const response = await api.get(`/categories/${id}/notes`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error(
                "Categories service - getCategoryNotes error:",
                error
            );
            throw error;
        }
    },
};
