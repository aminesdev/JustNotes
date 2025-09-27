import express from "express";
import authRoutes from "./auth.js";
import noteRoutes from "./notes.js";
import categoryRoutes from "./categories.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: Authentication
 *     description: User authentication and authorization endpoints
 *   - name: Notes
 *     description: Note management endpoints
 *   - name: Categories
 *     description: Category management endpoints
 */

/**
 * @swagger
 * /:
 *   get:
 *     summary: API Health Check
 *     tags: [System]
 *     security: []
 *     responses:
 *       200:
 *         description: API is running
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Note API is running"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Note API is running",
        version: "1.0.0",
    });
});

router.use("/auth", authRoutes);
router.use("/notes", noteRoutes);
router.use("/categories", categoryRoutes);

export default router;
