import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Label} from '@/components/ui/label';
import {Switch} from '@/components/ui/switch';
import {useNotesStore} from '../../stores/notesStore';
import {useCategoriesStore} from '../../stores/categoriesStore';

const NoteForm = ({note, onSave, onCancel}) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [],
        categoryId: '',
        isPinned: false
    });
    const [newTag, setNewTag] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {categories, fetchCategories} = useCategoriesStore();

    useEffect(() => {
        fetchCategories().catch(err => console.error('Failed to fetch categories:', err));
    }, [fetchCategories]);

    useEffect(() => {
        if (note) {
            setFormData({
                title: note.title || '',
                content: note.content || '',
                tags: note.tags || [],
                categoryId: note.categoryId || '',
                isPinned: note.isPinned || false
            });
        }
    }, [note]);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        else if (formData.title.length > 500) newErrors.title = 'Title too long';

        if (!formData.content.trim()) newErrors.content = 'Content is required';
        else if (formData.content.length > 100000) newErrors.content = 'Content too long';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            console.log('Sending note data:', formData);
            await onSave(formData);
        } catch (error) {
            console.error('Save error:', error);
            setErrors({submit: error.message || 'Failed to save note'});
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({...prev, tags: [...prev.tags, newTag.trim()]}));
            setNewTag('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {errors.submit && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                    {errors.submit}
                </div>
            )}
            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                    required
                    className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && <p className="text-sm text-red-600">{errors.title}</p>}
            </div>
            {/* Content */}
            <div className="space-y-2">
                <Label htmlFor="content">Content *</Label>
                <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({...prev, content: e.target.value}))}
                    rows={8}
                    required
                    className={errors.content ? 'border-red-500' : ''}
                />
                {errors.content && <p className="text-sm text-red-600">{errors.content}</p>}
            </div>
            {/* Tags */}
            <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                    <Input
                        placeholder="Add a tag"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">Add</Button>
                </div>
                {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {formData.tags.map((tag, i) => (
                            <div key={i} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                                <span>{tag}</span>
                                <button type="button" onClick={() => handleRemoveTag(tag)}>×</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {/* Category */}
            <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <select
                    id="category"
                    value={formData.categoryId}
                    onChange={(e) => setFormData(prev => ({...prev, categoryId: e.target.value}))}
                    className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                    disabled={categories.length === 0}
                >
                    <option value="">No category</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>
            {/* Pinned */}
            <div className="flex items-center space-x-2">
                <Switch
                    id="isPinned"
                    checked={formData.isPinned}
                    onCheckedChange={(checked) => setFormData(prev => ({...prev, isPinned: checked}))}
                />
                <Label htmlFor="isPinned">Pin this note</Label>
            </div>
            {/* Actions */}
            <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                    {isSubmitting ? 'Saving...' : (note ? 'Update Note' : 'Create Note')}
                </Button>
                <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            </div>
        </form>
    );
};

export default NoteForm;