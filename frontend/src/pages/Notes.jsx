import React, {useEffect} from 'react';
import NoteList from '@/components/notes/NoteList';
import NoteEditor from '@/components/notes/NoteEditor';
import {useNotesStore} from '../stores/notesStore';
import {useCategoriesStore} from '../stores/categoriesStore';

const Notes = () => {
    const {
        fetchNotes,
        isLoading,
        currentCategoryFilter
    } = useNotesStore();

    const {categories, fetchCategories} = useCategoriesStore();

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchNotes(),
                fetchCategories()
            ]);
        };
        loadData();
    }, []); // Empty dependency array - run only once

    // Reload when category filter changes
    useEffect(() => {
        if (currentCategoryFilter) {
            fetchNotes(true); // force refresh
        }
    }, [currentCategoryFilter]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        {currentCategoryFilter ?
                            `Notes - ${categories.find(c => c.id === currentCategoryFilter)?.name || 'Category'}`
                            : 'All Notes'
                        }
                    </h1>
                    <p className="text-muted-foreground">
                        {currentCategoryFilter ?
                            `Notes in this category`
                            : 'Manage your encrypted notes'
                        }
                    </p>
                </div>
                <NoteEditor />
            </div>

            <NoteList />
        </div>
    );
};

export default Notes;