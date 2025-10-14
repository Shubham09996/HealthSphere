import React, { useState, useMemo } from 'react';
import { ArrowLeft, Clock } from 'lucide-react';
import BookingCalendar from './BookingCalendar';
import { motion } from 'framer-motion'; // FIX: Missing import ko yahan add kiya gaya hai

const getTodayString = () => new Date().toISOString().split('T')[0];

const Step3SelectDateAndSlot = ({ onNext, details, onBack }) => {
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const { hospital, department, doctor } = details;
    
    const doctorsInDepartment = doctor ? [doctor] : department.doctors;

    const getDayStatus = (dateString) => {
        let totalSlots = 0;
        let availableSlots = 0;
        for (const doc of doctorsInDepartment) {
            if (doc.schedule[dateString]) {
                totalSlots += doc.schedule[dateString].length;
                availableSlots += doc.schedule[dateString].filter(s => s.status === 'available').length;
            }
        }
        if (new Date(dateString) < new Date(getTodayString())) return 'disabled';
        if (availableSlots === 0 && totalSlots > 0) return 'red';
        if (availableSlots > 0 && availableSlots / totalSlots <= 0.4) return 'orange';
        if (availableSlots > 0) return 'green';
        return 'disabled';
    };

    const availableTimes = useMemo(() => {
         let slots = [];
        for (const doc of doctorsInDepartment) {
            if (doc.schedule[selectedDate]) {
                slots.push(...doc.schedule[selectedDate]);
            }
        }
        const uniqueTimes = [...new Set(slots.filter(s => s.status === 'available').map(s => s.time))];
        return uniqueTimes.sort((a, b) => new Date('1970/01/01 ' + a) - new Date('1970/01/01 ' + b));
    }, [selectedDate, doctorsInDepartment]);

    return (
        <div>
            <div className="flex items-center gap-4 mb-4">
                 <button onClick={onBack} className="p-2 rounded-full hover:bg-muted"><ArrowLeft size={20}/></button>
                 <div>
                    <h2 className="text-2xl font-bold text-foreground">Select Date & Time</h2>
                    <p className="text-muted-foreground text-sm">Booking for <span className="font-semibold text-primary">{doctor ? doctor.name : department.name}</span></p>
                 </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8 bg-card p-6 rounded-xl border border-border">
                <div>
                     <BookingCalendar onDateSelect={setSelectedDate} getDayStatus={getDayStatus} initialDate={new Date(selectedDate)}/>
                     <div className="flex flex-wrap space-x-4 mt-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-300 dark:bg-green-800 border border-border"></span>Available</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-orange-300 dark:bg-orange-800 border border-border"></span>Few Slots</div>
                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-300 dark:bg-red-800 border border-border"></span>Fully Booked</div>
                    </div>
                </div>
                
                <motion.div key={selectedDate} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2"><Clock size={18}/> Available Slots</h3>
                     <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-2">
                        {availableTimes.length > 0 ? (
                            availableTimes.map(time => (
                                <motion.button 
                                    key={time} 
                                    onClick={() => onNext({ date: selectedDate, time })} 
                                    className="p-2 border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-primary hover:text-primary-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {time}
                                </motion.button>
                            ))
                        ) : (
                            <div className="col-span-3 text-center bg-muted p-4 rounded-lg">
                               <p className="text-muted-foreground text-sm">No slots available for <br/> {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}.</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};
export default Step3SelectDateAndSlot;