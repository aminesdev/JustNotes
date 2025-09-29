import {
    generateAccessToken,
    generateRefreshToken,
} from "../../utils/generateToken.js";
import { addRefreshToken } from "../refreshTokenService.js";
import {
    verifyUserEmail,
    updateUserVerificationCode,
    findUserByEmail,
} from "../userService.js";
import { sendVerificationEmail } from "../emailService.js";

export async function verifyEmailService(code) {
    if (!code) {
        throw new Error("Verification code is required");
    }

    const user = await verifyUserEmail(code);

    const accessToken = generateAccessToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });

    const refreshToken = generateRefreshToken({
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    });

    await addRefreshToken(refreshToken, user.id);

    return {
        success: true,
        message: "Email verified successfully",
        data: {
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
            },
            accessToken,
            refreshToken,
        },
    };
}

export async function resendVerificationService(email) {
    const user = await findUserByEmail(email);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.isVerified) {
        throw new Error("Email is already verified");
    }

    const updatedUser = await updateUserVerificationCode(email);
    await sendVerificationEmail(email, updatedUser.verificationCode);

    return {
        success: true,
        message: "Verification code sent successfully",
    };
}
