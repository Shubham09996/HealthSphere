import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { scheduleData } from '../../data/scheduleData';
import DayView from '../../components/doctor/schedule/DayView';
import WeekView from '../../components/doctor/schedule/WeekView';

const SchedulePage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [view, setView] = useState('Day'); // 'Day' or 'Week'

    const handlePrev = () => {
        if (view === 'Day') {
            setCurrentDate(d => new Date(d.setDate(d.getDate() - 1)));
        } else {
            setCurrentDate(d => new Date(d.setDate(d.getDate() - 7)));
        }
    };

    const handleNext = () => {
         if (view === 'Day') {
            setCurrentDate(d => new Date(d.setDate(d.getDate() + 1)));
        } else {
            setCurrentDate(d => new Date(d.setDate(d.getDate() + 7)));
        }
    };
    
    const handleToday = () => {
        setCurrentDate(new Date());
    }

    const filteredAppointments = scheduleData.filter(apt => {
        const aptDate = new Date(apt.start);
        const currDate = new Date(currentDate);
        return aptDate.toDateString() === currDate.toDateString();
    });

    const getWeekAppointments = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return scheduleData.filter(apt => {
            const aptDate = new Date(apt.start);
            return aptDate >= startOfWeek && aptDate <= endOfWeek;
        });
    };

    return (
        <div className="h-full flex flex-col">
            {/* Header Controls */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
                <div>
                    {/* === SIRF IS HEADING PAR GRADIENT LAGAYA HAI === */}
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">My Schedule</h1>
                    <p className="text-muted-foreground mt-1">Manage your appointments and time blocks.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center p-1 bg-muted rounded-lg">
                        <button onClick={handlePrev} className="p-2 rounded-md hover:bg-card"><ChevronLeft size={20}/></button>
                        <button onClick={handleToday} className="px-4 py-1.5 text-sm font-semibold hover:bg-card rounded-md">Today</button>
                        <button onClick={handleNext} className="p-2 rounded-md hover:bg-card"><ChevronRight size={20}/></button>
                    </div>
                     <div className="flex items-center p-1 bg-muted rounded-lg">
                        <button onClick={() => setView('Day')} className={`px-3 py-1.5 text-sm font-semibold rounded-md ${view==='Day' ? 'bg-card shadow-sm' : ''}`}>Day</button>
                        <button onClick={() => setView('Week')} className={`px-3 py-1.5 text-sm font-semibold rounded-md ${view==='Week' ? 'bg-card shadow-sm' : ''}`}>Week</button>
                    </div>
                </div>
            </div>
            
            {/* Calendar View */}
            <div className="flex-1">
                 <AnimatePresence mode="wait">
                    <motion.div
                        key={view}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {view === 'Day' && <DayView date={currentDate} appointments={filteredAppointments} />}
                        {view === 'Week' && <WeekView date={currentDate} appointments={getWeekAppointments()} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SchedulePage;