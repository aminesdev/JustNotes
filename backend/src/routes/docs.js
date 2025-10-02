import express from "express";

const router = express.Router();

/**
 * @swagger
 * /api-docs:
 *   get:
 *     summary: API Documentation
 *     description: Interactive API documentation powered by Swagger UI
 *     tags: [Documentation]
 *     security: []
 *     responses:
 *       200:
 *         description: Swagger UI documentation page
 *         content:
 *           text/html:
 *             schema:
 *               type: string
 */

export default router;