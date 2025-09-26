import prisma from "../config/database.js";

export const createNote = async (userId, data) => {
    const { title, content, category, tags, isPinned } = data;

    return await prisma.note.create({
        data: {
            title,
            content,
            category: category || "general",
            tags: tags || [],
            isPinned: isPinned || false,
            userId,
        },
    });
};

export const getNotes = async (userId) => {
    return await prisma.note.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
    });
};

export const getNoteById = async (userId, noteId) => {
    return await prisma.note.findFirst({
        where: {
            id: noteId,
            userId,
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
