import prisma from "../config/database.js";
import jwt from "jsonwebtoken";

export async function addRefreshToken(token, userId) {
    const decoded = jwt.decode(token);
    const expiresAt = new Date(decoded.exp * 1000);

    return await prisma.refreshToken.create({
        data: {
            token,
            userId,
            expiresAt,
        },
    });
}

export async function removeRefreshToken(token) {
    const tokenRecord = await prisma.refreshToken.findFirst({
        where: { token },
    });

    if (tokenRecord) {
        return await prisma.refreshToken.delete({
            where: { id: tokenRecord.id },
        });
    }
    return null;
}

export async function isValidRefreshToken(token) {
    const foundToken = await prisma.refreshToken.findFirst({
        where: { token },
    });
    return !!foundToken;
}

export async function clearUserRefreshTokens(userId) {
    return await prisma.refreshToken.deleteMany({
        where: { userId },
    });
}
