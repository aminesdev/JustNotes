import { create } from "zustand";
import { categoriesService } from "../services/categoriesService";

export const useCategoriesStore = create((set, get) => ({
    categories: [],
    currentCategory: null,
    isLoading: false,
    error: null,

    // Actions
    fetchCategories: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await categoriesService.getCategories();
            set({
                categories: response.data || [],
                isLoading: false,
            });
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Failed to fetch categories";
            set({
                isLoading: false,
                error: errorMessage,
            });
        }
    },

    fetchCategoryById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await categoriesService.getCategoryById(id);
            set({
                currentCategory: response.data,
                isLoading: false,
            });
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Failed to fetch category";
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    createCategory: async (categoryData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await categoriesService.createCategory(
                categoryData
            );
            set((state) => ({
                categories: [...state.categories, response.data],
                isLoading: false,
            }));
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Failed to create category";
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    updateCategory: async (id, categoryData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await categoriesService.updateCategory(
                id,
                categoryData
            );
            set((state) => ({
                categories: state.categories.map((category) =>
                    category.id === id ? response.data : category
                ),
                currentCategory: response.data,
                isLoading: false,
            }));
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Failed to update category";
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    deleteCategory: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await categoriesService.deleteCategory(id);
            set((state) => ({
                categories: state.categories.filter(
                    (category) => category.id !== id
                ),
                currentCategory:
                    state.currentCategory?.id === id
                        ? null
                        : state.currentCategory,
                isLoading: false,
            }));
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Failed to delete category";
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    setCurrentCategory: (category) => set({ currentCategory: category }),
    clearCurrentCategory: () => set({ currentCategory: null }),
    clearError: () => set({ error: null }),
}));
