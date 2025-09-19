import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
    const saltRounds = parseInt(process.env.ROUNDS, 10) || 10;
    return await bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};