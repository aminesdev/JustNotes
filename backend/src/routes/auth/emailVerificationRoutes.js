import express from "express";
import {
    verifyEmailHandler,
    resendVerificationHandler,
} from "../../controllers/auth/emailVerificationController.js";
import {
    validateVerificationCode,
    validateEmail,
} from "../../middlewares/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/email/verify:
 *   post:
 *     summary: Verify email with 6-digit code
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *             properties:
 *               code:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email verified successfully
 */
router.post("/verify", validateVerificationCode, verifyEmailHandler);

/**
 * @swagger
 * /api/auth/email/resend:
 *   post:
 *     summary: Resend verification code
 *     tags: [Authentication]
 *     security: []
 */
router.post("/resend", validateEmail, resendVerificationHandler);

export default router;
