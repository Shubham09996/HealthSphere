import React, { useState } from 'react';
import { motion } from 'framer-motion';

// Reusable Components
const SettingsCard = ({ title, description, children, footer }) => (
    <motion.div 
        className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
    >
        <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
        <div className="p-6">{children}</div>
        {footer && <div className="p-4 bg-muted/50 rounded-b-xl text-right">{footer}</div>}
    </motion.div>
);

const SwitchToggle = ({ enabled, setEnabled }) => (
    <div onClick={() => setEnabled(!enabled)} className={`w-10 h-5 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${enabled ? 'bg-primary justify-end' : 'bg-muted justify-start'}`}>
        <motion.div layout className="w-4 h-4 bg-white rounded-full shadow" />
    </div>
);


const NotificationSettings = () => {
    const [newAppointment, setNewAppointment] = useState(true);
    const [cancellation, setCancellation] = useState(true);
    const [summary, setSummary] = useState(false);

    return (
        <SettingsCard
            title="Notification Preferences"
            description="Choose how you receive alerts related to your practice."
            footer={<button className="font-bold py-2 px-5 rounded-lg bg-primary text-primary-foreground">Save Preferences</button>}
        >
            <div className="space-y-4">
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                    <div>
                        <p className="font-semibold text-foreground">New Appointment</p>
                        <p className="text-sm text-muted-foreground">Get notified when a new patient is assigned to you.</p>
                    </div>
                    <SwitchToggle enabled={newAppointment} setEnabled={setNewAppointment}/>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                    <div>
                        <p className="font-semibold text-foreground">Appointment Cancellation</p>
                        <p className="text-sm text-muted-foreground">Receive alerts when a patient cancels an appointment.</p>
                    </div>
                    <SwitchToggle enabled={cancellation} setEnabled={setCancellation}/>
                </div>
                <div className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                    <div>
                        <p className="font-semibold text-foreground">Daily Summary</p>
                        <p className="text-sm text-muted-foreground">Get a summary of your day's consultations via email.</p>
                    </div>
                    <SwitchToggle enabled={summary} setEnabled={setSummary}/>
                </div>
            </div>
        </SettingsCard>
    );
};

export default NotificationSettings;