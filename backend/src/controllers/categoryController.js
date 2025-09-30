import * as categoryService from "../services/categoryService.js";

export const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(
            req.user.id,
            req.body
        );
        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: category,
        });
    } catch (error) {
        if (error.code === "P2002") {
            // Prisma unique constraint violation
            return res.status(400).json({
                success: false,
                msg: "A category with this name already exists",
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryService.getUserCategories(req.user.id);
        res.json({
            success: true,
            data: categories,
            message:
                categories.length === 0
                    ? "No categories found"
                    : "Categories retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(
            req.user.id,
            req.params.id
        );
        if (!category) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({
            success: true,
            data: category,
            message: "Category retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const updateCategory = async (req, res) => {
    try {
        const category = await categoryService.updateCategory(
            req.user.id,
            req.params.id,
            req.body
        );
        if (!category) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({
            success: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        if (error.code === "P2002") {
            return res.status(400).json({
                success: false,
                msg: "A category with this name already exists",
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const category = await categoryService.deleteCategory(
            req.user.id,
            req.params.id
        );
        if (!category) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({
            success: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};

export const getCategoryNotes = async (req, res) => {
    try {
        const categoryWithNotes = await categoryService.getCategoryWithNotes(
            req.user.id,
            req.params.id
        );
        if (!categoryWithNotes) {
            return res
                .status(404)
                .json({ success: false, msg: "Category not found" });
        }
        res.json({
            success: true,
            data: categoryWithNotes,
            message: "Category notes retrieved successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
};
