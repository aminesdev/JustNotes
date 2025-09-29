import {
    verifyEmailService,
    resendVerificationService,
} from "../../services/auth/emailVerificationService.js";

export async function verifyEmailHandler(req, res) {
    try {
        const result = await verifyEmailService(req.body.code);
        res.json(result);
    } catch (error) {
        res.status(400).json({
            success: false,
            msg: error.message,
        });
    }
}

export async function resendVerificationHandler(req, res) {
    try {
        const result = await resendVerificationService(req.body.email);
        res.json(result);
    } catch (error) {
        if (error.message === "User not found") {
            return res.status(404).json({
                success: false,
                msg: error.message,
            });
        }
        if (error.message === "Email is already verified") {
            return res.status(400).json({
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
