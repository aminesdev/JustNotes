import React, {useState, useEffect, useRef} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {useNotesStore} from '../stores/notesStore';
import {useCategoriesStore} from '../stores/categoriesStore';
import {Badge} from '@/components/ui/badge';

const NoteEditorPage = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const contentRef = useRef(null);

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState([]);
    const [categoryId, setCategoryId] = useState('');
    const [isPinned, setIsPinned] = useState(false);
    const [tagInput, setTagInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [error, setError] = useState('');

    const {createNote, updateNote, notes} = useNotesStore();
    const {categories} = useCategoriesStore();

    // Load existing note if editing
    useEffect(() => {
        if (id) {
            const note = notes.find(n => n.id === id);
            if (note) {
                setTitle(note.title || '');
                setContent(note.content || '');
                setTags(note.tags || []);
                setCategoryId(note.categoryId || '');
                setIsPinned(note.isPinned || false);
            }
        }
    }, [id, notes]);

    // Auto-save functionality
    useEffect(() => {
        if (!title && !content) return;

        const timeoutId = setTimeout(() => {
            handleSave(true);
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [title, content, tags, categoryId, isPinned]);

    const handleSave = async (autoSave = false) => {
        if (!title.trim() || !content.trim()) {
            if (!autoSave) {
                setError('Title and content are required');
            }
            return;
        }

        setIsSaving(true);
        setError('');

        try {
            const noteData = {
                title: title.trim(),
                content: content.trim(),
                tags: tags,
                categoryId: categoryId || null, // Ensure null instead of empty string
                isPinned: isPinned
            };

            console.log('Saving note data:', noteData);

            if (id) {
                await updateNote(id, noteData);
            } else {
                const newNote = await createNote(noteData);
                navigate(`/notes/${newNote.id}`, {replace: true});
            }

            setLastSaved(new Date());
        } catch (error) {
            console.error('Save error:', error);
            setError(error.message || 'Failed to save note');
            if (!autoSave) {
                alert('Failed to save note: ' + error.message);
            }
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
            }
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setTags(tags.filter(tag => tag !== tagToRemove));
    };

    const handleBack = () => {
        if (title || content) {
            if (window.confirm('You have unsaved changes. Save before leaving?')) {
                handleSave();
            }
        }
        navigate('/notes');
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <div className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" onClick={handleBack}>
                            <ArrowLeftIcon className="h-4 w-4 mr-2" />
                            Back
                        </Button>

                        {lastSaved && (
                            <span className="text-xs text-muted-foreground">
                                Saved {lastSaved.toLocaleTimeString()}
                            </span>
                        )}

                        {error && (
                            <span className="text-xs text-red-600">
                                {error}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Category Selector */}
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
                        >
                            <option value="">No category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>

                        {/* Pin Button */}
                        <Button
                            variant={isPinned ? "default" : "outline"}
                            size="sm"
                            onClick={() => setIsPinned(!isPinned)}
                            title={isPinned ? "Unpin note" : "Pin note"}
                        >
                            <PinIcon className="h-4 w-4" />
                        </Button>

                        {/* Save Button */}
                        <Button
                            onClick={() => handleSave(false)}
                            disabled={isSaving || !title.trim() || !content.trim()}
                            size="sm"
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Editor Content */}
            <div className="max-w-4xl mx-auto px-6 py-8">
                {/* Title */}
                <input
                    type="text"
                    placeholder="Untitled"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        setError('');
                    }}
                    className="w-full text-4xl font-bold border-none outline-none bg-transparent placeholder:text-muted-foreground mb-4"
                    autoFocus
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, i) => (
                        <Badge key={i} variant="secondary" className="cursor-pointer">
                            {tag}
                            <button
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 hover:text-destructive"
                            >
                                ×
                            </button>
                        </Badge>
                    ))}
                    <input
                        type="text"
                        placeholder="Add tag..."
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                        className="h-6 px-2 text-sm border-none outline-none bg-transparent placeholder:text-muted-foreground"
                    />
                </div>

                {/* Content */}
                <textarea
                    ref={contentRef}
                    placeholder="Start writing..."
                    value={content}
                    onChange={(e) => {
                        setContent(e.target.value);
                        setError('');
                    }}
                    className="w-full min-h-[calc(100vh-300px)] text-base border-none outline-none bg-transparent placeholder:text-muted-foreground resize-none"
                    style={{fontFamily: 'inherit'}}
                />
            </div>
        </div>
    );
};

const ArrowLeftIcon = ({className}) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const PinIcon = () => (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
    </svg>
);

const UnpinnedIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

export default NoteEditorPage;