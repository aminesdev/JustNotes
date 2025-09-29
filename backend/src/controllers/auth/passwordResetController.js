import {
    forgotPasswordService,
    resetPasswordService,
} from "../../services/auth/passwordResetService.js";

export async function forgotPasswordHandler(req, res) {
    try {
        const result = await forgotPasswordService(req.body.email);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function resetPasswordHandler(req, res) {
    try {
        const result = await resetPasswordService(
            req.body.code,
            req.body.newPassword
        );
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}
