import prisma from "../config/database.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

export async function findUserByUsername(username) {
    return await prisma.user.findUnique({
        where: { username },
    });
}

export async function createUser(username, password, role) {
    const hashedPassword = await hashPassword(password);

    return await prisma.user.create({
        data: {
            username,
            password: hashedPassword,
            role: role.toUpperCase(), 
        },
    });
}

export async function verifyUserCredentials(username, password) {
    const user = await findUserByUsername(username);
    if (!user) return null;

    const isMatch = await comparePassword(password, user.password);
    return isMatch ? user : null;
}

export async function findUserById(id) {
    return await prisma.user.findUnique({
        where: { id },
    });
}
