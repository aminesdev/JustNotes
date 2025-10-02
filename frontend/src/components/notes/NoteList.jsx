import React from 'react';
import {useNotesStore} from '../../stores/notesStore';
import NoteCard from './NoteCard';
import {Button} from '@/components/ui/button';
import {useNavigate} from 'react-router-dom';

const NoteList = () => {
    const navigate = useNavigate();
    const {
        notes,
        isLoading,
        getFilteredNotes,
        searchQuery
    } = useNotesStore();

    const filteredNotes = getFilteredNotes();
    const pinnedNotes = filteredNotes.filter(note => note.isPinned);
    const unpinnedNotes = filteredNotes.filter(note => !note.isPinned);

    const handleNewNote = () => {
        navigate('/notes/new');
    };

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
                    <Button onClick={handleNewNote}>
                        New Note
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Pinned Notes Section */}
            {pinnedNotes.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <PinIcon className="h-5 w-5" />
                        <h2 className="text-xl font-semibold">Pinned</h2>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {pinnedNotes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </div>
                </div>
            )}

            {/* Regular Notes Section */}
            {unpinnedNotes.length > 0 && (
                <div className="space-y-4">
                    {pinnedNotes.length > 0 && (
                        <h2 className="text-xl font-semibold">All Notes</h2>
                    )}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {unpinnedNotes.map((note) => (
                            <NoteCard key={note.id} note={note} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// Pin icon component
const PinIcon = ({className}) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
    </svg>
);

export default NoteList;