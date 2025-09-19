import User from "../models/User.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

export async function findUserByUsername(username) {
    return await User.findOne({ username });
}

export async function createUser(username, password, role) {
    const user = new User({ username, password, role });
    return await user.save();
}

export async function verifyUserCredentials(username, password) {
    const user = await User.findOne({ username });
    if (!user) return null;
    const isMatch = await user.comparePassword(password);
    return isMatch ? user : null;
}

export async function findUserById(id) {
    return await User.findById(id);
}