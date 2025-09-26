import express from "express";
import {
    register,
    login,
    refreshToken,
    logout,
} from "../controllers/authController.js";
import {
    validateRegister,
    validateLogin,
    validateRefreshToken,
} from "../middlewares/validation.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.post("/refresh", validateRefreshToken, refreshToken);
router.post("/logout", logout);

export default router;
