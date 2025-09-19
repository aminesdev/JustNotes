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
    findUserByUsername,
    verifyUserCredentials,
    findUserById,
} from "../services/userService.js";

export async function register(req, res) {
    try {
        const { username, password, role } = req.body;
        if (!username || !password || !role) {
            return res.status(400).json({ msg: "Please provide all fields" });
        }
        const existingUser = await findUserByUsername(username);
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }
        const newUser = await createUser(username, password, role);
        const accessToken = generateAccessToken({
            id: newUser._id,
            username: newUser.username,
            role: newUser.role,
        });
        const refreshToken = generateRefreshToken({
            id: newUser._id,
            username: newUser.username,
            role: newUser.role,
        });
        await addRefreshToken(refreshToken, newUser._id);
        res.status(201).json({
            accessToken,
            refreshToken,
            user: {
                id: newUser._id,
                username: newUser.username,
                role: newUser.role,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

export async function login(req, res) {
    try {
        const { username, password } = req.body;
        const user = await verifyUserCredentials(username, password);
        if (!user) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }
        const accessToken = generateAccessToken({
            id: user._id,
            username: user.username,
            role: user.role,
        });
        const refreshToken = generateRefreshToken({
            id: user._id,
            username: user.username,
            role: user.role,
        });
        await addRefreshToken(refreshToken, user._id);
        res.json({
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

export async function refreshToken(req, res) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(401).json({ msg: "Refresh token required" });
        }
        const isValid = await isValidRefreshToken(refreshToken);
        if (!isValid) {
            return res.status(403).json({ msg: "Invalid refresh token" });
        }
        const decoded = verifyRefreshToken(refreshToken);
        if (!decoded) {
            return res.status(403).json({ msg: "Invalid refresh token" });
        }
        const user = await findUserById(decoded.id);
        if (!user) {
            return res.status(403).json({ msg: "User not found" });
        }
        const payload = {
            id: user._id,
            username: user.username,
            role: user.role,
        };
        const newAccessToken = generateAccessToken(payload);
        const newRefreshToken = generateRefreshToken(payload);
        await removeRefreshToken(refreshToken);
        await addRefreshToken(newRefreshToken, user._id);
        res.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}

export async function logout(req, res) {
    try {
        const { refreshToken } = req.body;
        if (refreshToken) {
            await removeRefreshToken(refreshToken);
        }
        res.json({ msg: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Server error" });
    }
}
