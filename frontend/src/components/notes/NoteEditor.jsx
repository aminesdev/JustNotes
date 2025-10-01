import React, {useState, useEffect} from 'react';
import Modal from '../common/Modal';
import NoteForm from './NoteForm';
import {useNotesStore} from '../../stores/notesStore';
import {useAuthStore} from '../../stores/authStore';
import {Button} from '@/components/ui/button';

const NoteEditor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const {currentNote, createNote, updateNote, clearCurrentNote, fetchNotes} = useNotesStore();
    const {user} = useAuthStore();

    useEffect(() => {if (currentNote) setIsOpen(true);}, [currentNote]);

    const handleClose = () => {setIsOpen(false); clearCurrentNote();};

    const handleSave = async (noteData) => {
        try {
            if (currentNote) await updateNote(currentNote.id, noteData);
            else await createNote(noteData);
            await fetchNotes();
            handleClose();
        } catch (err) {
            alert('Failed to save note: ' + (err.response?.data?.message || err.message));
        }
    };

    const canCreateNote = user?.publicKey && user?.encryptedPrivateKey;

    return (
        <>
            <Button onClick={() => setIsOpen(true)} disabled={!canCreateNote}>
                New Note
            </Button>
            <Modal
                isOpen={isOpen || !!currentNote}
                onClose={handleClose}
                title={currentNote ? 'Edit Note' : 'Create New Note'}
                description={
                    !canCreateNote
                        ? "Encryption not setup. Please configure encryption in your profile to create notes."
                        : currentNote
                            ? "Edit your encrypted note."
                            : "Create a new encrypted note. All data is encrypted before saving."
                }
                size="lg"
            >
                {canCreateNote ? (
                    <NoteForm note={currentNote} onSave={handleSave} onCancel={handleClose} />
                ) : (
                    <div className="text-center py-6">
                        <p className="text-muted-foreground mb-4">
                            Encryption setup required to create notes.
                        </p>
                        <Button asChild><a href="/profile">Setup Encryption</a></Button>
                    </div>
                )}
            </Modal>
        </>
    );
};

export default NoteEditor;
