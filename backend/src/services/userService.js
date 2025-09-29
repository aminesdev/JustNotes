import prisma from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateVerificationCode } from "../utils/generateToken.js";

export async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email },
    });
}

export async function createUser(email, password, role) {
    const hashedPassword = await hashPassword(password);
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role.toUpperCase(),
            verificationCode,
            verificationCodeExpiry,
            isVerified: false,
        },
    });
}

export async function verifyUserCredentials(email, password) {
    const user = await findUserByEmail(email);
    if (!user) return null;

    const isMatch = await comparePassword(password, user.password);
    return isMatch ? user : null;
}

export async function findUserById(id) {
    return await prisma.user.findUnique({
        where: { id },
    });
}

export async function verifyUserEmail(code) {
    const user = await prisma.user.findFirst({
        where: {
            verificationCode: code,
            verificationCodeExpiry: {
                gte: new Date(),
            },
        },
    });

    if (!user) {
        throw new Error("Invalid or expired verification code");
    }

    return await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationCode: null,
            verificationCodeExpiry: null,
        },
    });
}

export async function updateUserVerificationCode(email) {
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    return await prisma.user.update({
        where: { email },
        data: {
            verificationCode,
            verificationCodeExpiry,
        },
    });
}

export async function setPasswordResetCode(email) {
    const resetCode = generateVerificationCode();
    const resetCodeExpiry = new Date(Date.now() + 15 * 60 * 1000);

    return await prisma.user.update({
        where: { email },
        data: {
            verificationCode: resetCode,
            verificationCodeExpiry: resetCodeExpiry,
        },
    });
}

export async function resetUserPassword(code, newPassword) {
    const user = await prisma.user.findFirst({
        where: {
            verificationCode: code,
            verificationCodeExpiry: {
                gte: new Date(),
            },
        },
    });

    if (!user) {
        throw new Error("Invalid or expired reset code");
    }

    const hashedPassword = await hashPassword(newPassword);

    return await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            verificationCode: null,
            verificationCodeExpiry: null,
        },
    });
}

export async function setupUserEncryption(
    userId,
    publicKey,
    encryptedPrivateKey
) {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            publicKey,
            encryptedPrivateKey,
        },
    });
}

export async function getUserEncryptionKeys(userId) {
    return await prisma.user.findUnique({
        where: { id: userId },
        select: {
            publicKey: true,
            encryptedPrivateKey: true,
        },
    });
}

export async function updateUserEncryptionKeys(
    userId,
    publicKey,
    encryptedPrivateKey
) {
    return await prisma.user.update({
        where: { id: userId },
        data: {
            publicKey,
            encryptedPrivateKey,
        },
    });
}
