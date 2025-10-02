// stores/categoriesStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { categoriesService } from "../services/categoriesService";

export const useCategoriesStore = create(
    persist(
        (set, get) => ({
            categories: [],
            currentCategory: null,
            isLoading: false,
            error: null,
            validationErrors: {},
            lastFetched: null,

            fetchCategories: async (forceRefresh = false) => {
                const state = get();

                if (state.isLoading && !forceRefresh) {
                    return;
                }

                const hasRecentData =
                    state.lastFetched &&
                    Date.now() - state.lastFetched < 30000 &&
                    state.categories.length > 0;

                if (!forceRefresh && hasRecentData) {
                    return;
                }

                set({ isLoading: true, error: null, validationErrors: {} });

                try {
                    const response = await categoriesService.getCategories();

                    let categories = [];
                    if (Array.isArray(response)) {
                        categories = response;
                    } else if (response && Array.isArray(response.data)) {
                        categories = response.data;
                    }

                    set({
                        categories: categories,
                        isLoading: false,
                        lastFetched: Date.now(),
                        error: null,
                    });
                } catch (error) {
                    console.error("Error fetching categories:", error);

                    if (
                        error.message?.includes("Authentication required") ||
                        error.response?.status === 401
                    ) {
                        set({
                            categories: [],
                            isLoading: false,
                            error: "Please login to access categories",
                            lastFetched: Date.now(),
                        });
                    } else {
                        set({
                            isLoading: false,
                            error: error.message,
                            categories: state.categories,
                        });
                    }
                }
            },

            createCategory: async (categoryData) => {
                set({ isLoading: true, error: null, validationErrors: {} });
                try {
                    if (!categoryData.name || !categoryData.name.trim()) {
                        throw new Error("Category name is required");
                    }

                    const response = await categoriesService.createCategory(
                        categoryData
                    );

                    let newCategory;
                    if (response.data) {
                        newCategory = response.data;
                    } else if (response) {
                        newCategory = response;
                    } else {
                        newCategory = {
                            id: Date.now().toString(),
                            ...categoryData,
                            createdAt: new Date().toISOString(),
                            noteCount: 0,
                        };
                    }

                    set((state) => ({
                        categories: [...state.categories, newCategory],
                        isLoading: false,
                        validationErrors: {},
                        lastFetched: Date.now(),
                    }));

                    return newCategory;
                } catch (error) {
                    console.error("Category creation error:", error);

                    let validationErrors = {};
                    let errorMessage =
                        error.message || "Failed to create category";

                    // Handle different error response formats
                    if (error.response?.data?.errors) {
                        const errors = error.response.data.errors;

                        // If errors is an array (express-validator format)
                        if (Array.isArray(errors)) {
                            errors.forEach((err) => {
                                validationErrors[
                                    err.path || err.param || "general"
                                ] = err.msg || err.message;
                            });
                            errorMessage = "Please fix the validation errors";
                        }
                        // If errors is an object
                        else if (typeof errors === "object") {
                            validationErrors = errors;
                        }
                    } else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response?.data?.msg) {
                        errorMessage = error.response.data.msg;
                    }

                    set({
                        isLoading: false,
                        error: errorMessage,
                        validationErrors,
                    });
                    throw error;
                }
            },

            updateCategory: async (id, categoryData) => {
                set({ isLoading: true, error: null, validationErrors: {} });
                try {
                    const response = await categoriesService.updateCategory(
                        id,
                        categoryData
                    );
                    const updatedCategory = response.data || response;

                    set((state) => ({
                        categories: state.categories.map((category) =>
                            category.id === id ? updatedCategory : category
                        ),
                        currentCategory: updatedCategory,
                        isLoading: false,
                        validationErrors: {},
                        lastFetched: Date.now(),
                    }));
                    return updatedCategory;
                } catch (error) {
                    console.error("Category update error:", error);

                    let validationErrors = {};
                    let errorMessage =
                        error.message || "Failed to update category";

                    // Handle different error response formats
                    if (error.response?.data?.errors) {
                        const errors = error.response.data.errors;

                        if (Array.isArray(errors)) {
                            errors.forEach((err) => {
                                validationErrors[
                                    err.path || err.param || "general"
                                ] = err.msg || err.message;
                            });
                            errorMessage = "Please fix the validation errors";
                        } else if (typeof errors === "object") {
                            validationErrors = errors;
                        }
                    } else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response?.data?.msg) {
                        errorMessage = error.response.data.msg;
                    }

                    set({
                        isLoading: false,
                        error: errorMessage,
                        validationErrors,
                    });
                    throw error;
                }
            },

            deleteCategory: async (id) => {
                set({ isLoading: true, error: null, validationErrors: {} });
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
                        validationErrors: {},
                        lastFetched: Date.now(),
                    }));
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message ||
                        error.response?.data?.msg ||
                        error.message ||
                        "Failed to delete category";
                    set({
                        isLoading: false,
                        error: errorMessage,
                        validationErrors: {},
                    });
                    throw error;
                }
            },

            setCurrentCategory: (category) =>
                set({ currentCategory: category }),
            clearCurrentCategory: () => set({ currentCategory: null }),
            clearError: () => set({ error: null, validationErrors: {} }),
            clearValidationErrors: () => set({ validationErrors: {} }),
            forceRefresh: () => set({ lastFetched: null }),
        }),
        {
            name: "categories-storage",
            partialize: (state) => ({
                categories: state.categories,
                lastFetched: state.lastFetched,
            }),
        }
    )
);
