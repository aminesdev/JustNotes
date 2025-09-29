import {
    setPasswordResetCode,
    resetUserPassword,
    findUserByEmail,
} from "../userService.js";
import { sendPasswordResetEmail } from "../emailService.js";

export async function forgotPasswordService(email) {
    const user = await findUserByEmail(email);

    if (user) {
        const updatedUser = await setPasswordResetCode(email);
        await sendPasswordResetEmail(email, updatedUser.verificationCode);
    }

    return {
        success: true,
        message: "If the email exists, a password reset code has been sent",
    };
}

export async function resetPasswordService(code, newPassword) {
    if (!code || !newPassword) {
        throw new Error("Code and new password are required");
    }

    const user = await resetUserPassword(code, newPassword);

    return {
        success: true,
        message: "Password reset successfully",
        data: {
            user: {
                id: user.id,
                email: user.email,
            },
        },
    };
}
