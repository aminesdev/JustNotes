import express from "express";
import {
    register,
    login,
    refreshToken,
    logout,
    verifyEmail,
    resendVerification,
    forgotPassword,
    resetPassword,
} from "../controllers/authController.js";
import {
    validateRegister,
    validateLogin,
    validateRefreshToken,
    validateEmail,
} from "../middlewares/validation.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", validateRefreshToken, refreshToken);
router.post("/logout", logout);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", validateEmail, resendVerification);
router.post("/forgot-password", validateEmail, forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
