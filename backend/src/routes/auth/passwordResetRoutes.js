import express from "express";
import {
    forgotPasswordHandler,
    resetPasswordHandler,
} from "../../controllers/auth/passwordResetController.js";
import {
    validateEmail,
    validatePasswordReset,
} from "../../middlewares/validation.js";

const router = express.Router();

/**
 * @swagger
 * /api/auth/password/forgot:
 *   post:
 *     summary: Request password reset code
 *     tags: [Authentication]
 *     security: []
 */
router.post("/forgot", validateEmail, forgotPasswordHandler);

/**
 * @swagger
 * /api/auth/password/reset:
 *   post:
 *     summary: Reset password with 6-digit code
 *     tags: [Authentication]
 *     security: []
 */
router.post("/reset", validatePasswordReset, resetPasswordHandler);

export default router;
