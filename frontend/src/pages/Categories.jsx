import React, {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {useCategoriesStore} from '../stores/categoriesStore';
import Modal from '@/components/common/Modal';

const Categories = () => {
    const {
        categories,
        isLoading,
        error,
        validationErrors,
        fetchCategories,
        createCategory,
        updateCategory,
        deleteCategory,
        clearError,
        clearValidationErrors
    } = useCategoriesStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategory, setNewCategory] = useState({
        name: '',
        description: '',
        color: '#6B73FF'
    });
    const [createLoading, setCreateLoading] = useState(false);
    const [createError, setCreateError] = useState('');
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleColorChange = (e) => {
        const newColor = e.target.value;
        setNewCategory(prev => ({...prev, color: newColor}));
    };

    const validateForm = () => {
        const errors = {};

        if (!newCategory.name.trim()) {
            errors.name = 'Category name is required';
        } else if (newCategory.name.length > 100) {
            errors.name = 'Category name must be less than 100 characters';
        }
        
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();
        setCreateError('');
        setFormErrors({});
        clearError();
        clearValidationErrors();

        if (!validateForm()) {
            return;
        }

        setCreateLoading(true);

        try {
            const categoryData = {
                name: newCategory.name.trim(),
                description: newCategory.description.trim() || null,
                color: newCategory.color || '#6B73FF'
            };

            await createCategory(categoryData);

            setNewCategory({name: '', description: '', color: '#6B73FF'});
            setIsModalOpen(false);
            await fetchCategories();
        } catch (error) {
            console.error('Category creation error:', error);
            setCreateError(error.message || 'Failed to create category');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategory({
            name: category.name,
            description: category.description || '',
            color: category.color || '#6B73FF'
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateCategory = async (e) => {
        e.preventDefault();
        setCreateError('');
        setFormErrors({});
        clearError();
        clearValidationErrors();

        if (!validateForm()) {
            return;
        }

        setCreateLoading(true);

        try {
            const categoryData = {
                name: newCategory.name.trim(),
                description: newCategory.description.trim() || null,
                color: newCategory.color || '#6B73FF'
            };

            await updateCategory(editingCategory.id, categoryData);

            setNewCategory({name: '', description: '', color: '#6B73FF'});
            setEditingCategory(null);
            setIsEditModalOpen(false);
            await fetchCategories();
        } catch (error) {
            console.error('Category update error:', error);
            setCreateError(error.message || 'Failed to update category');
        } finally {
            setCreateLoading(false);
        }
    };

    const handleDeleteCategory = async (category) => {
        if (window.confirm(`Are you sure you want to delete the category "${category.name}"? This will not delete the notes in this category.`)) {
            try {
                await deleteCategory(category.id);
                await fetchCategories();
            } catch (error) {
                console.error('Category deletion error:', error);
                setCreateError(error.message || 'Failed to delete category');
            }
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setNewCategory({name: '', description: '', color: '#6B73FF'});
        setCreateError('');
        setFormErrors({});
        clearError();
        clearValidationErrors();
    };

    const handleEditModalClose = () => {
        setIsEditModalOpen(false);
        setEditingCategory(null);
        setNewCategory({name: '', description: '', color: '#6B73FF'});
        setCreateError('');
        setFormErrors({});
        clearError();
        clearValidationErrors();
    };

    const getFieldError = (fieldName) => {
        return formErrors[fieldName] || validationErrors[fieldName];
    };

    // Function to get note count safely
    const getNoteCount = (category) => {
        return category.noteCount || category._count?.notes || 0;
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                    <p className="text-muted-foreground">
                        Organize your notes with categories
                    </p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>New Category</Button>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : categories.length > 0 ? (
                <div className="space-y-4">
                    {categories.map((category) => (
                        <CategoryListItem
                            key={category.id}
                            category={category}
                            noteCount={getNoteCount(category)}
                            onEdit={handleEditCategory}
                            onDelete={handleDeleteCategory}
                        />
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="text-center space-y-2">
                            <h3 className="text-lg font-medium">No categories yet</h3>
                            <p className="text-muted-foreground">
                                Create your first category to organize your notes
                            </p>
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4"
                            >
                                Create Your First Category
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Create Category Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                title="Create New Category"
                description="Add a new category to organize your notes"
                size="md"
            >
                <form onSubmit={handleCreateCategory} className="space-y-4">
                    {createError && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {typeof createError === 'string' ? createError : 'Failed to create category'}
                            </AlertDescription>
                        </Alert>
                    )}

                    {Object.keys(validationErrors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                <ul className="list-disc list-inside space-y-1">
                                    {Object.entries(validationErrors).map(([field, error]) => (
                                        <li key={field}>
                                            {typeof error === 'string'
                                                ? error
                                                : error.msg || JSON.stringify(error)
                                            }
                                        </li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name *</label>
                        <Input
                            placeholder="Enter category name"
                            value={newCategory.name}
                            onChange={(e) => {
                                setNewCategory(prev => ({...prev, name: e.target.value}));
                                if (formErrors.name) {
                                    setFormErrors(prev => ({...prev, name: ''}));
                                }
                            }}
                            required
                            disabled={createLoading}
                            className={getFieldError('name') ? 'border-red-500' : ''}
                        />
                        {getFieldError('name') && (
                            <p className="text-sm text-red-600">{getFieldError('name')}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <Input
                            placeholder="Enter description"
                            value={newCategory.description}
                            onChange={(e) => {
                                setNewCategory(prev => ({...prev, description: e.target.value}));
                                if (formErrors.description) {
                                    setFormErrors(prev => ({...prev, description: ''}));
                                }
                            }}
                            disabled={createLoading}
                            className={getFieldError('description') ? 'border-red-500' : ''}
                        />
                        {getFieldError('description') && (
                            <p className="text-sm text-red-600">{getFieldError('description')}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Color</label>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={newCategory.color}
                                    onChange={handleColorChange}
                                    className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                                    disabled={createLoading}
                                    style={{
                                        backgroundColor: newCategory.color,
                                    }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground font-mono bg-gray-100 px-2 py-1 rounded">
                                    {newCategory.color}
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewCategory(prev => ({...prev, color: '#6B73FF'}))}
                                    className="mt-1 text-xs"
                                >
                                    Reset to default
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={createLoading}
                        >
                            {createLoading ? 'Creating...' : 'Create Category'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleModalClose}
                            disabled={createLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Edit Category Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={handleEditModalClose}
                title="Edit Category"
                description="Update your category details"
                size="md"
            >
                <form onSubmit={handleUpdateCategory} className="space-y-4">
                    {createError && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                {typeof createError === 'string' ? createError : 'Failed to update category'}
                            </AlertDescription>
                        </Alert>
                    )}

                    {Object.keys(validationErrors).length > 0 && (
                        <Alert variant="destructive">
                            <AlertDescription>
                                <ul className="list-disc list-inside space-y-1">
                                    {Object.entries(validationErrors).map(([field, message]) => (
                                        <li key={field}>{message}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category Name *</label>
                        <Input
                            placeholder="Enter category name"
                            value={newCategory.name}
                            onChange={(e) => {
                                setNewCategory(prev => ({...prev, name: e.target.value}));
                                if (formErrors.name) {
                                    setFormErrors(prev => ({...prev, name: ''}));
                                }
                            }}
                            required
                            disabled={createLoading}
                            className={getFieldError('name') ? 'border-red-500' : ''}
                        />
                        {getFieldError('name') && (
                            <p className="text-sm text-red-600">{getFieldError('name')}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description (Optional)</label>
                        <Input
                            placeholder="Enter description"
                            value={newCategory.description}
                            onChange={(e) => {
                                setNewCategory(prev => ({...prev, description: e.target.value}));
                                if (formErrors.description) {
                                    setFormErrors(prev => ({...prev, description: ''}));
                                }
                            }}
                            disabled={createLoading}
                            className={getFieldError('description') ? 'border-red-500' : ''}
                        />
                        {getFieldError('description') && (
                            <p className="text-sm text-red-600">{getFieldError('description')}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Color</label>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <input
                                    type="color"
                                    value={newCategory.color}
                                    onChange={handleColorChange}
                                    className="w-12 h-12 rounded cursor-pointer border-2 border-gray-300"
                                    disabled={createLoading}
                                    style={{
                                        backgroundColor: newCategory.color,
                                    }}
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm text-muted-foreground font-mono bg-gray-100 px-2 py-1 rounded">
                                    {newCategory.color}
                                </span>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setNewCategory(prev => ({...prev, color: '#6B73FF'}))}
                                    className="mt-1 text-xs"
                                >
                                    Reset to default
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            disabled={createLoading}
                        >
                            {createLoading ? 'Updating...' : 'Update Category'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleEditModalClose}
                            disabled={createLoading}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

// Category List Item Component
const CategoryListItem = ({category, noteCount, onEdit, onDelete}) => {
    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div
                            className="w-4 h-4 rounded-full flex-shrink-0 border"
                            style={{backgroundColor: category.color || '#6B73FF'}}
                        />
                        <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold truncate">{category.name}</h3>
                            {category.description && (
                                <p className="text-sm text-muted-foreground truncate">
                                    {category.description}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-4 ml-4">
                        <div className="text-sm text-muted-foreground text-right">
                            <div>{noteCount} {noteCount === 1 ? 'note' : 'notes'}</div>
                            <div className="text-xs">
                                {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(category)}
                                className="h-8"
                            >
                                Edit
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onDelete(category)}
                                className="h-8 bg-red-500"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default Categories;