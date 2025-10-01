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