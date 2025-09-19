import RefreshToken from "../models/RefreshToken.js";
import jwt from "jsonwebtoken";

export async function addRefreshToken(token, userId) {
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    const refreshToken = new RefreshToken({
        token,
        userId,
        expiresAt,
    });

    return await refreshToken.save();
}

export async function removeRefreshToken(token) {
    return await RefreshToken.findOneAndDelete({ token });
}

export async function isValidRefreshToken(token) {
    const foundToken = await RefreshToken.findOne({ token });
    return !!foundToken;
}

export async function clearUserRefreshTokens(userId) {
    return await RefreshToken.deleteMany({ userId });
}
