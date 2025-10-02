import React, {useEffect, useState} from 'react';
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
    const [dataLoaded, setDataLoaded] = useState(false);

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            try {
                await Promise.all([
                    fetchNotes(),
                    fetchCategories()
                ]);
                setDataLoaded(true);
            } catch (error) {
                console.error('Error loading data:', error);
                setDataLoaded(true); // Still set as loaded to show UI
            }
        };
        loadData();
    }, [fetchNotes, fetchCategories]);

    // Reload when category filter changes
    useEffect(() => {
        if (currentCategoryFilter && dataLoaded) {
            fetchNotes(true);
        }
    }, [currentCategoryFilter, dataLoaded]);

    if (isLoading && !dataLoaded) {
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
                            : 'Manage your notes'
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