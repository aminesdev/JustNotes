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