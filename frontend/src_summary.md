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

    return accessToken && user ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({children}) => {
    const {accessToken, user, isLoading, isInitialized} = useAuthStore();

    if (!isInitialized || isLoading) {
        return <LoadingSpinner />;
    }

    return !(accessToken && user) ? children : <Navigate to="/notes" replace />;
};

function App() {
    const {initialize, isInitialized} = useAuthStore();

    useEffect(() => {
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

## File: components/auth/EncryptionSetup.jsx
```jsx
import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Label} from '@/components/ui/label';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {EncryptionService} from '../../utils/encryption';
import {authService} from '../../services/authService';
import {useAuthStore} from '../../stores/authStore';

const EncryptionSetup = () => {
    const [step, setStep] = useState(1);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [hasEncryption, setHasEncryption] = useState(false);

    const {user, setUser} = useAuthStore();

    // Check if encryption is already setup
    useEffect(() => {
        if (user?.publicKey && user?.encryptedPrivateKey) {
            setHasEncryption(true);
        } else {
            setHasEncryption(false);
        }
    }, [user]);

    const handleSetupEncryption = async () => {
        // Clear previous errors
        setError('');

        // Validate passwords
        if (!password || !confirmPassword) {
            setError('Please fill in both password fields');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setIsLoading(true);

        try {
            console.log('Starting encryption setup...');

            // Generate key pair
            const keyPair = EncryptionService.generateKeyPair();
            console.log('Key pair generated:', {
                publicKey: keyPair.publicKey,
                hasPrivateKey: !!keyPair.privateKey
            });

            // Encrypt private key
            const encryptedPrivateKey = EncryptionService.encryptPrivateKey(
                keyPair.privateKey,
                password
            );
            console.log('Private key encrypted, length:', encryptedPrivateKey.length);

            const payload = {
                publicKey: keyPair.publicKey,
                encryptedPrivateKey: encryptedPrivateKey
            };
            console.log('Sending payload to API:', payload);

            // Call API
            const response = await authService.setupEncryption(payload);
            console.log('API response:', response);

            // Update user in store and localStorage
            const updatedUser = {
                ...user,
                publicKey: keyPair.publicKey,
                encryptedPrivateKey: encryptedPrivateKey
            };

            setUser(updatedUser);

            // Also update localStorage directly to ensure persistence
            const userData = localStorage.getItem('userData');
            if (userData) {
                const parsedUser = JSON.parse(userData);
                const updatedUserData = {
                    ...parsedUser,
                    publicKey: keyPair.publicKey,
                    encryptedPrivateKey: encryptedPrivateKey
                };
                localStorage.setItem('userData', JSON.stringify(updatedUserData));
            }

            setSuccess('Encryption setup completed successfully');
            setHasEncryption(true);
            setPassword('');
            setConfirmPassword('');
            setStep(3);
        } catch (error) {
            console.error('Encryption setup error:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });

            // More detailed error messages
            let errorMessage = 'Failed to setup encryption';

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.msg) {
                errorMessage = error.response.data.msg;
            } else if (error.message) {
                errorMessage = error.message;
            }

            // Check for specific error types
            if (error.response?.status === 401) {
                errorMessage = 'Authentication required. Please login again.';
            } else if (error.response?.status === 404) {
                errorMessage = 'Encryption endpoint not found. Please contact support.';
            } else if (error.message?.includes('Network')) {
                errorMessage = 'Network error. Please check your connection.';
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    // Clear error when user starts typing
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (error) setError('');
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
        if (error) setError('');
    };

    // If encryption is already setup, show status
    if (hasEncryption) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Encryption Status</CardTitle>
                    <CardDescription>
                        Your encryption is properly configured and securing your data
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert className="bg-green-50 border-green-200">
                        <AlertDescription className="text-green-800">
                            Encryption is enabled and protecting your data
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Setup Encryption</CardTitle>
                <CardDescription>
                    End-to-end encryption is required to protect your notes
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {error && (
                    <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {success && (
                    <Alert>
                        <AlertDescription>{success}</AlertDescription>
                    </Alert>
                )}

                {step === 1 && (
                    <div className="space-y-4">
                        <Alert>
                            <AlertDescription>
                                <strong>Important:</strong> Your notes are encrypted on your device before being sent to the server.
                                You must remember your password to decrypt your data. We cannot recover your data if you forget your password.
                                <br /><br />
                                <strong>This is a one-time setup.</strong>
                            </AlertDescription>
                        </Alert>
                        <Button onClick={() => setStep(2)} className="w-full">
                            Start Setup
                        </Button>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="password">Encryption Password *</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter a strong password (minimum 8 characters)"
                                value={password}
                                onChange={handlePasswordChange}
                                required
                                disabled={isLoading}
                            />
                            <p className="text-xs text-muted-foreground">
                                This password will be used to encrypt/decrypt your notes locally.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm Password *</Label>
                            <Input
                                id="confirmPassword"
                                type="password"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={handleConfirmPasswordChange}
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={handleSetupEncryption}
                                disabled={isLoading || !password || !confirmPassword}
                                className="flex-1"
                            >
                                {isLoading ? 'Setting up...' : 'Complete Setup'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setStep(1);
                                    setPassword('');
                                    setConfirmPassword('');
                                    setError('');
                                }}
                                disabled={isLoading}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4">
                        <Alert className="bg-green-50 border-green-200">
                            <AlertDescription className="text-green-800">
                                Encryption setup completed successfully! You can now create encrypted notes.
                            </AlertDescription>
                        </Alert>
                        <Button
                            onClick={() => setHasEncryption(true)}
                            variant="outline"
                            className="w-full"
                        >
                            Continue
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default EncryptionSetup;
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
                        <h1 className="text-xl font-semibold hidden sm:block">LockNote</h1>
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
                        className="flex-shrink-0"
                    >
                        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
                    </Button>

                    {user && (
                        <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground hidden sm:block">
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
                    <h2 className="text-lg font-semibold">LockNote</h2>
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
                                    "w-full justify-start gap-3",
                                    isActive(item.href) && "bg-secondary"
                                )}
                            >
                                {item.icon}
                                {item.name}
                            </Button>
                        </Link>
                    ))}

                    {/* Categories Section */}
                    {categories.length > 0 && (
                        <div className="pt-6">
                            <div className="flex items-center justify-between px-3 mb-2">
                                <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                    {categories.length}
                                </span>
                            </div>
                            <div className="space-y-1">
                                {categories.slice(0, 8).map((category) => (
                                    <Button
                                        key={category.id}
                                        variant={currentCategoryFilter === category.id ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-start gap-2 text-sm",
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
                                {categories.length > 8 && (
                                    <Button variant="ghost" className="w-full justify-start text-sm text-muted-foreground">
                                        +{categories.length - 8} more
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
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
```

## File: components/notes/NoteEditor.jsx
```jsx
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
import {useAuthStore} from '../../stores/authStore';
import {EncryptionService} from '../../utils/encryption';

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
    const {user} = useAuthStore();

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
            if (!user?.publicKey) {
                throw new Error('Encryption not set up. Please setup encryption first.');
            }

            const encryptedData = EncryptionService.prepareNoteData({
                title: formData.title,
                content: formData.content,
                tags: formData.tags || [],
                categoryId: formData.categoryId || null,
                isPinned: formData.isPinned || false
            }, user.publicKey);

            console.log('Sending note data:', encryptedData);
            await onSave(encryptedData);
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

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
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
        clearError,
        clearValidationErrors
    } = useCategoriesStore();

    const [isModalOpen, setIsModalOpen] = useState(false);
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

        if (newCategory.description && newCategory.description.length > 500) {
            errors.description = 'Description must be less than 500 characters';
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

    const handleModalClose = () => {
        setIsModalOpen(false);
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
                // CHANGED: Using list view instead of cards
                <div className="bg-white rounded-lg border border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                        {categories.map((category) => (
                            <CategoryListItem
                                key={category.id}
                                category={category}
                                noteCount={getNoteCount(category)}
                            />
                        ))}
                    </div>
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
        </div>
    );
};

// NEW: List item component for categories
const CategoryListItem = ({category, noteCount}) => {
    return (
        <div className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center gap-4 flex-1">
                <div
                    className="w-4 h-4 rounded-full flex-shrink-0 border border-gray-200"
                    style={{backgroundColor: category.color || '#6B73FF'}}
                />
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {category.name}
                    </h3>
                    {category.description && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {category.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <span className="whitespace-nowrap">
                    {noteCount} {noteCount === 1 ? 'note' : 'notes'}
                </span>
                <span className="whitespace-nowrap">
                    {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
                </span>
            </div>
        </div>
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
                    <h1 className="text-4xl font-bold text-foreground mb-2">LockNote</h1>
                    <p className="text-muted-foreground">End-to-End Encrypted Notes</p>
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
                    <h1 className="text-4xl font-bold text-foreground mb-2">LockNote</h1>
                    <p className="text-muted-foreground">End-to-End Encrypted Notes</p>
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
                    <h1 className="text-4xl font-bold text-foreground mb-2">LockNote</h1>
                    <p className="text-muted-foreground">End-to-End Encrypted Notes</p>
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

## File: pages/Notes.jsx
```jsx
import React, {useEffect} from 'react';
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

    // Load data on component mount
    useEffect(() => {
        const loadData = async () => {
            await Promise.all([
                fetchNotes(),
                fetchCategories()
            ]);
        };
        loadData();
    }, []); // Empty dependency array - run only once

    // Reload when category filter changes
    useEffect(() => {
        if (currentCategoryFilter) {
            fetchNotes(true); // force refresh
        }
    }, [currentCategoryFilter]);

    if (isLoading) {
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
                            : 'Manage your encrypted notes'
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
import EncryptionSetup from '../components/auth/EncryptionSetup';

const Profile = () => {
    const {user, logout} = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading to ensure data is ready
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

            <EncryptionSetup />

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
                    <h1 className="text-4xl font-bold text-foreground mb-2">LockNote</h1>
                    <p className="text-muted-foreground">End-to-End Encrypted Notes</p>
                </div>

                <Card>
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-bold text-center">Create Account</CardTitle>
                        <CardDescription className="text-center">
                            Sign up for your LockNote account
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
                    <h1 className="text-4xl font-bold text-foreground mb-2">LockNote</h1>
                    <p className="text-muted-foreground">End-to-End Encrypted Notes</p>
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

api.interceptors.request.use(
    (config) => {
        // Try to get token from multiple sources
        let token = localStorage.getItem("accessToken");

        // If not found, try to get from Zustand persist storage
        if (!token) {
            try {
                const authStorage = localStorage.getItem("auth-storage");
                if (authStorage) {
                    const parsed = JSON.parse(authStorage);
                    token = parsed.state?.accessToken;
                }
            } catch (e) {
                console.error("Error parsing auth storage:", e);
            }
        }

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        if (!error.response) {
            throw new Error(
                "Cannot connect to server. Please check your connection."
            );
        }

        if (error.response?.status === 401) {
            // Clear all auth data
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("userData");
            localStorage.removeItem("auth-storage");
        }

        const errorMessage =
            error.response?.data?.message ||
            error.response?.data?.msg ||
            error.message ||
            "Request failed";
        throw new Error(errorMessage);
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

    setupEncryption: async (keys) => {
        const response = await api.post("/auth/encryption/setup", keys);
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
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error("Authentication required. Please login again.");
            }
            if (error.response?.status === 404) {
                return [];
            }
            throw error;
        }
    },

    getCategoryById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    createCategory: async (categoryData) => {
        const payload = {
            name: categoryData.name.trim(),
            description: categoryData.description?.trim() || null,
            color: categoryData.color || "#6B73FF",
        };

        const response = await api.post("/categories", payload);
        return response.data;
    },

    updateCategory: async (id, categoryData) => {
        const response = await api.put(`/categories/${id}`, categoryData);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },

    getCategoryNotes: async (id) => {
        const response = await api.get(`/categories/${id}/notes`);
        return response.data;
    },
};

```

## File: services/notesService.js
```js
// services/notesService.js
import api from "./api";

export const notesService = {
    getNotes: async () => {
        const response = await api.get("/notes");
        return response.data;
    },

    createNote: async (noteData) => {
        const payload = {
            ...noteData,
            categoryId: noteData.categoryId || null,
            tags: noteData.tags || [],
            isPinned: noteData.isPinned || false,
        };

        const response = await api.post("/notes", payload);
        return response.data;
    },

    updateNote: async (id, noteData) => {
        const payload = {
            ...noteData,
            categoryId: noteData.categoryId || null,
            tags: noteData.tags || [],
            isPinned: noteData.isPinned || false,
        };

        const response = await api.put(`/notes/${id}`, payload);
        return response.data;
    },

    deleteNote: async (id) => {
        const response = await api.delete(`/notes/${id}`);
        return response.data;
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
                const token = localStorage.getItem("accessToken");
                const userData = localStorage.getItem("userData");

                if (token && userData) {
                    try {
                        const user = JSON.parse(userData);
                        const refreshToken =
                            localStorage.getItem("refreshToken");

                        set({
                            user,
                            accessToken: token,
                            refreshToken,
                            isInitialized: true,
                        });
                    } catch {
                        get().clearAuth();
                    }
                } else {
                    set({ isInitialized: true });
                }
            },

            // ADD THIS FUNCTION
            setUser: (user) => {
                set({ user });
                // Also update localStorage
                if (user) {
                    localStorage.setItem("userData", JSON.stringify(user));
                }
            },

            login: async (credentials) => {
                set({ isLoading: true, error: null });

                try {
                    const response = await authService.login(credentials);
                    const { user, accessToken, refreshToken } = response.data;

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
                    }

                    return response;
                } catch (error) {
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

                    set({
                        user: null,
                        accessToken: null,
                        refreshToken: null,
                        isLoading: false,
                        error: null,
                    });
                }
            },

            clearAuth: () => {
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

                    if (error.response?.data?.errors) {
                        validationErrors = error.response.data.errors;
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
                    const errorMessage =
                        error.response?.data?.message ||
                        error.response?.data?.msg ||
                        error.message ||
                        "Failed to update category";
                    set({
                        isLoading: false,
                        error: errorMessage,
                        validationErrors: {},
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
import { EncryptionService } from "../utils/encryption";

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

            // Fetch notes with proper request deduplication
            fetchNotes: async (forceRefresh = false) => {
                const state = get();

                // Prevent multiple simultaneous requests
                if (state.isLoading && !forceRefresh) {
                    return;
                }

                // Use cache if data is fresh (less than 30 seconds old)
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
                    let notes = response.data || [];

                    // For demo purposes, if no notes from API, create some mock data
                    if (notes.length === 0) {
                        console.log("No notes from API, using demo data");
                        notes = [
                            {
                                id: "1",
                                title: "Welcome to LockNote",
                                content: "This is your first encrypted note!",
                                tags: ["welcome", "demo"],
                                categoryId: null,
                                isPinned: true,
                                createdAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString(),
                            },
                        ];
                    }

                    set({
                        notes: notes,
                        isLoading: false,
                        lastFetched: Date.now(),
                    });
                } catch (error) {
                    console.error("Error fetching notes:", error);

                    // If API fails, use demo data for development
                    console.log("API failed, using demo data");
                    const demoNotes = [
                        {
                            id: "1",
                            title: "Welcome to LockNote",
                            content:
                                "This is your first encrypted note! Your notes are securely encrypted.",
                            tags: ["welcome", "encryption"],
                            categoryId: null,
                            isPinned: true,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                        {
                            id: "2",
                            title: "How to use LockNote",
                            content:
                                '1. Create notes with the "New Note" button\n2. Organize with categories\n3. Your data is encrypted end-to-end',
                            tags: ["tutorial", "guide"],
                            categoryId: null,
                            isPinned: false,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString(),
                        },
                    ];

                    set({
                        notes: demoNotes,
                        isLoading: false,
                        lastFetched: Date.now(),
                    });
                }
            },

            // Fetch single note by ID
            fetchNoteById: async (id) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await notesService.getNoteById(id);
                    let note = response.data;

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
                    const newNote = response.data;

                    set((state) => ({
                        notes: [newNote, ...state.notes],
                        isLoading: false,
                        lastFetched: Date.now(),
                    }));
                    return newNote;
                } catch (error) {
                    console.error("Error creating note:", error);

                    // If API fails, create note locally for demo
                    const localNote = {
                        id: Date.now().toString(),
                        ...noteData,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };

                    set((state) => ({
                        notes: [localNote, ...state.notes],
                        isLoading: false,
                        lastFetched: Date.now(),
                    }));

                    return localNote;
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
                    const updatedNote = response.data;

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

                // Sort: pinned notes first, then by date
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
export const APP_NAME = import.meta.env.VITE_APP_NAME || "LockNote";

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
    ENCRYPTION_KEYS: "encryptionKeys",
};

export const ERROR_MESSAGES = {
    NETWORK_ERROR: "Network error. Please check your connection.",
    UNAUTHORIZED: "Please login to continue.",
    FORBIDDEN: "You do not have permission to access this resource.",
    DEFAULT: "Something went wrong. Please try again.",
};

```

## File: utils/encryption.js
```js
import CryptoJS from "crypto-js";

export class EncryptionService {
    static stringToBase64(str) {
        try {
            if (typeof btoa !== "undefined")
                return btoa(unescape(encodeURIComponent(str)));
            return Buffer.from(str, "utf8").toString("base64");
        } catch (err) {
            console.error("Base64 encoding error:", err);
            throw new Error("Failed to encode data to base64");
        }
    }

    static base64ToString(base64) {
        try {
            if (typeof atob !== "undefined")
                return decodeURIComponent(escape(atob(base64)));
            return Buffer.from(base64, "base64").toString("utf8");
        } catch (err) {
            console.error("Base64 decoding error:", err);
            throw new Error("Failed to decode base64 data");
        }
    }

    static generateSymmetricKey() {
        return CryptoJS.lib.WordArray.random(32).toString();
    }

    static encryptWithSymmetricKey(data, symmetricKey) {
        try {
            const base64Data = this.stringToBase64(data);
            return CryptoJS.AES.encrypt(base64Data, symmetricKey).toString();
        } catch (err) {
            console.error("Encryption error:", err);
            throw new Error("Failed to encrypt data");
        }
    }

    static decryptWithSymmetricKey(encryptedData, symmetricKey) {
        try {
            const decrypted = CryptoJS.AES.decrypt(encryptedData, symmetricKey);
            const base64Result = decrypted.toString(CryptoJS.enc.Utf8);
            if (!base64Result)
                throw new Error("Decryption resulted in empty string");
            return this.base64ToString(base64Result);
        } catch (err) {
            console.error("Decryption error:", err);
            throw new Error("Failed to decrypt data");
        }
    }

    static encryptSymmetricKey(symmetricKey, publicKey) {
        // For now, use a simple encryption since we don't have RSA implemented
        // In a real app, you'd use Web Crypto API or a library for RSA
        return this.stringToBase64(symmetricKey);
    }

    static decryptSymmetricKey(encryptedSymmetricKey, privateKey) {
        // For now, simple base64 decode since we're using symmetric encryption
        // In a real app, you'd decrypt with RSA private key
        return this.base64ToString(encryptedSymmetricKey);
    }

    // ADD THESE MISSING METHODS
    static generateKeyPair() {
        // Mock key pair generation - in real app use Web Crypto API
        return {
            publicKey:
                "mock-public-key-" + Math.random().toString(36).substr(2, 9),
            privateKey:
                "mock-private-key-" + Math.random().toString(36).substr(2, 9),
        };
    }

    static encryptPrivateKey(privateKey, password) {
        // Simple encryption for demo - use proper encryption in production
        return CryptoJS.AES.encrypt(privateKey, password).toString();
    }

    static decryptPrivateKey(encryptedPrivateKey, password) {
        try {
            const decrypted = CryptoJS.AES.decrypt(
                encryptedPrivateKey,
                password
            );
            return decrypted.toString(CryptoJS.enc.Utf8);
        } catch (error) {
            console.error("Private key decryption error:", error);
            throw new Error("Failed to decrypt private key - wrong password?");
        }
    }

    static prepareNoteData(noteData, userPublicKey) {
        try {
            console.log("Original note data:", noteData);

            const symmetricKey = this.generateSymmetricKey();
            console.log("Generated symmetric key:", symmetricKey);

            const encryptedTitle = this.encryptWithSymmetricKey(
                noteData.title,
                symmetricKey
            );
            const encryptedContent = this.encryptWithSymmetricKey(
                noteData.content,
                symmetricKey
            );
            const encryptedTags =
                noteData.tags?.map((tag) =>
                    this.encryptWithSymmetricKey(tag, symmetricKey)
                ) || [];
            const encryptedSymmetricKey = this.encryptSymmetricKey(
                symmetricKey,
                userPublicKey
            );

            const preparedData = {
                title: encryptedTitle,
                content: encryptedContent,
                tags: encryptedTags,
                encryptedKey: encryptedSymmetricKey,
                categoryId: noteData.categoryId || null,
                isPinned: noteData.isPinned || false,
            };

            console.log("Prepared encrypted note data:", preparedData);
            return preparedData;
        } catch (err) {
            console.error("Error preparing note data:", err);
            throw new Error("Failed to prepare note data for encryption");
        }
    }

    // ADD THIS MISSING DECRYPTION METHOD
    static decryptNoteData(note, encryptedPrivateKey, password) {
        try {
            // First decrypt the private key with user's password
            const privateKey = this.decryptPrivateKey(
                encryptedPrivateKey,
                password
            );

            // Then decrypt the symmetric key with the private key
            const symmetricKey = this.decryptSymmetricKey(
                note.encryptedKey,
                privateKey
            );

            // Finally decrypt the note content with the symmetric key
            const title = this.decryptWithSymmetricKey(
                note.title,
                symmetricKey
            );
            const content = this.decryptWithSymmetricKey(
                note.content,
                symmetricKey
            );
            const tags =
                note.tags?.map((tag) =>
                    this.decryptWithSymmetricKey(tag, symmetricKey)
                ) || [];

            return {
                title,
                content,
                tags,
            };
        } catch (error) {
            console.error("Error decrypting note data:", error);
            throw new Error("Failed to decrypt note data");
        }
    }
}

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

