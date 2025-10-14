import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Activity, Users, CheckCircle, XCircle, AlertTriangle, Monitor, Smartphone } from 'lucide-react';
import { securityData as initialData } from '../../data/securityData';

// Reusable Card Component
const SecurityCard = ({ title, icon, children, className = '' }) => (
    <motion.div 
        className={`bg-card p-6 rounded-2xl border border-border/70 shadow-lg flex flex-col ${className}`}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
    >
        <div className="flex items-center gap-3 mb-4">
            <div className="bg-primary/10 text-primary p-2 rounded-lg">{icon}</div>
            <h3 className="font-bold text-lg text-foreground">{title}</h3>
        </div>
        {children}
    </motion.div>
);

// Animated Radial Progress for Security Score
const SecurityScore = ({ score }) => (
    <div className="relative w-32 h-32 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="transparent" stroke="hsl(var(--border))" strokeWidth="10"/>
            <motion.circle 
                cx="50" cy="50" r="45" fill="transparent" stroke="url(#scoreGradient)" strokeWidth="10" strokeLinecap="round"
                transform="rotate(-90 50 50)"
                strokeDasharray={2 * Math.PI * 45}
                initial={{ strokeDashoffset: 2 * Math.PI * 45 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 45 * (1 - score / 100) }}
                transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
            />
            <defs><linearGradient id="scoreGradient"><stop offset="0%" stopColor="#06D6A0"/><stop offset="100%" stopColor="hsl(var(--primary))"/></linearGradient></defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-foreground">{score}</span>
            <span className="text-xs font-semibold text-muted-foreground">/ 100</span>
        </div>
    </div>
);

// --- Main Security Page ---
const AdminSecurityPage = () => {
    const [auditLog, setAuditLog] = useState(initialData.auditLog);
    const [activeSessions, setActiveSessions] = useState(initialData.activeSessions);

    const logIcons = { Success: <CheckCircle size={16} className="text-green-500"/>, Failed: <XCircle size={16} className="text-red-500"/>, Info: <AlertTriangle size={16} className="text-yellow-500"/> };

    const revokeSession = (id) => {
        setActiveSessions(sessions => sessions.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Security Command Center
                </h1>
                <p className="text-muted-foreground mt-1">Monitor, manage, and enforce platform-wide security.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-1 space-y-8">
                    <SecurityCard title="Security Posture" icon={<Shield size={20}/>}>
                        <SecurityScore score={initialData.securityScore} />
                        <p className="text-center text-sm text-muted-foreground mt-4">Your platform security is rated as <strong className="text-green-500">Excellent</strong>.</p>
                    </SecurityCard>

                    <SecurityCard title="Two-Factor Authentication" icon={<Lock size={20}/>}>
                        <div className="bg-muted p-4 rounded-lg text-center">
                            <p className="font-bold text-3xl bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text">85%</p>
                            <p className="text-sm text-muted-foreground mt-1">of Admins & Doctors have 2FA enabled.</p>
                        </div>
                        <button className="mt-4 w-full font-semibold py-2.5 px-4 rounded-lg border border-border hover:bg-muted transition-colors">
                            Enforce 2FA for All Staff
                        </button>
                    </SecurityCard>
                </div>
                
                {/* Right Column */}
                <div className="lg:col-span-2 space-y-8">
                    <SecurityCard title="Live Audit Log" icon={<Activity size={20}/>} className="flex-1">
                        <div className="h-72 overflow-y-auto pr-2 -mr-2 space-y-3">
                             <AnimatePresence>
                             {auditLog.map(log => (
                                <motion.div 
                                    key={log.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted"
                                >
                                    <div className="flex items-center gap-3">
                                        {logIcons[log.status]}
                                        <div>
                                            <span className="font-semibold text-foreground mr-2">{log.event}</span>
                                            <span className="text-muted-foreground text-xs">by {log.user}</span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-muted-foreground flex-shrink-0">{log.timestamp}</span>
                                </motion.div>
                            ))}
                            </AnimatePresence>
                        </div>
                    </SecurityCard>
                    
                    <SecurityCard title="Active Sessions" icon={<Users size={20}/>} className="flex-1">
                        <div className="h-72 overflow-y-auto pr-2 -mr-2 space-y-3">
                            <AnimatePresence>
                            {activeSessions.map(session => (
                                <motion.div 
                                    key={session.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: 50, transition: { duration: 0.3 } }}
                                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-muted p-3 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        {session.device.includes('iPhone') ? <Smartphone size={24} className="text-muted-foreground"/> : <Monitor size={24} className="text-muted-foreground"/>}
                                        <div>
                                            <p className="font-semibold text-foreground text-sm">{session.user}</p>
                                            <p className="text-xs text-muted-foreground">{session.device} • {session.ip} ({session.location})</p>
                                        </div>
                                    </div>
                                    <button onClick={() => revokeSession(session.id)} className="text-xs font-semibold text-red-500 hover:bg-red-500/10 py-1.5 px-3 rounded-md self-end sm:self-center transition-colors">
                                        Revoke
                                    </button>
                                </motion.div>
                            ))}
                            </AnimatePresence>
                        </div>
                    </SecurityCard>
                </div>
            </div>
        </div>
    );
};

export default AdminSecurityPage;