import prisma from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

export async function findUserByEmail(email) {
    return await prisma.user.findUnique({
        where: { email },
    });
}


export async function createUser(email, password, role) {
    const hashedPassword = await hashPassword(password);

    return await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            role: role.toUpperCase(),
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
