import express from "express";
import { authenticate } from "../middlewares/authMiddleware.js";
import * as categoryService from "../services/categoryService.js";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
    try {
        const categories = await categoryService.getUserCategories(req.user.id);
        res.json({ success: true, data: categories });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

router.post("/", async (req, res) => {
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
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

router.get("/:id", async (req, res) => {
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
        res.json({ success: true, data: category });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

router.put("/:id", async (req, res) => {
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
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

router.delete("/:id", async (req, res) => {
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
        res.json({ success: true, message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, msg: "Server error" });
    }
});

export default router;
