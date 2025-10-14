import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { IndianRupee, Users, Clock, Star, TrendingUp, DollarSign } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell, Legend } from 'recharts';
import { deepAnalyticsData as data } from '../../data/deepAnalyticsData';

// Reusable Components
const KpiCard = ({ title, value, change, icon, color }) => (
    <div className="bg-card p-5 rounded-xl border border-border/70 shadow-sm">
        <div className="flex items-center gap-3"><div className={`p-2 rounded-lg bg-${color}-500/10 text-${color}-500`}>{icon}</div><p className="text-sm font-semibold text-muted-foreground">{title}</p></div>
        <p className="text-3xl font-bold text-foreground mt-4">{value}</p>
        <p className={`text-xs font-semibold ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change}</p>
    </div>
);

const ChartCard = ({ title, children }) => (
    <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm h-full">
        <h3 className="font-bold text-lg text-foreground mb-4">{title}</h3>
        <div className="h-80 w-full">{children}</div>
    </div>
);


const AdminAnalyticsPage = () => {
    const [timeRange, setTimeRange] = useState('Last 30 Days');
    const COLORS = ['hsl(var(--primary))', '#00C49F', '#FFBB28'];

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Deep Analytics
                    </h1>
                    <p className="text-muted-foreground mt-1">Platform-wide performance and growth metrics.</p>
                </div>
                <select onChange={e => setTimeRange(e.target.value)} value={timeRange} className="bg-card border border-border rounded-md p-2 text-sm font-semibold">
                    <option>Last 7 Days</option><option>Last 30 Days</option><option>This Year</option>
                </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard title="Total Revenue" value={data.kpis.totalRevenue.value} change={data.kpis.totalRevenue.change} icon={<IndianRupee size={20}/>} color="green"/>
                <KpiCard title="New User Growth" value={data.kpis.newUserGrowth.value} change={data.kpis.newUserGrowth.change} icon={<Users size={20}/>} color="blue"/>
                <KpiCard title="Avg. Wait Time" value={data.kpis.avgWaitTime.value} change={data.kpis.avgWaitTime.change} icon={<Clock size={20}/>} color="orange"/>
                <KpiCard title="Platform Rating" value={data.kpis.platformRating.value} change={data.kpis.platformRating.change} icon={<Star size={20}/>} color="yellow"/>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3"><ChartCard title="User Growth Analysis">
                    <ResponsiveContainer>
                        <AreaChart data={data.userGrowth} margin={{ left: -20, top: 10, right: 10, bottom: 0 }}>
                            <defs><linearGradient id="colorPatients" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/><stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/></linearGradient></defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                            <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <Tooltip />
                            <Area type="monotone" dataKey="Patients" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorPatients)" />
                             <Area type="monotone" dataKey="Doctors" stroke="#00C49F" strokeWidth={2} fill="transparent" />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartCard></div>
                <div className="lg:col-span-2"><ChartCard title="Revenue Streams">
                     <ResponsiveContainer>
                        <PieChart><Tooltip/><Pie data={data.revenueStreams} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="60%" outerRadius="80%" paddingAngle={5}>{data.revenueStreams.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}</Pie><Legend iconSize={10}/></PieChart>
                    </ResponsiveContainer>
                </ChartCard></div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                 <h3 className="font-bold text-lg text-foreground mb-4">Top Performing Hospitals</h3>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="text-xs text-muted-foreground bg-muted/50">
                            <tr><th className="p-3">Hospital Name</th><th className="p-3">Revenue Contribution</th><th className="p-3">Avg. Rating</th></tr>
                        </thead>
                        <tbody>
                            {data.topHospitals.map(h => (
                                <tr key={h.name} className="border-b border-border last:border-b-0">
                                    <td className="p-3 font-semibold text-foreground">{h.name}</td>
                                    <td className="p-3 text-muted-foreground">{h.revenue}</td>
                                    <td className="p-3 font-semibold text-primary">{h.rating} ★</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 </div>
            </div>
        </div>
    );
};
export default AdminAnalyticsPage;