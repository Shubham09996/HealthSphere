import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminNotificationsData as initialNotifications } from '../../data/adminNotificationsData';
import { useNavigate } from 'react-router-dom';
import * as LucideIcons from 'lucide-react';

// --- Helper function for timestamps ---
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 5) return `just now`;
    let interval = seconds / 31536000; if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000; if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400; if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600; if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60; if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
};

// --- Notification Item Component ---
const NotificationItem = ({ notification, onMarkRead, onAction }) => {
    const navigate = useNavigate();
    const Icon = LucideIcons[notification.icon] || LucideIcons['Bell'];

    const severityStyles = {
        High: { border: 'border-red-500', bg: 'bg-red-500/5' },
        Medium: { border: 'border-orange-500', bg: 'bg-orange-500/5' },
        Low: { border: 'border-blue-500', bg: 'bg-blue-500/5' },
    };

    const handleClick = () => { onMarkRead(notification.id); if (notification.link !== '#') navigate(notification.link); };

    return (
        <motion.div
            layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}
            onClick={handleClick}
            className={`flex items-start gap-4 p-4 border-b border-border last:border-b-0 cursor-pointer transition-colors ${severityStyles[notification.severity].bg} ${!notification.isRead && 'border-l-4 ' + severityStyles[notification.severity].border}`}
        >
            {!notification.isRead && <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0" />}
            <div className={`mt-1 text-muted-foreground flex-shrink-0 ${notification.isRead && 'ml-[14px]'}`}> <Icon size={20} /> </div>
            <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start">
                    <p className="font-bold text-foreground truncate">{notification.title}</p>
                    <p className="text-xs text-muted-foreground flex-shrink-0">{timeAgo(notification.timestamp)}</p>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                {notification.actions && (
                    <div className="flex gap-2 mt-3">
                        {notification.actions.map(action => (
                            <button key={action.label} onClick={(e) => { e.stopPropagation(); onAction(notification.id); }}
                                className="text-xs font-semibold py-1 px-3 rounded-md border border-border hover:bg-muted"
                            >{action.label}</button>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

// --- Main Notifications Page ---
const AdminNotificationsPage = () => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [activeTab, setActiveTab] = useState('All');
    const tabs = ['All', 'Security', 'Registration', 'System'];

    const filteredNotifications = useMemo(() => {
        if (activeTab === 'All') return notifications;
        return notifications.filter(n => n.category === activeTab);
    }, [activeTab, notifications]);
    
    const handleAction = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Platform Notifications
                    </h1>
                    <p className="text-muted-foreground mt-1">Real-time alerts, system updates, and pending actions.</p>
                </div>
                <div className="flex gap-2"><button onClick={() => setNotifications(n => n.map(notif => ({...notif, isRead: true})))} className="text-sm font-semibold text-muted-foreground hover:text-primary">Mark all as read</button></div>
            </div>

            <div className="flex border-b border-border mb-4 overflow-x-auto pb-px">
                {tabs.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`relative px-4 py-2 text-sm font-semibold flex-shrink-0 ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        {tab}
                        {activeTab === tab && <motion.div layoutId="admin-notif-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />}
                    </button>
                ))}
            </div>

            <div className="bg-card rounded-xl border border-border/70 overflow-hidden shadow-sm">
                <AnimatePresence>
                    {filteredNotifications.length > 0 ? (
                        filteredNotifications
                            .sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp))
                            .map(notification => (
                                <NotificationItem key={notification.id} notification={notification} onMarkRead={(id) => setNotifications(n => n.map(notif => notif.id === id ? {...notif, isRead: true} : notif))} onAction={handleAction} />
                            ))
                    ) : (
                        <motion.div initial={{opacity:0}} animate={{opacity:1}} className="text-center py-20 px-4">
                            <LucideIcons.BellOff size={40} className="mx-auto text-muted-foreground mb-4"/>
                            <h3 className="font-semibold text-foreground">All Clear!</h3>
                            <p className="text-sm text-muted-foreground">No notifications in this category.</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminNotificationsPage;