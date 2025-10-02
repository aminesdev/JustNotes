# Project: src

## File: App.jsx
```jsx
import React, {useEffect} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import {useAuthStore} from './stores/authStore';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ConfirmCode from './pages/ConfirmCode';
import Login from './pages/Login';
import Register from './pages/Register';
import Notes from './pages/Notes';
import Categories from './pages/Categories';
import Profile from './pages/Profile';
import NoteEditorPage from './pages/NoteEditor';

const LoadingSpinner = () => (
    <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
);

const ProtectedRoute = ({children}) => {
    const {accessToken, user, isLoading, isInitialized} = useAuthStore();

    if (!isInitialized || isLoading) {
        return <LoadingSpinner />;
    }

    if (!accessToken || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const PublicRoute = ({children}) => {
    const {accessToken, user, isLoading, isInitialized} = useAuthStore();

    if (!isInitialized || isLoading) {
        return <LoadingSpinner />;
    }

    if (accessToken && user) {
        return <Navigate to="/notes" replace />;
    }

    return children;
};

function App() {
    const {initialize, isInitialized} = useAuthStore();

    useEffect(() => {
        console.log("App initializing...");
        initialize();
    }, [initialize]);

    if (!isInitialized) {
        return <LoadingSpinner />;
    }

    return (
        <Router>
            <Routes>
                <Route path="/login" element={
                    <PublicRoute>
                        <AuthLayout>
                            <Login />
                        </AuthLayout>
                    </PublicRoute>
                } />
                <Route path="/register" element={
                    <PublicRoute>
                        <AuthLayout>
                            <Register />
                        </AuthLayout>
                    </PublicRoute>
                } />
                <Route path="/forgot-password" element={
                    <PublicRoute>
                        <AuthLayout>
                            <ForgotPassword />
                        </AuthLayout>
                    </PublicRoute>
                } />
                <Route path="/reset-password" element={
                    <PublicRoute>
                        <AuthLayout>
                            <ResetPassword />
                        </AuthLayout>
                    </PublicRoute>
                } />
                <Route path="/confirm-code" element={
                    <PublicRoute>
                        <AuthLayout>
                            <ConfirmCode />
                        </AuthLayout>
                    </PublicRoute>
                } />

                <Route path="/*" element={
                    <ProtectedRoute>
                        <Layout>
                            <Routes>
                                <Route path="/notes" element={<Notes />} />
                                <Route path="/notes/new" element={<NoteEditorPage />} />
                                <Route path="/notes/:id" element={<NoteEditorPage />} />
                                <Route path="/categories" element={<Categories />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/" element={<Navigate to="/notes" replace />} />
                                <Route path="*" element={<Navigate to="/notes" replace />} />
                            </Routes>
                        </Layout>
                    </ProtectedRoute>
                } />
            </Routes>
        </Router>
    );
}

export default App;
```

## File: components/common/ErrorBoundary.jsx
```jsx
import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(error) {
        return {hasError: true};
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-4 bg-red-50 border border-red-200 rounded-md">
                    <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
                    <p className="text-red-600">Please refresh the page and try again.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                        Refresh Page
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
```

## File: components/common/Modal.jsx
```jsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

const Modal = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'default'
}) => {
    const sizes = {
        sm: 'max-w-md',
        default: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={`${sizes[size]} max-h-[90vh] overflow-y-auto`}>
                <DialogHeader>
                    {title && <DialogTitle>{title}</DialogTitle>}
                    {description && <DialogDescription>{description}</DialogDescription>}
                    {!description && <DialogDescription className="sr-only">Modal dialog</DialogDescription>}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
};

export default Modal;
```

## File: components/layout/AuthLayout.jsx
```jsx
import React from "react";

const AuthLayout = ({ children }) => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
            {children}
        </div>
    );
};

export default AuthLayout;

```

## File: components/layout/Header.jsx
```jsx
import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {useAppStore} from '../../stores/appStore';
import {useAuthStore} from '../../stores/authStore';
import {useNotesStore} from '../../stores/notesStore';

const Header = () => {
    const {toggleSidebar, theme, toggleTheme} = useAppStore();
    const {user, logout} = useAuthStore();
    const {searchQuery, setSearchQuery} = useNotesStore();
    const [localSearch, setLocalSearch] = useState('');

    // Initialize localSearch with the current searchQuery
    useEffect(() => {
        setLocalSearch(searchQuery || '');
    }, [searchQuery]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setLocalSearch(value);
        // Only set search query when user is actively searching
        // This prevents the email from being set as search query
        if (value.trim() === '' || value.length > 2) {
            setSearchQuery(value);
        }
    };

    const handleSearchSubmit = (e) => {
        if (e.key === 'Enter') {
            setSearchQuery(localSearch);
        }
    };

    const clearSearch = () => {
        setLocalSearch('');
        setSearchQuery('');
    };

    return (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Left side - Menu and Logo */}
                <div className="flex items-center gap-4 flex-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleSidebar}
                        className="md:hidden"
                    >
                        <MenuIcon />
                    </Button>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-semibold hidden sm:block">JustNotes</h1>
                    </div>
                </div>

                {/* Center - Search Bar */}
                <div className="flex-1 max-w-2xl mx-4">
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder="Search notes..."
                            value={localSearch}
                            onChange={handleSearchChange}
                            onKeyPress={handleSearchSubmit}
                            className="pl-10 pr-10 w-full"
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <SearchIcon />
                        </div>
                        {localSearch && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={clearSearch}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 h-full"
                            >
                                <ClearIcon />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Right side - Theme and User */}
                <div className="flex items-center gap-4 flex-1 justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggleTheme}
                        className="flex-shrink-0 mr-2" 
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </Button>

                    {user && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground hidden sm:block mr-2"> {/* Added margin */}
                                {user.email}
                            </span>
                            <Button variant="outline" size="sm" onClick={logout} className="flex-shrink-0">
                                Logout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

// ... your existing icons remain the same
const MenuIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const SearchIcon = () => (
    <svg className="h-4 w-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const ClearIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

const SunIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);

export default Header;
```

## File: components/layout/Layout.jsx
```jsx
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import {useAppStore} from '../../stores/appStore';

const Layout = ({children}) => {
    const {sidebarOpen} = useAppStore();

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />
            <div className="flex flex-1">
                <Sidebar />
                <main
                    className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'md:ml-64' : 'md:ml-0'
                        }`}
                >
                    <div className="p-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
