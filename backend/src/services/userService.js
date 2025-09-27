import prisma from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateVerificationToken } from "../utils/generateToken.js";

export async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email },
    });
}
export async function createUser(email, password, role) {
    const hashedPassword = await hashPassword(password);
    const verificationToken = generateVerificationToken();

    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role.toUpperCase(),
            verificationToken,
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

export async function verifyUserEmail(token) {
    const user = await prisma.user.findFirst({
        where: { verificationToken: token },
    });

    if (!user) {
        throw new Error("Invalid verification token");
    }

    return await prisma.user.update({
        where: { id: user.id },
        data: {
            isVerified: true,
            verificationToken: null,
        },
    });
}

export async function updateUserVerificationToken(email, token) {
    return await prisma.user.update({
        where: { email },
        data: { verificationToken: token },
    });
}

export async function setPasswordResetToken(email, token) {
    return await prisma.user.update({
        where: { email },
        data: {
            verificationToken: token,
        },
    });
}

export async function resetPassword(token, newPassword) {
    const user = await prisma.user.findFirst({
        where: { verificationToken: token },
    });

    if (!user) {
        throw new Error("Invalid reset token");
    }

    const hashedPassword = await hashPassword(newPassword);

    return await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            verificationToken: null,
        },
    });
}

export async function resetUserPassword(token, newPassword) {
    const user = await prisma.user.findFirst({
        where: { verificationToken: token },
    });

    if (!user) {
        throw new Error("Invalid reset token");
    }

    const hashedPassword = await hashPassword(newPassword);

    return await prisma.user.update({
        where: { id: user.id },
        data: {
            password: hashedPassword,
            verificationToken: null,
        },
    });
}