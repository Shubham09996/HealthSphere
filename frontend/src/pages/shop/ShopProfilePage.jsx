import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Edit, ShoppingCart, IndianRupee, Star, Activity, CheckCircle, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { shopOwnerData as data } from '../../data/shopOwnerData';
import { shopData } from '../../data/shopData';
import * as LucideIcons from 'lucide-react';

const StatCard = ({ icon, title, value }) => (
    <div className="bg-muted p-4 rounded-lg text-center">
        {icon}
        <p className="text-2xl font-bold mt-1 text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{title}</p>
    </div>
);

const ShopProfilePage = () => {
    return (
        <div className="space-y-8">
            {/* Profile Header */}
            <motion.div 
                className="bg-card p-6 rounded-xl border border-border/70 shadow-sm flex flex-col sm:flex-row items-center gap-6"
                initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            >
                <img src={data.personalInfo.pfp} alt={data.personalInfo.name} className="w-24 h-24 rounded-full border-4 border-primary/50"/>
                <div className="flex-1 text-center sm:text-left">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">{data.personalInfo.name}</h1>
                    <p className="font-semibold text-muted-foreground">{data.personalInfo.role}</p>
                    <p className="text-sm text-muted-foreground mt-1">Member since {new Date(data.personalInfo.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                </div>
                <Link to="/shop/settings" className="flex items-center gap-2 font-semibold py-2 px-4 rounded-lg bg-muted text-foreground hover:bg-border">
                    <Edit size={16}/> Edit Profile
                </Link>
            </motion.div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Performance Chart */}
                     <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4">Your Weekly Activity</h3>
                        <div className="h-64 w-full">
                            <ResponsiveContainer>
                                <BarChart data={data.weeklyActivity} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    {/* UPDATED: All chart colors now use hsl() for dark mode compatibility */}
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false}/>
                                    <XAxis dataKey="day" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: 'hsl(var(--muted))' }}/>
                                    <Bar dataKey="tasks" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={25} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Recent Activity Feed */}
                     <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4 flex items-center gap-2"><Activity size={20} className="text-primary"/> Recent Activity Log</h3>
                        <div className="space-y-4">
                            {data.recentActivity.map(item => {
                                const Icon = LucideIcons[item.icon] || LucideIcons['Activity'];
                                return (
                                <div key={item.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-muted p-2 rounded-full"><Icon size={16} className="text-muted-foreground"/></div>
                                        <p className="font-semibold text-sm text-foreground">{item.action}</p>
                                    </div>
                                    <p className="text-xs text-muted-foreground flex-shrink-0">{item.timestamp}</p>
                                </div>
                            )})}
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4">Performance Stats</h3>
                        <div className="space-y-4">
                             <StatCard icon={<IndianRupee size={24} className="text-green-500"/>} title="Revenue Managed" value={data.performance.revenueManaged} />
                             <StatCard icon={<ShoppingCart size={24} className="text-blue-500"/>} title="Orders Processed" value={data.performance.ordersProcessed} />
                             <StatCard icon={<Star size={24} className="text-yellow-500"/>} title="Customer Satisfaction" value={data.performance.customerSatisfaction} />
                        </div>
                    </div>
                     <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                        <h3 className="font-bold text-lg text-foreground mb-4">Your Shop</h3>
                        <div className="flex items-center gap-3">
                            <img src={shopData.shopInfo.logo} alt={shopData.shopInfo.name} className="w-12 h-12 rounded-lg bg-white p-1"/>
                            <div>
                                <p className="font-bold text-foreground">{shopData.shopInfo.name}</p>
                                {shopData.shopInfo.isPremium && <p className="text-xs font-semibold text-yellow-500">Premium Member</p>}
                            </div>
                        </div>
                        <Link to="/shop/settings/profile" className="mt-4 block w-full text-center font-semibold py-2 rounded-lg bg-muted hover:bg-border transition-colors text-sm">
                           Manage Shop
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShopProfilePage;