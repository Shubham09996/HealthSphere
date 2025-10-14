import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Reusable components
const SettingsCard = ({ title, description, children, footer }) => (
    <motion.div 
        className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    >
        <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="p-6 space-y-4">{children}</div>
        {footer && <div className="p-4 bg-muted/50 rounded-b-xl text-right">{footer}</div>}
    </motion.div>
);

const SwitchToggle = ({ enabled, setEnabled }) => (
    // === SWITCH PAR GRADIENT LAGAYA HAI ===
    <div 
        onClick={() => setEnabled(!enabled)} 
        className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
            enabled ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end justify-end' : 'bg-muted justify-start'
        }`}
    >
        <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" />
    </div>
);

const DayAvailability = ({ day }) => {
    const [isOn, setIsOn] = useState(day !== 'Sunday');
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4">
            <p className="font-semibold">{day}</p>
            {isOn ? (
                <div className="col-span-2 flex items-center gap-2">
                    <input type="time" defaultValue="09:00" className="bg-background border border-border rounded-md p-2 w-full text-sm"/>
                     <span className="text-muted-foreground">to</span>
                    <input type="time" defaultValue="17:00" className="bg-background border border-border rounded-md p-2 w-full text-sm"/>
                    <SwitchToggle enabled={isOn} setEnabled={setIsOn}/>
                </div>
            ) : (
                 <div className="col-span-2 flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">Day Off</p>
                    <SwitchToggle enabled={isOn} setEnabled={setIsOn}/>
                 </div>
            )}
        </div>
    );
};

const ConsultationSettings = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="space-y-8">
            <SettingsCard
                title="Consultation Details"
                description="Manage your fees and appointment duration."
                // === SAVE CHANGES BUTTON PAR GRADIENT LAGAYA HAI ===
                footer={
                    <button className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity">
                        Save Changes
                    </button>
                }
            >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="text-sm font-medium">Consultation Fee (INR)</label>
                        <input type="number" defaultValue="800" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                    </div>
                    <div>
                        <label className="text-sm font-medium">Appointment Duration</label>
                        <select defaultValue="15" className="mt-1 w-full bg-background border border-border rounded-md p-2">
                            <option value="15">15 minutes</option>
                            <option value="20">20 minutes</option>
                            <option value="30">30 minutes</option>
                        </select>
                    </div>
                </div>
            </SettingsCard>

             <SettingsCard
                title="Weekly Availability"
                description="Set your available hours for each day. Patients can only book slots within this schedule."
                // === SAVE SCHEDULE BUTTON PAR GRADIENT LAGAYA HAI ===
                footer={
                    <button className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity">
                        Save Schedule
                    </button>
                }
            >
                <div className="space-y-4">
                    {days.map(day => <DayAvailability key={day} day={day} />)}
                </div>
            </SettingsCard>
        </div>
    );
};

export default ConsultationSettings;