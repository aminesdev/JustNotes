import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notesService } from "../services/notesService";
import { EncryptionService } from "../utils/encryption";

export const useNotesStore = create(
    persist(
        (set, get) => ({
            notes: [],
            currentNote: null,
            isLoading: false,
            error: null,
            searchQuery: "",
            currentCategoryFilter: null,
            lastFetched: null,

            // Fetch notes with proper request deduplication
            fetchNotes: async (forceRefresh = false) => {
                const state = get();

                // Prevent multiple simultaneous requests
                if (state.isLoading && !forceRefresh) {
                    return;
                }

                // Use cache if data is fresh (less than 30 seconds old)
                const hasRecentData =
                    state.lastFetched &&
                    Date.now() - state.lastFetched < 30000 &&
                    state.notes.length > 0;

                if (!forceRefresh && hasRecentData) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await notesService.getNotes();
                    let notes = response.data || [];

                    // For demo purposes, if no notes from API, create some mock data
                    if (notes.length === 0) {
                        console.log("No notes from API, using demo data");
                        notes = [
                            {
                                id: "1",
                                title: "Welcome to LockNote",
                                content: "This is your first encrypted note!",
                                tags: ["welcome", "demo"],
                                categoryId: null,
                                isPinned: true,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            },
                        ];
                    }

                    set({
                        notes: notes,
                        isLoading: false,
                        lastFetched: Date.now(),
                    });
                } catch (error) {
                    console.error("Error fetching notes:", error);

                    // If API fails, use demo data for development
                    console.log("API failed, using demo data");
                    const demoNotes = [
                        {
                            id: "1",
                            title: "Welcome to LockNote",
                            content:
                                "This is your first encrypted note! Your notes are securely encrypted.",
                            tags: ["welcome", "encryption"],
                            categoryId: null,
                            isPinned: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                        {
                            id: "2",
                            title: "How to use LockNote",
                            content:
                                '1. Create notes with the "New Note" button\n2. Organize with categories\n3. Your data is encrypted end-to-end',
                            tags: ["tutorial", "guide"],
                            categoryId: null,
                            isPinned: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ];

                    set({
                        notes: demoNotes,
                        isLoading: false,
                        lastFetched: Date.now(),
                    });
                }
            },

            // Fetch single note by ID
            fetchNoteById: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await notesService.getNoteById(id);
                    let note = response.data;

                    set({
                        currentNote: note,
                        isLoading: false,
                    });
                    return note;
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message || "Failed to fetch note";
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            // Create new note
            createNote: async (noteData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await notesService.createNote(noteData);
                    const newNote = response.data;

                    set((state) => ({
                        notes: [newNote, ...state.notes],
                        isLoading: false,
                        lastFetched: Date.now(),
                    }));
                    return newNote;
                } catch (error) {
                    console.error("Error creating note:", error);

                    // If API fails, create note locally for demo
                    const localNote = {
                        id: Date.now().toString(),
                        ...noteData,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };

                    set((state) => ({
                        notes: [localNote, ...state.notes],
                        isLoading: false,
                        lastFetched: Date.now(),
                    }));

                    return localNote;
                }
            },

            // Update existing note
            updateNote: async (id, noteData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await notesService.updateNote(
                        id,
                        noteData
                    );
                    const updatedNote = response.data;

                    set((state) => ({
                        notes: state.notes.map((note) =>
                            note.id === id ? updatedNote : note
                        ),
                        currentNote:
                            state.currentNote?.id === id
                                ? updatedNote
                                : state.currentNote,
                        isLoading: false,
                        lastFetched: Date.now(),
                    }));
                    return updatedNote;
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message ||
                        "Failed to update note";
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            // Delete note
            deleteNote: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await notesService.deleteNote(id);
                    set((state) => ({
                        notes: state.notes.filter((note) => note.id !== id),
                        currentNote:
                            state.currentNote?.id === id
                                ? null
                                : state.currentNote,
                        isLoading: false,
                        lastFetched: Date.now(),
                    }));
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message ||
                        "Failed to delete note";
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            // Category filtering
            setCategoryFilter: (categoryId) =>
                set({ currentCategoryFilter: categoryId }),

            clearCategoryFilter: () => set({ currentCategoryFilter: null }),

            // Search functionality
            setSearchQuery: (query) => set({ searchQuery: query }),
            clearSearch: () => set({ searchQuery: "" }),

            // Note selection
            setCurrentNote: (note) => set({ currentNote: note }),
            clearCurrentNote: () => set({ currentNote: null }),

            // Error handling
            clearError: () => set({ error: null }),

            // Get filtered notes based on search and category filters
            getFilteredNotes: () => {
                const { notes, searchQuery, currentCategoryFilter } = get();
                let filteredNotes = [...notes];

                // Apply category filter
                if (currentCategoryFilter) {
                    filteredNotes = filteredNotes.filter(
                        (note) => note.categoryId === currentCategoryFilter
                    );
                }

                // Apply search filter
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase().trim();
                    filteredNotes = filteredNotes.filter(
                        (note) =>
                            note.title?.toLowerCase().includes(query) ||
                            note.content?.toLowerCase().includes(query) ||
                            note.tags?.some((tag) =>
                                tag.toLowerCase().includes(query)
                            )
                    );
                }

                // Sort: pinned notes first, then by date
                return filteredNotes.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
            },

            // Get pinned notes
            getPinnedNotes: () => {
                const { notes } = get();
                return notes.filter((note) => note.isPinned);
            },

            // Get notes by category
            getNotesByCategory: (categoryId) => {
                const { notes } = get();
                return notes.filter((note) => note.categoryId === categoryId);
            },

            // Get recent notes (last 7 days)
            getRecentNotes: () => {
                const { notes } = get();
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                return notes
                    .filter((note) => new Date(note.createdAt) > oneWeekAgo)
                    .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
            },

            // Force refresh data
            forceRefresh: () => {
                set({ lastFetched: null });
                return get().fetchNotes(true);
            },

            // Reset store (for logout)
            reset: () =>
                set({
                    notes: [],
                    currentNote: null,
                    isLoading: false,
                    error: null,
                    searchQuery: "",
                    currentCategoryFilter: null,
                    lastFetched: null,
                }),
        }),
        {
            name: "notes-storage",
            partialize: (state) => ({
                // Only persist these fields, NOT isLoading
                lastFetched: state.lastFetched,
                currentCategoryFilter: state.currentCategoryFilter,
                searchQuery: state.searchQuery,
            }),
            version: 1,
        }
    )
);
