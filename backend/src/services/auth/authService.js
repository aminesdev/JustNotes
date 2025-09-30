import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../../utils/generateToken.js";
import {
    addRefreshToken,
    removeRefreshToken,
    isValidRefreshToken,
} from "../refreshTokenService.js";
import {
    createUser,
    verifyUserCredentials,
    findUserById,
    findUserByEmail,
} from "../userService.js";
import { sendVerificationEmail } from "../emailService.js";

export async function registerService(userData) {
    const { email, password, role } = userData;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error("User already exists");
    }

    const newUser = await createUser(email, password, role || "USER");

    await sendVerificationEmail(email, newUser.verificationCode);

    return {
        success: true,
        message:
            "User registered successfully. Please check your email for the 6-digit verification code.",
        data: {
            userId: newUser.id,
            email: newUser.email,
        },
    };
}

export async function loginService(credentials) {
    const { email, password } = credentials;
    const user = await verifyUserCredentials(email, password);

    if (!user) {
        throw new Error("Invalid credentials");
    }

    if (!user.isVerified) {
        throw new Error("Please verify your email before logging in");
    }

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
        message: "Login successful",
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

export async function refreshTokenService(refreshToken) {
    if (!refreshToken) {
        throw new Error("Refresh token required");
    }

    const isValid = await isValidRefreshToken(refreshToken);
    if (!isValid) {
        throw new Error("Invalid refresh token");
    }

    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
        throw new Error("Invalid refresh token");
    }

    const user = await findUserById(decoded.id);
    if (!user || !user.isVerified) {
        throw new Error("User not found or not verified");
    }

    const payload = {
        id: user.id,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
    };

    const newAccessToken = generateAccessToken(payload);
    const newRefreshToken = generateRefreshToken(payload);

    await removeRefreshToken(refreshToken);
    await addRefreshToken(newRefreshToken, user.id);

    return {
        success: true,
        message: "Token refreshed successfully",
        data: {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        },
    };
}

export async function logoutService(refreshToken) {
    if (refreshToken) {
        await removeRefreshToken(refreshToken);
    }
    return {
        success: true,
        message: "Logged out successfully",
    };
}