```

## File: components/layout/Sidebar.jsx
```jsx
import React from 'react';
import {Link, useLocation} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {useAppStore} from '../../stores/appStore';
import {useCategoriesStore} from '../../stores/categoriesStore';
import {useNotesStore} from '../../stores/notesStore';
import {cn} from '@/lib/utils';

const Sidebar = () => {
    const {sidebarOpen, setCurrentView} = useAppStore();
    const {categories, fetchCategories} = useCategoriesStore();
    const {setCategoryFilter, clearCategoryFilter, currentCategoryFilter} = useNotesStore();
    const location = useLocation();

    React.useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const navigation = [
        {name: 'Notes', href: '/notes', icon: <NotesIcon />},
        {name: 'Categories', href: '/categories', icon: <CategoriesIcon />},
        {name: 'Profile', href: '/profile', icon: <ProfileIcon />},
    ];

    const isActive = (path) => location.pathname === path;

    const handleCategoryClick = (category) => {
        setCategoryFilter(category.id);
        setCurrentView('notes');
    };

    const handleClearFilter = () => {
        clearCategoryFilter();
    };

    if (!sidebarOpen) return null;

    return (
        <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-300 ease-in-out md:translate-x-0 -translate-x-full">
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-lg font-semibold">JustNotes</h2>
                    {currentCategoryFilter && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearFilter}
                            className="h-6 text-xs"
                        >
                            Clear
                        </Button>
                    )}
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            to={item.href}
                            onClick={() => {
                                setCurrentView(item.name.toLowerCase());
                                clearCategoryFilter();
                            }}
                        >
                            <Button
                                variant={isActive(item.href) ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3 mb-1 mt-1",
                                    isActive(item.href) && "bg-secondary"
                                )}
                            >
                                {item.icon}
                                {item.name}
                            </Button>
                        </Link>
                    ))}

                    {/* Categories Section */}
                    <div className="pt-6">
                        <div className="flex items-center justify-between px-3 mb-2">
                            <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                {categories.length}
                            </span>
                        </div>
                        <div className="space-y-1 max-h-60 overflow-y-auto">
                            {categories.slice(0, 10).map((category) => (
                                <Button
                                    key={category.id}
                                    variant={currentCategoryFilter === category.id ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start gap-3 text-sm h-8 ",
                                        currentCategoryFilter === category.id && "bg-secondary"
                                    )}
                                    onClick={() => handleCategoryClick(category)}
                                >
                                    <div
                                        className="w-2 h-2 rounded-full flex-shrink-0"
                                        style={{backgroundColor: category.color || '#6B73FF'}}
                                    />
                                    <span className="truncate flex-1 text-left">{category.name}</span>
                                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                                        {category.noteCount || category._count?.notes || 0}
                                    </span>
                                </Button>
                            ))}
                            {categories.length > 10 && (
                                <Button variant="ghost" className="w-full justify-center text-sm text-muted-foreground h-8">
                                    +{categories.length - 10} more
                                </Button>
                            )}
                            {categories.length === 0 && (
                                <p className="text-xs text-muted-foreground px-3 py-2 text-center">
                                    No categories yet
                                </p>
                            )}
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

// Icons remain the same...
const NotesIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
);

const CategoriesIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
);

const ProfileIcon = () => (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

export default Sidebar;
```

## File: components/notes/NoteCard.jsx
```jsx
import React from 'react';
import {useNavigate} from 'react-router-dom';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {useNotesStore} from '../../stores/notesStore';
import {formatDate, truncateText} from '../../utils/helpers';

const NoteCard = ({note}) => {
    const navigate = useNavigate();
    const {deleteNote, updateNote} = useNotesStore();

    const handleEdit = () => {
        navigate(`/notes/${note.id}`);
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (window.confirm('Are you sure you want to delete this note?')) {
            await deleteNote(note.id);
        }
    };

    const handleTogglePin = async (e) => {
        e.stopPropagation();
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
        <Card
            className="group hover:shadow-md transition-all duration-200 border-l-4 cursor-pointer"
            style={{borderLeftColor: note.category?.color || 'hsl(var(--foreground))'}}
            onClick={handleEdit}
        >
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
                            className={`h-8 w-8 ${note.isPinned ? 'text-primary' : ''}`}
                            title={note.isPinned ? "Unpin note" : "Pin note"}
                        >
                            <PinIcon />
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

// Icons remain the same...
const DeleteIcon = () => (
    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
);

const PinIcon = () => (
    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16 12V4H17V2H7V4H8V12L6 14V16H11.2V22H12.8V16H18V14L16 12Z" />
    </svg>
);


export default NoteCard;
```

## File: components/notes/NoteEditor.jsx
```jsx
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
```

## File: components/notes/NoteForm.jsx
```jsx
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
```

## File: components/notes/NoteList.jsx
```jsx
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
```

## File: components/ui/alert.jsx
```jsx
import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border px-4 py-3 text-sm [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props} />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props} />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props} />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }

```

## File: components/ui/badge.jsx
```jsx
import * as React from "react"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  ...props
}) {
  return (<div className={cn(badgeVariants({ variant }), className)} {...props} />);
}

export { Badge, badgeVariants }

```

## File: components/ui/button.jsx
```jsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props} />
  );
})
Button.displayName = "Button"

export { Button, buttonVariants }

```

## File: components/ui/card.jsx
```jsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-xl border bg-card text-card-foreground shadow", className)}
    {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props} />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props} />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

## File: components/ui/dialog.jsx
```jsx
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props} />
))
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      {...props}>
      {children}
      <DialogPrimitive.Close
        className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

const DialogHeader = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props} />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props} />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props} />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props} />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

```

## File: components/ui/input.jsx
```jsx
import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props} />
  );
})
Input.displayName = "Input"

export { Input }

```

## File: components/ui/label.jsx
```jsx
import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils"

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
)

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...props} />
))
Label.displayName = LabelPrimitive.Root.displayName

export { Label }

```

## File: components/ui/switch.jsx
```jsx
"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      "peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
      className
    )}
    {...props}
    ref={ref}>
    <SwitchPrimitives.Thumb
      className={cn(
        "pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0"
      )} />
  </SwitchPrimitives.Root>
))
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

```

