import api from "./api";

export const notesService = {
    getNotes: async () => {
        try {
            const response = await api.get("/notes");
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error("Notes service - getNotes error:", error);
            throw error;
        }
    },

    getNoteById: async (id) => {
        try {
            const response = await api.get(`/notes/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Notes service - getNoteById error:", error);
            throw error;
        }
    },

    createNote: async (noteData) => {
        try {
            // Match the exact API payload structure from your docs
            const payload = {
                title: noteData.title?.trim() || "",
                content: noteData.content?.trim() || "",
                categoryId: noteData.categoryId || null,
                tags: Array.isArray(noteData.tags) ? noteData.tags : [],
                isPinned: Boolean(noteData.isPinned),
            };

            console.log("Creating note with payload:", payload);

            // Validate required fields
            if (!payload.title || !payload.content) {
                throw new Error("Title and content are required");
            }

            const response = await api.post("/notes", payload);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Notes service - createNote error:", error);
            throw error;
        }
    },

    updateNote: async (id, noteData) => {
        try {
            // Match the exact API payload structure from your docs
            const payload = {
                title: noteData.title?.trim() || "",
                content: noteData.content?.trim() || "",
                categoryId: noteData.categoryId || null,
                tags: Array.isArray(noteData.tags) ? noteData.tags : [],
                isPinned: Boolean(noteData.isPinned),
            };

            console.log("Updating note with payload:", payload);

            // Validate required fields
            if (!payload.title || !payload.content) {
                throw new Error("Title and content are required");
            }

            const response = await api.put(`/notes/${id}`, payload);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Notes service - updateNote error:", error);
            throw error;
        }
    },

    deleteNote: async (id) => {
        try {
            const response = await api.delete(`/notes/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Notes service - deleteNote error:", error);
            throw error;
        }
    },
};
