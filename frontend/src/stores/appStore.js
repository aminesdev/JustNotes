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
