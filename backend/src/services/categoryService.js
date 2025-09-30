import prisma from "../config/database.js";

export const createCategory = async (userId, data) => {
    const { name, description, color } = data;

    return await prisma.category.create({
        data: {
            name,
            description: description || null,
            color: color || "#6B73FF",
            userId,
        },
    });
};

export const getUserCategories = async (userId) => {
    return await prisma.category.findMany({
        where: { userId },
        orderBy: { name: "asc" },
        include: {
            _count: {
                select: {
                    notes: true,
                },
            },
        },
    });
};

export const getCategoryById = async (userId, categoryId) => {
    return await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
        include: {
            notes: {
                orderBy: { createdAt: "desc" },
            },
        },
    });
};

export const getCategoryWithNotes = async (userId, categoryId) => {
    return await prisma.category.findFirst({
        where: {
            id: categoryId,
            userId,
        },
        include: {
            notes: {
                orderBy: { createdAt: "desc" },
                include: {
                    category: true,
                },
            },
        },
    });
};

export const updateCategory = async (userId, categoryId, updateData) => {
    return await prisma.category.update({
        where: {
            id: categoryId,
            userId,
        },
        data: updateData,
    });
};

export const deleteCategory = async (userId, categoryId) => {
    return await prisma.category.delete({
        where: {
            id: categoryId,
            userId,
        },
    });
};