## File: components/ui/textarea.jsx
```jsx
import React from "react";

import {cn} from "@/lib/utils";

const Textarea = React.forwardRef(({className, ...props}, ref) => {
    return (
        <textarea
            className={cn(
                "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

export {Textarea};
```

## File: hooks/useLocalStorage.js
```js
import { useState, useEffect } from "react";

export const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(`Error reading localStorage key "${key}":`, error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            setStoredValue(value);
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting localStorage key "${key}":`, error);
        }
    };

    return [storedValue, setValue];
};

export const useAuth = () => {
    const [user, setUser] = useLocalStorage("userData", null);
    const [token, setToken] = useLocalStorage("accessToken", null);

    const login = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem("userData");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
    };

    return {
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token && !!user,
    };
};

```

## File: index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;        /* white */
    --foreground: 0 0% 3.9%;          /* black */

    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.9%;

    --primary: 0 0% 9%;             /* black */
    --primary-foreground: 0 0% 98%;/* white text on black */

    --secondary: 0 0% 96.1%;          /* light gray */
    --secondary-foreground: 0 0% 9%;

    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;

    --accent: 0 0% 96.1%;
    --accent-foreground: 0 0% 9%;

    --destructive: 0 84.2% 60.2%;      /* red for errors */
    --destructive-foreground: 0 0% 98%;

    --border: 0 0% 89.8%;             /* gray borders */
    --input: 0 0% 89.8%;
    --ring: 0 0% 3.9%;                /* black focus ring */

    --radius: 0.5rem;

    --chart-1: 12 76% 61%;

    --chart-2: 173 58% 39%;

    --chart-3: 197 37% 24%;

    --chart-4: 43 74% 66%;

    --chart-5: 27 87% 67%;
  }

  .dark {
    --background: 0 0% 3.9%;          /* black */
    --foreground: 0 0% 98%;        /* white */

    --card: 0 0% 3.9%;
    --card-foreground: 0 0% 98%;

    --popover: 0 0% 3.9%;
    --popover-foreground: 0 0% 98%;

    --primary: 0 0% 98%;           /* white */
    --primary-foreground: 0 0% 9%;  /* black text on white */

    --secondary: 0 0% 14.9%;
    --secondary-foreground: 0 0% 98%;

    --muted: 0 0% 14.9%;
    --muted-foreground: 0 0% 63.9%;

    --accent: 0 0% 14.9%;
    --accent-foreground: 0 0% 98%;

    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 0 0% 98%;

    --border: 0 0% 14.9%;
    --input: 0 0% 14.9%;
    --ring: 0 0% 83.1%;
    --chart-1: 220 70% 50%;
    --chart-2: 160 60% 45%;
    --chart-3: 30 80% 55%;
    --chart-4: 280 65% 60%;
    --chart-5: 340 75% 55%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
    font-family: monospace, monospace;
  }
}

```

## File: lib/utils.js
```js
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

```

