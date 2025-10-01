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