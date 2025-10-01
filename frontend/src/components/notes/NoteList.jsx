import React from 'react';
import {useNotesStore} from '../../stores/notesStore';
import NoteCard from './NoteCard';
import {Button} from '@/components/ui/button';
import NoteEditor from './NoteEditor';

const NoteList = () => {
    const {
        notes,
        isLoading,
        getFilteredNotes,
        searchQuery
    } = useNotesStore();

    const filteredNotes = getFilteredNotes();

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (filteredNotes.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="space-y-4">
                    <h3 className="text-lg font-medium">
                        {searchQuery ? 'No notes found' : 'No notes yet'}
                    </h3>
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? 'Try adjusting your search terms'
                            : 'Get started by creating your first note'
                        }
                    </p>
                    <NoteEditor />
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
            ))}
        </div>
    );
};

export default NoteList;