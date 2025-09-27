import prisma from "../config/database.js";

export const createNote = async (userId, data) => {
    const { title, content, categoryId, tags, isPinned } = data;

    return await prisma.note.create({
        data: {
            title,
            content,
            categoryId: categoryId || null,
            tags: tags || [],
            isPinned: isPinned || false,
            userId,
        },
        include: {
            category: true,
        },
    });
};

export const getNotes = async (userId) => {
    return await prisma.note.findMany({
        where: { userId },
        include: {
            category: true,
        },
        orderBy: { createdAt: "desc" },
    });
};

export const getNoteById = async (userId, noteId) => {
    return await prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
        },
        include: {
            category: true,
        },
    });
};

export const updateNote = async (userId, noteId, updateData) => {
    return await prisma.note.update({
        where: {
            id: noteId,
            userId,
        },
        data: updateData,
        include: {
            category: true,
        },
    });
};

export const deleteNote = async (userId, noteId) => {
    return await prisma.note.delete({
        where: {
            id: noteId,
            userId,
        },
    });
};
