import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';

const NoteEditor = () => {
    const navigate = useNavigate();

    const handleNewNote = () => {
        navigate('/notes/new');
    };

    return (
        <Button
            onClick={handleNewNote}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
            New Note
        </Button>
    );
};

export default NoteEditor;