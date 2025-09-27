import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
} from "../utils/generateToken.js";
import {
    addRefreshToken,
    removeRefreshToken,
    isValidRefreshToken,
} from "../services/refreshTokenService.js";
import {
    createUser,
    findUserByEmail,
    verifyUserCredentials,
    findUserById,
} from "../services/userService.js";

export async function register(req, res) {
    try {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                msg: "Email and password are required",
            });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                msg: "User already exists",
            });
        }

        const newUser = await createUser(email, password, role || "USER");
        const accessToken = generateAccessToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });
        const refreshToken = generateRefreshToken({
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
        });

        await addRefreshToken(refreshToken, newUser.id);

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                accessToken,
                refreshToken,
                user: {
                    id: newUser.id,
                    email: newUser.email,
                    role: newUser.role,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await verifyUserCredentials(email, password);
        if (!user) {
            return res.status(400).json({
                success: false,
                msg: "Invalid credentials",
            });
        }

        const accessToken = generateAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
            id: user.id,
            email: user.email,
            role: user.role,
        });

        await addRefreshToken(refreshToken, user.id);

        res.json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                msg: "Refresh token required",
            });
        }

        const isValid = await isValidRefreshToken(refreshToken);
        if (!isValid) {
            return res.status(403).json({
                success: false,
                msg: "Invalid refresh token",
            });
        }

        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(403).json({
                success: false,
                msg: "Invalid refresh token",
            });
        }

        const user = await findUserById(decoded.id);
        if (!user) {
            return res.status(403).json({
                success: false,
                msg: "User not found",
            });
        }

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);

        await removeRefreshToken(refreshToken);
        await addRefreshToken(newRefreshToken, user.id);

        res.json({
            success: true,
            message: "Token refreshed successfully",
            data: {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}

export async function logout(req, res) {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await removeRefreshToken(refreshToken);
        }
        res.json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            msg: "Server error",
            error: error.message,
        });
    }
}
