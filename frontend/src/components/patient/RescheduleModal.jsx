import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { X, Clock, Calendar } from 'lucide-react';
import BookingCalendar from './booking/BookingCalendar';
import api from '../../utils/api';

const getTodayString = () => new Date().toISOString().split('T')[0];

const RescheduleModal = ({ appointment, onClose, onSuccess }) => {
    const [selectedDate, setSelectedDate] = useState(getTodayString());
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedTime, setSelectedTime] = useState(null);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [errorSlots, setErrorSlots] = useState(null);
    const [rescheduling, setRescheduling] = useState(false);
    const [dailyAvailability, setDailyAvailability] = useState({});
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const doctorId = appointment?.doctorId;

    // Fetch daily availability for calendar
    useEffect(() => {
        const fetchDailyAvailability = async () => {
            if (!doctorId) return;

            try {
                const params = { year: currentYear, month: currentMonth };
                const res = await api.get(`/api/doctors/daily-availability/${doctorId}`, { params });
                setDailyAvailability(res.data);
            } catch (err) {
                console.error("Failed to fetch daily availability:", err);
            }
        };

        fetchDailyAvailability();
    }, [doctorId, currentMonth, currentYear]);

    // Fetch available slots for selected date
    useEffect(() => {
        const fetchAvailableSlots = async () => {
            if (!selectedDate || !doctorId) {
                setAvailableSlots([]);
                return;
            }

            setLoadingSlots(true);
            setErrorSlots(null);
            setSelectedTime(null);

            try {
                const params = { date: selectedDate };
                const response = await api.get(`/api/doctors/available-slots/${doctorId}`, { params });
                setAvailableSlots(response.data);
            } catch (err) {
                console.error("Failed to fetch available slots:", err);
                setErrorSlots(err);
            } finally {
                setLoadingSlots(false);
            }
        };

        if (selectedDate) {
            fetchAvailableSlots();
        }
    }, [selectedDate, doctorId]);

    const getDayStatus = (dateString) => {
        const status = dailyAvailability[dateString];
        if (new Date(dateString) < new Date(getTodayString())) return 'disabled';
        switch (status) {
            case 'fully_available': return 'green';
            case 'partially_available': return 'orange';
            case 'unavailable': return 'red';
            default: return 'disabled';
        }
    };

    const handleMonthChange = (newMonth, newYear) => {
        setCurrentMonth(newMonth);
        setCurrentYear(newYear);
    };

    const handleReschedule = async () => {
        if (!selectedDate || !selectedTime) {
            toast.warning('Please select both date and time');
            return;
        }

        setRescheduling(true);
        try {
            // selectedDate is already in YYYY-MM-DD format
            await api.put(`/api/appointments/${appointment._id}`, {
                date: selectedDate,
                time: selectedTime,
            });

            toast.success('Appointment rescheduled successfully!');
            onSuccess();
            onClose();
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            toast.error(error.response?.data?.message || 'Failed to reschedule appointment. Please try again.');
        } finally {
            setRescheduling(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="bg-card w-full max-w-4xl h-[90vh] rounded-xl border border-border shadow-xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
                        <div>
                            <h2 className="text-2xl font-bold text-foreground">Reschedule Appointment</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                Dr. {appointment?.doctor} - {appointment?.specialty}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-full hover:bg-muted transition-colors"
                        >
                            <X size={20} className="text-muted-foreground" />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="p-6 overflow-y-auto flex-1 min-h-0">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Calendar */}
                            <div>
                                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Calendar size={18} />
                                    Select Date
                                </h3>
                                <BookingCalendar
                                    onDateSelect={setSelectedDate}
                                    getDayStatus={getDayStatus}
                                    initialDate={new Date(selectedDate)}
                                    onMonthChange={handleMonthChange}
                                />
                                <div className="flex flex-wrap gap-4 mt-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-green-300 dark:bg-green-800 border border-border"></span>
                                        Available
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-orange-300 dark:bg-orange-800 border border-border"></span>
                                        Few Slots
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="w-3 h-3 rounded-full bg-red-300 dark:bg-red-800 border border-border"></span>
                                        Fully Booked
                                    </div>
                                </div>
                            </div>

                            {/* Time Slots */}
                            <div>
                                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                                    <Clock size={18} />
                                    Select Time
                                </h3>
                                {selectedDate && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Available slots for {new Date(selectedDate).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                        <div className="grid grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                                            {loadingSlots ? (
                                                <div className="col-span-3 text-center text-muted-foreground py-4">
                                                    Loading slots...
                                                </div>
                                            ) : errorSlots ? (
                                                <div className="col-span-3 text-center text-red-500 py-4">
                                                    Error loading slots
                                                </div>
                                            ) : availableSlots.length > 0 ? (
                                                availableSlots.map((slot) => (
                                                    <motion.button
                                                        key={slot.time}
                                                        onClick={() => setSelectedTime(slot.time)}
                                                        className={`p-3 border rounded-lg text-sm font-semibold transition-colors ${
                                                            selectedTime === slot.time
                                                                ? 'bg-primary text-primary-foreground border-primary'
                                                                : 'border-border text-foreground hover:bg-muted'
                                                        }`}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        {slot.time}
                                                    </motion.button>
                                                ))
                                            ) : (
                                                <div className="col-span-3 text-center bg-muted p-4 rounded-lg">
                                                    <p className="text-sm text-muted-foreground">
                                                        No slots available for this date
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {!selectedDate && (
                                    <div className="text-center py-8 text-muted-foreground">
                                        Please select a date first
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Selected Details */}
                        {selectedDate && selectedTime && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-muted rounded-lg border border-border"
                            >
                                <p className="text-sm font-semibold text-foreground mb-2">Selected Details:</p>
                                <p className="text-sm text-muted-foreground">
                                    Date: {new Date(selectedDate).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Time: {selectedTime}
                                </p>
                            </motion.div>
                        )}
                    </div>

                    {/* Footer - Always visible at bottom */}
                    <div className="p-6 border-t border-border flex justify-end gap-3 bg-muted/30 flex-shrink-0">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 font-semibold rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
                            disabled={rescheduling}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleReschedule}
                            disabled={!selectedDate || !selectedTime || rescheduling}
                            className="px-6 py-2 font-bold rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {rescheduling ? 'Rescheduling...' : 'Reschedule Appointment'}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default RescheduleModal;

