import {
    registerService,
    loginService,
    refreshTokenService,
    logoutService,
} from "../../services/auth/authService.js";

export async function register(req, res) {
    try {
        const result = await registerService(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}

export async function login(req, res) {
    try {
        const result = await loginService(req.body);
        res.json(result);
    } catch (error) {
        if (error.message === "Invalid credentials") {
            return res.status(400).json({
                success: false,
                msg: error.message,
            });
        }
        if (error.message === "Please verify your email before logging in") {
            return res.status(403).json({
                success: false,
                msg: error.message,
                code: "EMAIL_NOT_VERIFIED",
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function refreshToken(req, res) {
    try {
        const result = await refreshTokenService(req.body.refreshToken);
        res.json(result);
    } catch (error) {
        if (
            error.message === "Refresh token required" ||
            error.message === "Invalid refresh token" ||
            error.message === "User not found or not verified"
        ) {
            return res.status(403).json({
                success: false,
                msg: error.message,
            });
        }
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function logout(req, res) {
    try {
        const result = await logoutService(req.body.refreshToken);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}
