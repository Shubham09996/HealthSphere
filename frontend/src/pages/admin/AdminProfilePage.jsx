import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit, Activity, Users, Building, BarChart2, ShieldCheck, Award, GitBranch, UserCheck, UserX, FileText, Map } from 'lucide-react';
import { adminProfileData as data } from '../../data/adminProfileData';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import * as LucideIcons from 'lucide-react';

// --- Reusable Sub-Components for the page ---

const SparklineStat = ({ title, value, change, chartData, color }) => (
    <div className="bg-muted/50 p-4 rounded-lg border border-border/50 flex-1">
        <p className="text-sm text-muted-foreground">{title}</p>
        <div className="flex justify-between items-end">
            <p className="text-2xl font-bold text-foreground">{value}</p>
            <p className={`text-xs font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
        </div>
        <div className="h-12 w-full mt-2">
            <ResponsiveContainer>
                <LineChart data={chartData}>
                    <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2.5} dot={false}/>
                </LineChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const Achievement = ({ icon: Icon, name, description, achieved }) => (
    <div className={`flex items-center gap-4 p-3 rounded-lg transition-opacity ${achieved ? 'bg-muted' : 'opacity-40 bg-muted/50'}`}>
        <div className={`p-2 rounded-lg ${achieved ? 'bg-yellow-500/10 text-yellow-500' : 'bg-border'}`}>
            <Icon size={24}/>
        </div>
        <div>
            <p className={`font-semibold ${achieved ? 'text-foreground' : 'text-muted-foreground'}`}>{name}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    </div>
);


// --- Main Profile Page ---
const AdminProfilePage = () => {
    const iconMap = { Award, ShieldCheck, UserCheck, GitBranch };

    return (
        <div className="space-y-8">
            {/* Profile Hero Section */}
            <motion.div 
                className="bg-card p-6 rounded-xl border border-border/70 shadow-sm"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            >
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
                    <img src={data.personalInfo.pfp} alt={data.personalInfo.name} className="w-24 h-24 rounded-full border-4 border-primary/50"/>
                    <div className="flex-1 text-center sm:text-left">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">{data.personalInfo.name}</h1>
                        <p className="font-semibold text-muted-foreground">{data.personalInfo.role}</p>
                    </div>
                    <Link to="/admin/settings" className="flex items-center gap-2 font-semibold py-2 px-4 rounded-lg bg-muted text-foreground hover:bg-border">
                        <Edit size={16}/> Edit Profile
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SparklineStat title="Users Managed" value={data.performance.usersManaged.value} change={data.performance.usersManaged.change} chartData={data.performance.usersManaged.data} color="hsl(var(--primary))"/>
                    <SparklineStat title="Approvals Done" value={data.performance.approvalsDone.value} change={data.performance.approvalsDone.change} chartData={data.performance.approvalsDone.data} color="#00C49F"/>
                    <SparklineStat title="Tickets Resolved" value={data.performance.ticketsResolved.value} change={data.performance.ticketsResolved.change} chartData={data.performance.ticketsResolved.data} color="#FFBB28"/>
                </div>
            </motion.div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2"><Activity size={20} className="text-primary"/> Recent Admin Log</h3>
                        <div className="space-y-4">
                            {data.recentLog.map(item => {
                                const Icon = LucideIcons[item.icon] || LucideIcons['Activity'];
                                return (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-muted p-2 rounded-full"><Icon size={16} className="text-muted-foreground"/></div>
                                        <p className="font-semibold text-sm">{item.action}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex-shrink-0">{item.timestamp}</p>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                         <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2"><Award size={20} className="text-primary"/> Achievements</h3>
                         <div className="space-y-3">
                            {data.achievements.map(ach => (
                                <Achievement key={ach.id} icon={iconMap[ach.icon]} {...ach} />
                            ))}
                         </div>
                    </div>
                    
                    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4">Quick Actions</h3>
                        <div className="flex flex-col gap-2">
                            <Link to="/admin/users" className="font-semibold py-2 px-3 rounded-lg hover:bg-muted text-sm flex items-center gap-2"><Users size={16} className="text-primary"/> Manage Users</Link>
                            <Link to="/admin/hospitals" className="font-semibold py-2 px-3 rounded-lg hover:bg-muted text-sm flex items-center gap-2"><Building size={16} className="text-primary"/> Manage Hospitals</Link>
                             <Link to="/admin/analytics" className="font-semibold py-2 px-3 rounded-lg hover:bg-muted text-sm flex items-center gap-2"><BarChart2 size={16} className="text-primary"/> View Analytics</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminProfilePage;