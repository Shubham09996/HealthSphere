import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import PatientSidebar from './PatientSidebar.jsx';
import Header from './Header.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import Chatbot from './Chatbot.jsx'; // Chatbot component imported

const PatientDashboardLayout = () => {
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="flex flex-col h-screen bg-background">
            <Header 
                isSidebarOpen={isMobileSidebarOpen} 
                setIsSidebarOpen={setIsMobileSidebarOpen}
                theme={theme}
                toggleTheme={toggleTheme}
            />

            <div className="flex flex-1 overflow-hidden">
                {/* Desktop Sidebar */}
                <div className={`hidden md:block transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
                    <PatientSidebar 
                        isCollapsed={isSidebarCollapsed} 
                        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                    />
                </div>

                {/* Mobile Sidebar (handled by Header button) */}
                <div 
                    className={`md:hidden fixed inset-0 bg-black bg-opacity-60 z-50 transition-opacity duration-300 ${isMobileSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                    onClick={() => setIsMobileSidebarOpen(false)}
                >
                    <div 
                        className={`fixed top-0 left-0 h-full w-64 bg-card transition-transform duration-300 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <PatientSidebar isCollapsed={false} onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)} />
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
            
            {/* Chatbot component added here to be available on all dashboard pages */}
            <Chatbot />
        </div>
    );
};

export default PatientDashboardLayout;