## File: main.jsx
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import ErrorBoundary from './components/common/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <App />
        </ErrorBoundary>
    </React.StrictMode>,
);
```

## File: pages/Categories.jsx
```jsx
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
```

## File: pages/ConfirmCode.jsx
```jsx
// pages/ConfirmCode.jsx
import React, {useState, useRef, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {useAuthStore} from '../stores/authStore';
import {authService} from '../services/authService';

const ConfirmCode = () => {
    const [code, setCode] = useState(['', '', '', '', '', '']);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [resending, setResending] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();
    const inputRefs = useRef([]);

    const {verifyEmail, resendVerification} = useAuthStore();

    const {email, flow} = location.state || {};

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const handleCodeChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newCode = [...code];
            newCode[index] = value;
            setCode(newCode);

            if (value && index < 5) {
                inputRefs.current[index + 1].focus();
            }

            if (index === 5 && value) {
                const fullCode = newCode.join('');
                if (fullCode.length === 6) {
                    handleVerifyCode(fullCode);
                }
            }
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pasteData)) {
            const newCode = pasteData.split('').concat(Array(6 - pasteData.length).fill(''));
            setCode(newCode);
            const fullCode = newCode.join('');
            if (fullCode.length === 6) {
                handleVerifyCode(fullCode);
            } else {
                inputRefs.current[Math.min(pasteData.length, 5)].focus();
            }
        }
    };

    const handleVerifyCode = async (verificationCode) => {
        if (verificationCode.length !== 6) {
            setError('Please enter the full 6-digit code');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            if (flow === 'password-reset') {
                // For password reset, directly navigate to reset page
                // The reset endpoint will validate the code when the user submits the new password
                navigate('/reset-password', {
                    state: {
                        code: verificationCode,
                        email,
                    }
                });
            } else {
                // For email verification flow
                await verifyEmail(verificationCode);
                navigate('/notes');
            }
        } catch (error) {
            setError(error.response?.data?.msg || 'Invalid or expired verification code');
            setCode(['', '', '', '', '', '']);
            inputRefs.current[0].focus();
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const verificationCode = code.join('');
        await handleVerifyCode(verificationCode);
    };

    const handleResendCode = async () => {
        setResending(true);
        setError('');

        try {
            if (flow === 'password-reset') {
                await authService.forgotPassword(email);
            } else {
                await resendVerification(email);
            }
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to resend code');
        } finally {
            setResending(false);
        }
    };

    if (!email) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">JustNotes</h1>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">
                            {flow === 'password-reset' ? 'Reset Password' : 'Verify Your Email'}
                        </CardTitle>
                        <CardDescription className="text-center">
                            We sent a 6-digit code to <strong>{email}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="flex justify-center space-x-2">
                                {code.map((digit, index) => (
                                    <Input
                                        key={index}
                                        ref={(el) => (inputRefs.current[index] = el)}
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleCodeChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={index === 0 ? handlePaste : undefined}
                                        className="w-12 h-12 text-center text-lg font-semibold"
                                        disabled={isLoading}
                                        autoFocus={index === 0}
                                    />
                                ))}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </Button>

                            <div className="text-center">
                                <p className="text-sm text-muted-foreground">
                                    Didn't receive the code?{' '}
                                    <Button
                                        type="button"
                                        variant="link"
                                        onClick={handleResendCode}
                                        disabled={resending}
                                        className="p-0 h-auto font-medium"
                                    >
                                        {resending ? 'Resending...' : 'Resend Code'}
                                    </Button>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ConfirmCode;
```

## File: pages/ForgotPassword.jsx
```jsx
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {passwordService} from '../services/passwordService';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            await passwordService.forgotPassword(email);
            // Redirect to code confirmation page with email as state
            navigate('/confirm-code', {state: {email, flow: 'password-reset'}});
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to send reset code');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* App Logo/Title */}
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">JustNotes</h1>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
                        <CardDescription className="text-center">
                            Enter your email to receive a verification code
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                            </Button>

                            <div className="text-center text-sm">
                                Remember your password?{' '}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ForgotPassword;
```

## File: pages/Login.jsx
```jsx
import React, {useState, useEffect} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {useAuthStore} from '../stores/authStore';

const Login = () => {
    const [formData, setFormData] = useState({email: '', password: ''});
    const [localErrors, setLocalErrors] = useState({});

    const {login, isLoading, error, accessToken, user} = useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (accessToken && user) {
            navigate('/notes', {replace: true});
        }
    }, [accessToken, user, navigate]);

    const validateForm = () => {
        const errors = {};
        if (!formData.email) errors.email = 'Email is required';
        if (!formData.password) errors.password = 'Password is required';
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
        }
        setLocalErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalErrors({});

        if (!validateForm()) return;

        try {
            await login(formData);
        } catch (error) {
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
        if (localErrors[e.target.name]) {
            setLocalErrors(prev => ({...prev, [e.target.name]: ''}));
        }
    };

    if (accessToken && user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="text-muted-foreground">Redirecting...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">JustNotes</h1>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Sign In</CardTitle>
                        <CardDescription className="text-center">
                            Enter your credentials to access your notes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className={localErrors.email ? 'border-red-500' : ''}
                                />
                                {localErrors.email && (
                                    <p className="text-sm text-red-600">{localErrors.email}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                    className={localErrors.password ? 'border-red-500' : ''}
                                />
                                {localErrors.password && (
                                    <p className="text-sm text-red-600">{localErrors.password}</p>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Signing in...' : 'Sign In'}
                            </Button>

                            <div className="text-center text-sm space-y-2">
                                <div>
                                    Don't have an account?{' '}
                                    <Link to="/register" className="text-primary hover:underline font-medium">
                                        Sign up
                                    </Link>
                                </div>
                                <div>
                                    <Link to="/forgot-password" className="text-primary hover:underline font-medium">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
```

## File: pages/NoteEditor.jsx
```jsx
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
```

## File: pages/Notes.jsx
```jsx
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
```

## File: pages/Profile.jsx
```jsx
import React, {useEffect, useState} from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {useAuthStore} from '../stores/authStore';

const Profile = () => {
    const {user, logout} = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-muted-foreground">User data not available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
                <p className="text-muted-foreground">
                    Manage your account settings and preferences
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                    <CardDescription>
                        Your personal account details
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Email
                            </label>
                            <p className="text-sm">{user.email}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Role
                            </label>
                            <p className="text-sm capitalize">{user.role?.toLowerCase() || 'user'}</p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Email Verified
                            </label>
                            <p className="text-sm">
                                {user.isVerified ? (
                                    <span className="text-green-600">Verified</span>
                                ) : (
                                    <span className="text-yellow-600">Pending Verification</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <label className="text-sm font-medium text-muted-foreground">
                                Member Since
                            </label>
                            <p className="text-sm">
                                {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                    <CardDescription>
                        Account management actions
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button variant="outline" onClick={logout}>
                            Logout
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
```

## File: pages/Register.jsx
```jsx
import React, {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {useAuthStore} from '../stores/authStore';

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [localError, setLocalError] = useState('');

    const {register, isLoading, error} = useAuthStore();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (formData.password !== formData.confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setLocalError('Password must be at least 6 characters long');
            return;
        }

        if (!formData.email.includes('@')) {
            setLocalError('Please enter a valid email address');
            return;
        }

        try {
            await register({
                email: formData.email,
                password: formData.password
            });

            navigate('/confirm-code', {
                state: {
                    email: formData.email,
                    flow: 'email-verification'
                }
            });
        } catch (error) {
            setLocalError(error.message);
        }
    };

    const displayError = localError || error;

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">JustNotes</h1>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                        <CardDescription className="text-center">
                            Sign up for your JustNotes account
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {displayError && (
                                <Alert variant="destructive">
                                    <AlertDescription>{displayError}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Create Account'}
                            </Button>

                            <div className="text-center text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-primary hover:underline font-medium">
                                    Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;
```

## File: pages/ResetPassword.jsx
```jsx
// pages/ResetPassword.jsx
import React, {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {authService} from '../services/authService';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    const {code, email} = location.state || {};

    // Redirect if no code provided
    useEffect(() => {
        if (!code) {
            navigate('/forgot-password');
        }
    }, [code, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setIsLoading(true);

        try {
            await authService.resetPassword(code, formData.newPassword);
            setMessage('Password reset successfully! Redirecting to login...');

            setTimeout(() => {
                navigate('/login', {
                    state: {message: 'Password reset successfully! You can now login with your new password.'}
                });
            }, 2000);
        } catch (error) {
            setError(error.response?.data?.msg || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    if (!code) {
        return null;
    }

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-foreground mb-2">JustNotes</h1>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Set New Password</CardTitle>
                        <CardDescription className="text-center">
                            Create your new password for <strong>{email}</strong>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {message && (
                                <Alert>
                                    <AlertDescription>{message}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    name="newPassword"
                                    placeholder="New Password"
                                    value={formData.newPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="space-y-2">
                                <Input
                                    type="password"
                                    name="confirmPassword"
                                    placeholder="Confirm New Password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? 'Resetting Password...' : 'Reset Password'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default ResetPassword;
```

## File: services/api.js
```js
import axios from "axios";
import { API_BASE_URL } from "../utils/constants";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage
        const token = localStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            console.warn("No access token found");
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle network errors
        if (!error.response) {
            console.error("Network error:", error);
            const networkError = new Error(
                "Cannot connect to server. Please check your connection."
            );
            networkError.response = null;
            return Promise.reject(networkError);
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            // Clear auth data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");
            localStorage.removeItem("auth-storage");

            // Redirect to login
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }

            const authError = new Error("Session expired. Please login again.");
            authError.response = error.response;
            return Promise.reject(authError);
        }

        // Preserve the original error with response data
        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            error.message ||
            "Request failed";

        // Create a new error but keep the response object
        const enhancedError = new Error(errorMessage);
        enhancedError.response = error.response;
        enhancedError.config = error.config;

        return Promise.reject(enhancedError);
    }
);

export default api;

```

## File: services/authService.js
```js
import api from "./api";

export const authService = {
    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },

    verifyEmail: async (code) => {
        const response = await api.post("/auth/email/verify", { code });
        return response.data;
    },

    resendVerification: async (email) => {
        const response = await api.post("/auth/email/resend", { email });
        return response.data;
    },

    forgotPassword: async (email) => {
        const response = await api.post("/auth/password/forgot", { email });
        return response.data;
    },

    resetPassword: async (code, newPassword) => {
        const response = await api.post("/auth/password/reset", {
            code,
            newPassword,
        });
        return response.data;
    },

    logout: async () => {
        const refreshToken = localStorage.getItem("refreshToken");
        if (refreshToken) {
            try {
                await api.post("/auth/logout", { refreshToken });
            } catch (error) {
                console.error("Logout error:", error);
            }
        }
    },
};

```

## File: services/categoriesService.js
```js
import api from "./api";

export const categoriesService = {
    getCategories: async () => {
        try {
            const response = await api.get("/categories");
            const data = response.data?.data || response.data || [];
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Categories service - getCategories error:", {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                config: error.config,
            });
            throw error;
        }
    },

    getCategoryById: async (id) => {
        try {
            const response = await api.get(`/categories/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Categories service - getCategoryById error:", error);
            throw error;
        }
    },

    createCategory: async (categoryData) => {
        try {
            // Match the exact API payload structure from your docs
            const payload = {
                name: categoryData.name?.trim() || "",
                description: categoryData.description?.trim() || null,
                color: categoryData.color || "#6B73FF",
            };

            console.log("Creating category with payload:", payload);

            // Validate required fields
            if (!payload.name) {
                throw new Error("Category name is required");
            }

            const response = await api.post("/categories", payload);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Categories service - createCategory error:", error);
            throw error;
        }
    },

    updateCategory: async (id, categoryData) => {
        try {
            const payload = {
                name: categoryData.name?.trim() || "",
                description: categoryData.description?.trim() || null,
                color: categoryData.color || "#6B73FF",
            };

            console.log("Updating category with payload:", payload);

            if (!payload.name) {
                throw new Error("Category name is required");
            }

            const response = await api.put(`/categories/${id}`, payload);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Categories service - updateCategory error:", error);
            throw error;
        }
    },

    deleteCategory: async (id) => {
        try {
            const response = await api.delete(`/categories/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Categories service - deleteCategory error:", error);
            throw error;
        }
    },

    getCategoryNotes: async (id) => {
        try {
            const response = await api.get(`/categories/${id}/notes`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error(
                "Categories service - getCategoryNotes error:",
                error
            );
            throw error;
        }
    },
};

```

## File: services/notesService.js
```js
import api from "./api";

export const notesService = {
    getNotes: async () => {
        try {
            const response = await api.get("/notes");
            return response.data?.data || response.data || [];
        } catch (error) {
            console.error("Notes service - getNotes error:", error);
            throw error;
        }
    },

    getNoteById: async (id) => {
        try {
            const response = await api.get(`/notes/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Notes service - getNoteById error:", error);
            throw error;
        }
    },

    createNote: async (noteData) => {
        try {
            // Match the exact API payload structure from your docs
            const payload = {
                title: noteData.title?.trim() || "",
                content: noteData.content?.trim() || "",
                categoryId: noteData.categoryId || null,
                tags: Array.isArray(noteData.tags) ? noteData.tags : [],
                isPinned: Boolean(noteData.isPinned),
            };

            console.log("Creating note with payload:", payload);

            // Validate required fields
            if (!payload.title || !payload.content) {
                throw new Error("Title and content are required");
            }

            const response = await api.post("/notes", payload);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Notes service - createNote error:", error);
            throw error;
        }
    },

    updateNote: async (id, noteData) => {
        try {
            // Match the exact API payload structure from your docs
            const payload = {
                title: noteData.title?.trim() || "",
                content: noteData.content?.trim() || "",
                categoryId: noteData.categoryId || null,
                tags: Array.isArray(noteData.tags) ? noteData.tags : [],
                isPinned: Boolean(noteData.isPinned),
            };

            console.log("Updating note with payload:", payload);

            // Validate required fields
            if (!payload.title || !payload.content) {
                throw new Error("Title and content are required");
            }

            const response = await api.put(`/notes/${id}`, payload);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Notes service - updateNote error:", error);
            throw error;
        }
    },

    deleteNote: async (id) => {
        try {
            const response = await api.delete(`/notes/${id}`);
            return response.data?.data || response.data;
        } catch (error) {
            console.error("Notes service - deleteNote error:", error);
            throw error;
        }
    },
};

```

## File: services/passwordService.js
```js
import api from "./api";

export const passwordService = {
    // Forgot password - request reset code
    forgotPassword: async (email) => {
        const response = await api.post("/auth/password/forgot", { email });
        return response.data;
    },

    // Reset password with code
    resetPassword: async (code, newPassword) => {
        const response = await api.post("/auth/password/reset", {
            code,
            newPassword,
        });
        return response.data;
    },
};

```

## File: stores/appStore.js
```js
import { create } from "zustand";

export const useAppStore = create((set, get) => ({

    theme: "light",
    sidebarOpen: true,
    currentView: "notes",
    isLoading: false,
    notifications: [],

    setTheme: (theme) => {
        set({ theme });
        localStorage.setItem("theme", theme);
        document.documentElement.classList.toggle("dark", theme === "dark");
    },

    toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === "light" ? "dark" : "light";
        set({ theme: newTheme });
        localStorage.setItem("theme", newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    },

    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

    setCurrentView: (view) => set({ currentView: view }),

    setLoading: (loading) => set({ isLoading: loading }),

    addNotification: (notification) => {
        const id = Date.now().toString();
        const newNotification = { id, ...notification };
        set((state) => ({
            notifications: [...state.notifications, newNotification],
        }));

        setTimeout(() => {
            get().removeNotification(id);
        }, 5000);
    },

    removeNotification: (id) => {
        set((state) => ({
            notifications: state.notifications.filter(
                (notification) => notification.id !== id
            ),
        }));
    },

    clearNotifications: () => set({ notifications: [] }),
}));

const savedTheme = localStorage.getItem("theme") || "light";
useAppStore.setState({ theme: savedTheme });
document.documentElement.classList.toggle("dark", savedTheme === "dark");

```

## File: stores/authStore.js
```js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authService } from "../services/authService";

export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            accessToken: null,
            refreshToken: null,
            isLoading: false,
            error: null,
            isInitialized: false,

            initialize: () => {
                try {
                    const token = localStorage.getItem("accessToken");
                    const userData = localStorage.getItem("userData");
                    const refreshToken = localStorage.getItem("refreshToken");

                    console.log("Auth initialization:", {
                        hasToken: !!token,
                        hasUserData: !!userData,
                    });

                    if (token && userData) {
                        try {
                            const user = JSON.parse(userData);
                            set({
                                user,
                                accessToken: token,
                                refreshToken: refreshToken,
                                isInitialized: true,
                                isLoading: false,
                            });
                            console.log(
                                "Auth initialized with user:",
                                user.email
                            );
                        } catch (parseError) {
                            console.error(
                                "Error parsing user data:",
                                parseError
                            );
                            get().clearAuth();
                            set({ isInitialized: true, isLoading: false });
                        }
                    } else {
                        set({ isInitialized: true, isLoading: false });
                        console.log("Auth initialized - no user data");
                    }
                } catch (error) {
                    console.error("Auth initialization error:", error);
                    get().clearAuth();
                    set({ isInitialized: true, isLoading: false });
                }
            },

            setUser: (user) => {
                set({ user });
                if (user) {
                    localStorage.setItem("userData", JSON.stringify(user));
                }
            },

            login: async (credentials) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.login(credentials);
                    const { user, accessToken, refreshToken } = response.data;

                    console.log("Login successful:", {
                        user: user.email,
                        hasToken: !!accessToken,
                    });

                    // Store in both Zustand state AND localStorage
                    localStorage.setItem("accessToken", accessToken);
                    localStorage.setItem("refreshToken", refreshToken);
                    localStorage.setItem("userData", JSON.stringify(user));

                    set({
                        user,
                        accessToken,
                        refreshToken,
                        isLoading: false,
                        error: null,
                    });

                    return response;
                } catch (error) {
                    console.error("Login error:", error);
                    set({ isLoading: false, error: error.message });
                    throw error;
                }
            },

            register: async (userData) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.register(userData);
                    set({ isLoading: false, error: null });
                    return response;
                } catch (error) {
                    console.error("Register error:", error);
                    set({ isLoading: false, error: error.message });
                    throw error;
                }
            },

            verifyEmail: async (code) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.verifyEmail(code);

                    if (response.data.user && response.data.accessToken) {
                        const { user, accessToken, refreshToken } =
                            response.data;

                        console.log("Email verification successful:", {
                            user: user.email,
                        });

                        localStorage.setItem("accessToken", accessToken);
                        localStorage.setItem("refreshToken", refreshToken);
                        localStorage.setItem("userData", JSON.stringify(user));

                        set({
                            user,
                            accessToken,
                            refreshToken,
                            isLoading: false,
                            error: null,
                        });
                    }

                    return response;
                } catch (error) {
                    console.error("Email verification error:", error);
                    set({ isLoading: false, error: error.message });
                    throw error;
                }
            },

            resendVerification: async (email) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.resendVerification(
                        email
                    );
                    set({ isLoading: false });
                    return response;
                } catch (error) {
                    console.error("Resend verification error:", error);
                    set({ isLoading: false, error: error.message });
                    throw error;
                }
            },

            logout: async () => {
                set({ isLoading: true });

                try {
                    await authService.logout();
                } catch (error) {
                    console.error("Logout error:", error);
                } finally {
                    // Clear everything
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    localStorage.removeItem("userData");
                    localStorage.removeItem("auth-storage");
                    localStorage.removeItem("notes-storage");
                    localStorage.removeItem("categories-storage");

                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isLoading: false,
                        error: null,
                    });

                    console.log("Logout completed");
                }
            },

            clearAuth: () => {
                localStorage.removeItem("accessToken");
                localStorage.removeItem("refreshToken");
                localStorage.removeItem("userData");

                set({
                    user: null,
                    accessToken: null,
                    refreshToken: null,
                    error: null,
                });
            },

            clearError: () => set({ error: null }),
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                user: state.user,
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
            }),
        }
    )
);

```

## File: stores/categoriesStore.js
```js
// stores/categoriesStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { categoriesService } from "../services/categoriesService";

export const useCategoriesStore = create(
    persist(
        (set, get) => ({
            categories: [],
            currentCategory: null,
            isLoading: false,
            error: null,
            validationErrors: {},
            lastFetched: null,

            fetchCategories: async (forceRefresh = false) => {
                const state = get();

                if (state.isLoading && !forceRefresh) {
                    return;
                }

                const hasRecentData =
                    state.lastFetched &&
                    Date.now() - state.lastFetched < 30000 &&
                    state.categories.length > 0;

                if (!forceRefresh && hasRecentData) {
                    return;
                }

                set({ isLoading: true, error: null, validationErrors: {} });

                try {
                    const response = await categoriesService.getCategories();

                    let categories = [];
                    if (Array.isArray(response)) {
                        categories = response;
                    } else if (response && Array.isArray(response.data)) {
                        categories = response.data;
                    }

                    set({
                        categories: categories,
                        isLoading: false,
                        lastFetched: Date.now(),
                        error: null,
                    });
                } catch (error) {
                    console.error("Error fetching categories:", error);

                    if (
                        error.message?.includes("Authentication required") ||
                        error.response?.status === 401
                    ) {
                        set({
                            categories: [],
                            isLoading: false,
                            error: "Please login to access categories",
                            lastFetched: Date.now(),
                        });
                    } else {
                        set({
                            isLoading: false,
                            error: error.message,
                            categories: state.categories,
                        });
                    }
                }
            },

            createCategory: async (categoryData) => {
                set({ isLoading: true, error: null, validationErrors: {} });
                try {
                    if (!categoryData.name || !categoryData.name.trim()) {
                        throw new Error("Category name is required");
                    }

                    const response = await categoriesService.createCategory(
                        categoryData
                    );

                    let newCategory;
                    if (response.data) {
                        newCategory = response.data;
                    } else if (response) {
                        newCategory = response;
                    } else {
                        newCategory = {
                            id: Date.now().toString(),
                            ...categoryData,
                            createdAt: new Date().toISOString(),
                            noteCount: 0,
                        };
                    }

                    set((state) => ({
                        categories: [...state.categories, newCategory],
                        isLoading: false,
                        validationErrors: {},
                        lastFetched: Date.now(),
                    }));

                    return newCategory;
                } catch (error) {
                    console.error("Category creation error:", error);

                    let validationErrors = {};
                    let errorMessage =
                        error.message || "Failed to create category";

                    // Handle different error response formats
                    if (error.response?.data?.errors) {
                        const errors = error.response.data.errors;

                        // If errors is an array (express-validator format)
                        if (Array.isArray(errors)) {
                            errors.forEach((err) => {
                                validationErrors[
                                    err.path || err.param || "general"
                                ] = err.msg || err.message;
                            });
                            errorMessage = "Please fix the validation errors";
                        }
                        // If errors is an object
                        else if (typeof errors === "object") {
                            validationErrors = errors;
                        }
                    } else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response?.data?.msg) {
                        errorMessage = error.response.data.msg;
                    }

                    set({
                        isLoading: false,
                        error: errorMessage,
                        validationErrors,
                    });
                    throw error;
                }
            },

            updateCategory: async (id, categoryData) => {
                set({ isLoading: true, error: null, validationErrors: {} });
                try {
                    const response = await categoriesService.updateCategory(
                        id,
                        categoryData
                    );
                    const updatedCategory = response.data || response;

                    set((state) => ({
                        categories: state.categories.map((category) =>
                            category.id === id ? updatedCategory : category
                        ),
                        currentCategory: updatedCategory,
                        isLoading: false,
                        validationErrors: {},
                        lastFetched: Date.now(),
                    }));
                    return updatedCategory;
                } catch (error) {
                    console.error("Category update error:", error);

                    let validationErrors = {};
                    let errorMessage =
                        error.message || "Failed to update category";

                    // Handle different error response formats
                    if (error.response?.data?.errors) {
                        const errors = error.response.data.errors;

                        if (Array.isArray(errors)) {
                            errors.forEach((err) => {
                                validationErrors[
                                    err.path || err.param || "general"
                                ] = err.msg || err.message;
                            });
                            errorMessage = "Please fix the validation errors";
                        } else if (typeof errors === "object") {
                            validationErrors = errors;
                        }
                    } else if (error.response?.data?.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response?.data?.msg) {
                        errorMessage = error.response.data.msg;
                    }

                    set({
                        isLoading: false,
                        error: errorMessage,
                        validationErrors,
                    });
                    throw error;
                }
            },

            deleteCategory: async (id) => {
                set({ isLoading: true, error: null, validationErrors: {} });
                try {
                    await categoriesService.deleteCategory(id);
                    set((state) => ({
                        categories: state.categories.filter(
                            (category) => category.id !== id
                        ),
                        currentCategory:
                            state.currentCategory?.id === id
                                ? null
                                : state.currentCategory,
                        isLoading: false,
                        validationErrors: {},
                        lastFetched: Date.now(),
                    }));
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message ||
                        error.response?.data?.msg ||
                        error.message ||
                        "Failed to delete category";
                    set({
                        isLoading: false,
                        error: errorMessage,
                        validationErrors: {},
                    });
                    throw error;
                }
            },

            setCurrentCategory: (category) =>
                set({ currentCategory: category }),
            clearCurrentCategory: () => set({ currentCategory: null }),
            clearError: () => set({ error: null, validationErrors: {} }),
            clearValidationErrors: () => set({ validationErrors: {} }),
            forceRefresh: () => set({ lastFetched: null }),
        }),
        {
            name: "categories-storage",
            partialize: (state) => ({
                categories: state.categories,
                lastFetched: state.lastFetched,
            }),
        }
    )
);

```

## File: stores/index.js
```js
export { useAuthStore } from "./authStore";
export { useNotesStore } from "./notesStore";
export { useCategoriesStore } from "./categoriesStore";
export { useAppStore } from "./appStore";
```

## File: stores/notesStore.js
```js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { notesService } from "../services/notesService";

export const useNotesStore = create(
    persist(
        (set, get) => ({
            notes: [],
            currentNote: null,
            isLoading: false,
            error: null,
            searchQuery: "",
            currentCategoryFilter: null,
            lastFetched: null,

            fetchNotes: async (forceRefresh = false) => {
                const state = get();

                // Prevent multiple simultaneous requests
                if (state.isLoading && !forceRefresh) {
                    return;
                }

                // Use cache if data is fresh
                const hasRecentData =
                    state.lastFetched &&
                    Date.now() - state.lastFetched < 30000 &&
                    state.notes.length > 0;

                if (!forceRefresh && hasRecentData) {
                    return;
                }

                set({ isLoading: true, error: null });

                try {
                    const response = await notesService.getNotes();
                    // Handle both response formats
                    const notes = response.data || response || [];

                    set({
                        notes: Array.isArray(notes) ? notes : [],
                        isLoading: false,
                        error: null,
                        lastFetched: Date.now(),
                    });
                } catch (error) {
                    console.error("Error fetching notes:", error);
                    set({
                        isLoading: false,
                        error: error.message,
                        notes: [], // Clear notes on error
                    });
                }
            },

            // Fetch single note by ID
            fetchNoteById: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await notesService.getNoteById(id);
                    const note = response.data || response;

                    set({
                        currentNote: note,
                        isLoading: false,
                    });
                    return note;
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message || "Failed to fetch note";
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            // Create new note
            createNote: async (noteData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await notesService.createNote(noteData);
                    const newNote = response.data || response;

                    set((state) => ({
                        notes: [newNote, ...state.notes],
                        isLoading: false,
                        lastFetched: Date.now(),
                    }));
                    return newNote;
                } catch (error) {
                    console.error("Error creating note:", error);
                    set({
                        isLoading: false,
                        error: error.message,
                    });
                    throw error;
                }
            },

            // Update existing note
            updateNote: async (id, noteData) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await notesService.updateNote(
                        id,
                        noteData
                    );
                    const updatedNote = response.data || response;

                    set((state) => ({
                        notes: state.notes.map((note) =>
                            note.id === id ? updatedNote : note
                        ),
                        currentNote:
                            state.currentNote?.id === id
                                ? updatedNote
                                : state.currentNote,
                        isLoading: false,
                        lastFetched: Date.now(),
                    }));
                    return updatedNote;
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message ||
                        "Failed to update note";
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            // Delete note
            deleteNote: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    await notesService.deleteNote(id);
                    set((state) => ({
                        notes: state.notes.filter((note) => note.id !== id),
                        currentNote:
                            state.currentNote?.id === id
                                ? null
                                : state.currentNote,
                        isLoading: false,
                        lastFetched: Date.now(),
                    }));
                } catch (error) {
                    const errorMessage =
                        error.response?.data?.message ||
                        "Failed to delete note";
                    set({
                        isLoading: false,
                        error: errorMessage,
                    });
                    throw error;
                }
            },

            // Category filtering
            setCategoryFilter: (categoryId) =>
                set({ currentCategoryFilter: categoryId }),

            clearCategoryFilter: () => set({ currentCategoryFilter: null }),

            // Search functionality
            setSearchQuery: (query) => set({ searchQuery: query }),
            clearSearch: () => set({ searchQuery: "" }),

            // Note selection
            setCurrentNote: (note) => set({ currentNote: note }),
            clearCurrentNote: () => set({ currentNote: null }),

            // Error handling
            clearError: () => set({ error: null }),

            // Get filtered notes based on search and category filters
            getFilteredNotes: () => {
                const { notes, searchQuery, currentCategoryFilter } = get();
                let filteredNotes = [...notes];

                // Apply category filter
                if (currentCategoryFilter) {
                    filteredNotes = filteredNotes.filter(
                        (note) => note.categoryId === currentCategoryFilter
                    );
                }

                // Apply search filter
                if (searchQuery.trim()) {
                    const query = searchQuery.toLowerCase().trim();
                    filteredNotes = filteredNotes.filter(
                        (note) =>
                            note.title?.toLowerCase().includes(query) ||
                            note.content?.toLowerCase().includes(query) ||
                            note.tags?.some((tag) =>
                                tag.toLowerCase().includes(query)
                            )
                    );
                }

                // Sort: pinned notes first, then by date (newest first)
                return filteredNotes.sort((a, b) => {
                    if (a.isPinned && !b.isPinned) return -1;
                    if (!a.isPinned && b.isPinned) return 1;
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
            },

            // Get pinned notes
            getPinnedNotes: () => {
                const { notes } = get();
                return notes.filter((note) => note.isPinned);
            },

            // Get notes by category
            getNotesByCategory: (categoryId) => {
                const { notes } = get();
                return notes.filter((note) => note.categoryId === categoryId);
            },

            // Get recent notes (last 7 days)
            getRecentNotes: () => {
                const { notes } = get();
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                return notes
                    .filter((note) => new Date(note.createdAt) > oneWeekAgo)
                    .sort(
                        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    );
            },

            // Force refresh data
            forceRefresh: () => {
                set({ lastFetched: null });
                return get().fetchNotes(true);
            },

            // Reset store (for logout)
            reset: () =>
                set({
                    notes: [],
                    currentNote: null,
                    isLoading: false,
                    error: null,
                    searchQuery: "",
                    currentCategoryFilter: null,
                    lastFetched: null,
                }),
        }),
        {
            name: "notes-storage",
            partialize: (state) => ({
                // Only persist these fields, NOT isLoading
                lastFetched: state.lastFetched,
                currentCategoryFilter: state.currentCategoryFilter,
                searchQuery: state.searchQuery,
            }),
            version: 1,
        }
    )
);

```

## File: utils/constants.js
```js
export const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001/api";
export const APP_NAME = import.meta.env.VITE_APP_NAME || "JustNotes";

export const ROUTES = {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    NOTES: "/notes",
    CATEGORIES: "/categories",
    PROFILE: "/profile",
};

export const STORAGE_KEYS = {
    ACCESS_TOKEN: "accessToken",
    REFRESH_TOKEN: "refreshToken",
    USER_DATA: "userData",
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Network error. Please check your connection.",
    UNAUTHORIZED: "Please login to continue.",
    FORBIDDEN: "You do not have permission to access this resource.",
    DEFAULT: "Something went wrong. Please try again.",
};

```

## File: utils/helpers.js
```js
import { STORAGE_KEYS } from "./constants";

export const getStorageItem = (key) => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    } catch (error) {
        console.error("Error reading from localStorage:", error);
        return null;
    }
};

export const setStorageItem = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error("Error writing to localStorage:", error);
        return false;
    }
};

export const removeStorageItem = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error("Error removing from localStorage:", error);
        return false;
    }
};

export const clearStorage = () => {
    try {
        localStorage.clear();
        return true;
    } catch (error) {
        console.error("Error clearing localStorage:", error);
        return false;
    }
};

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const truncateText = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};

export const generateId = () => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

```

## File: utils/tokens.js
```js
export const tokenUtils = {
    isTokenExpired: (token) => {
        if (!token) return true;

        try {
            // For JWT tokens, check expiration
            if (token.includes(".")) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                const isExpired = payload.exp * 1000 < Date.now();
                console.log(`🔐 Token expiration check:`, {
                    expires: new Date(payload.exp * 1000),
                    now: new Date(),
                    isExpired,
                });
                return isExpired;
            }
            // For demo tokens, consider them valid
            console.log("🔐 Demo token - considered valid");
            return false;
        } catch (error) {
            console.error("❌ Token validation error:", error);
            return true;
        }
    },

    getTokenExpiration: (token) => {
        if (!token) return null;

        try {
            if (token.includes(".")) {
                const payload = JSON.parse(atob(token.split(".")[1]));
                return new Date(payload.exp * 1000);
            }
            return null;
        } catch {
            return null;
        }
    },

    decodeToken: (token) => {
        if (!token) return null;

        try {
            if (token.includes(".")) {
                return JSON.parse(atob(token.split(".")[1]));
            }
            return { type: "demo-token" };
        } catch {
            return null;
        }
    },
};

```

## File: utils/validators.js
```js
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validatePassword = (password) => {
    return password.length >= 6;
};

export const validateRequired = (value) => {
    return value && value.trim().length > 0;
};

export const validateNoteTitle = (title) => {
    return title && title.trim().length > 0 && title.length <= 5000;
};

export const validateNoteContent = (content) => {
    return content && content.trim().length > 0 && content.length <= 100000;
};

export const validateBase64 = (value) => {
    if (!value) return false;
    try {
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        return base64Regex.test(value) && value.length % 4 === 0;
    } catch {
        return false;
    }
};
```

