import React from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {useNotesStore} from '../../stores/notesStore';
import {formatDate, truncateText} from '../../utils/helpers';

const NoteCard = ({note}) => {
    const {setCurrentNote, deleteNote, updateNote} = useNotesStore();

    const handleEdit = () => {
        setCurrentNote(note);
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this note?')) {
            await deleteNote(note.id);
        }
    };

    const handleTogglePin = async () => {
        try {
            await updateNote(note.id, {
                ...note,
                isPinned: !note.isPinned
            });
        } catch (error) {
            console.error('Failed to toggle pin:', error);
        }
    };

    return (
        <Card className="group hover:shadow-md transition-all duration-200 border-l-4"
            style={{borderLeftColor: note.category?.color || '#6B73FF'}}>
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-2 leading-tight flex-1">
                        {truncateText(note.title, 60)}
                    </CardTitle>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleTogglePin}
                            className="h-8 w-8"
                            title={note.isPinned ? "Unpin note" : "Pin note"}
                        >
                            {note.isPinned ? <PinnedIcon /> : <UnpinnedIcon />}
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleEdit}
                            className="h-8 w-8"
                        >
                            <EditIcon />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleDelete}
                            className="h-8 w-8 text-destructive"
                        >
                            <DeleteIcon />
                        </Button>
                    </div>
                </div>
                <CardDescription className="flex justify-between items-center">
                    <span>{formatDate(note.createdAt)}</span>
                    {note.isPinned && (
                        <Badge variant="secondary" className="text-xs">
                            Pinned
                        </Badge>
                    )}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                    {truncateText(note.content, 120)}
                </p>

                {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                        {note.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                            </Badge>
                        ))}
                        {note.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                                +{note.tags.length - 3}
                            </Badge>
                        )}
                    </div>
                )}

                {note.category && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div
                            className="w-3 h-3 rounded-full border border-gray-200"
                            style={{backgroundColor: note.category.color || '#6B73FF'}}
                        />
                        <span>{note.category.name}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

const EditIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
);

const DeleteIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const PinnedIcon = () => (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
    </svg>
);

const UnpinnedIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

export default NoteCard;