// services/notesService.js
import api from "./api";

export const notesService = {
    getNotes: async () => {
        const response = await api.get("/notes");
        return response.data;
    },

    createNote: async (noteData) => {
        const payload = {
            ...noteData,
            categoryId: noteData.categoryId || null,
            tags: noteData.tags || [],
            isPinned: noteData.isPinned || false,
        };

        const response = await api.post("/notes", payload);
        return response.data;
    },

    updateNote: async (id, noteData) => {
        const payload = {
            ...noteData,
            categoryId: noteData.categoryId || null,
            tags: noteData.tags || [],
            isPinned: noteData.isPinned || false,
        };

        const response = await api.put(`/notes/${id}`, payload);
        return response.data;
    },

    deleteNote: async (id) => {
        const response = await api.delete(`/notes/${id}`);
        return response.data;
    },
};
