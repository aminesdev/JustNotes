import { create } from "zustand";
import { notesService } from "../services/notesService";

export const useNotesStore = create((set, get) => ({
    notes: [],
    currentNote: null,
    isLoading: false,
    error: null,
    searchQuery: "",

    fetchNotes: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await notesService.getNotes();
            set({
                notes: response.data || [],
                isLoading: false,
            });
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Failed to fetch notes";
            set({
                isLoading: false,
                error: errorMessage,
            });
        }
    },

    fetchNoteById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await notesService.getNoteById(id);
            set({
                currentNote: response.data,
                isLoading: false,
            });
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Failed to fetch note";
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    createNote: async (noteData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await notesService.createNote(noteData);
            set((state) => ({
                notes: [response.data, ...state.notes],
                isLoading: false,
            }));
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Failed to create note";
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    updateNote: async (id, noteData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await notesService.updateNote(id, noteData);
            set((state) => ({
                notes: state.notes.map((note) =>
                    note.id === id ? response.data : note
                ),
                currentNote: response.data,
                isLoading: false,
            }));
            return response.data;
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Failed to update note";
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    deleteNote: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await notesService.deleteNote(id);
            set((state) => ({
                notes: state.notes.filter((note) => note.id !== id),
                currentNote:
                    state.currentNote?.id === id ? null : state.currentNote,
                isLoading: false,
            }));
        } catch (error) {
            const errorMessage =
                error.response?.data?.msg || "Failed to delete note";
            set({
                isLoading: false,
                error: errorMessage,
            });
            throw error;
        }
    },

    setCurrentNote: (note) => set({ currentNote: note }),
    clearCurrentNote: () => set({ currentNote: null }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    clearError: () => set({ error: null }),

    getFilteredNotes: () => {
        const { notes, searchQuery } = get();
        if (!searchQuery) return notes;

        return notes.filter(
            (note) =>
                note.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    },

    getPinnedNotes: () => {
        const { notes } = get();
        return notes.filter((note) => note.isPinned);
    },
}));
