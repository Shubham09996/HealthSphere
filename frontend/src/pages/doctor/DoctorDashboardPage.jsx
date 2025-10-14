import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Clock, FileWarning } from 'lucide-react';
import { doctorData } from '../../data/doctorData';
import AppointmentQueue from '../../components/doctor/AppointmentQueue';
import NowServingCard from '../../components/doctor/NowServingCard';
import HourlyActivityChart from '../../components/doctor/HourlyActivityChart';

const StatCard = ({ icon, title, value, change, colorClass }) => (
    <div className="bg-card p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md transition-all duration-300">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>{icon}</div>
            <div>
                <p className="text-2xl font-bold text-foreground">{value}</p>
                <p className="text-sm text-muted-foreground">{title}</p>
            </div>
        </div>
        {change && <p className={`text-xs font-semibold mt-2 ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{change} vs yesterday</p>}
    </div>
);

const DoctorDashboardPage = () => {
    const { doctorInfo, dashboardStats, hourlyActivity } = doctorData;
    
    // State for managing the appointment queue
    const [queue, setQueue] = useState(doctorData.appointmentQueue);

    const handleNextPatient = () => {
        setQueue(prevQueue => {
            const newQueue = JSON.parse(JSON.stringify(prevQueue)); // Deep copy for safe mutation
            const currentPatientIndex = newQueue.findIndex(p => p.status === 'Now Serving');
            
            if (currentPatientIndex !== -1) {
                newQueue[currentPatientIndex].status = 'Done';
            }
            
            const nextPatientIndex = newQueue.findIndex(p => p.status === 'Up Next');
            if (nextPatientIndex !== -1) {
                newQueue[nextPatientIndex].status = 'Now Serving';
                const upNextIndex = newQueue.findIndex((p, index) => index > nextPatientIndex && p.status === 'Waiting');
                if (upNextIndex !== -1) {
                    newQueue[upNextIndex].status = 'Up Next';
                }
            } else {
                const nextWaitingIndex = newQueue.findIndex(p => p.status === 'Waiting');
                if (nextWaitingIndex !== -1) {
                    newQueue[nextWaitingIndex].status = 'Now Serving';
                }
            }
            return newQueue;
        });
    };

    const nowServing = queue.find(p => p.status === 'Now Serving');
    const upNext = queue.find(p => p.status === 'Up Next');
    const waiting = queue.filter(p => p.status === 'Waiting');

    return (
        <div className="space-y-8">
            <div>
                {/* === IS HEADING PAR GRADIENT LAGAYA HAI === */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Welcome back, {doctorInfo.name}!
                </h1>
                <p className="text-muted-foreground mt-1">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={<Users size={20}/>} title="Total Patients" value={dashboardStats.totalPatients.value} change={dashboardStats.totalPatients.change} colorClass="bg-blue-500/20 text-blue-500"/>
                <StatCard icon={<Clock size={20}/>} title="Avg. Consult Time" value={dashboardStats.avgConsultationTime.value} change={dashboardStats.avgConsultationTime.change} colorClass="bg-green-500/20 text-green-500"/>
                <StatCard icon={<FileWarning size={20}/>} title="Pending Reports" value={dashboardStats.pendingReports.value} change={dashboardStats.pendingReports.change} colorClass="bg-orange-500/20 text-orange-500"/>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <NowServingCard nowServingPatient={nowServing} onConsultationDone={handleNextPatient} />
                    <AppointmentQueue upNextPatient={upNext} waitingPatients={waiting} />
                </div>
                
                <div className="lg:col-span-1 space-y-8">
                    {/* The DoctorStatusToggle has been moved to the new DoctorHeader */}
                    <HourlyActivityChart data={hourlyActivity} />
                </div>
            </div>
        </div>
    );
};

export default DoctorDashboardPage;