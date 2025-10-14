import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { shopSettingsData as data } from '../../../data/shopSettingsData';

// Reusable components for this page
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

const DayAvailability = ({ day, initialHours }) => {
    const [isOn, setIsOn] = useState(initialHours.enabled);
    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center gap-4 py-2">
            <p className="font-semibold">{day}</p>
            {isOn ? (
                <div className="col-span-2 flex items-center gap-2">
                    <input type="time" defaultValue={initialHours.from} className="bg-background border border-border rounded-md p-2 w-full text-sm"/>
                     <span className="text-muted-foreground">to</span>
                    <input type="time" defaultValue={initialHours.to} className="bg-background border border-border rounded-md p-2 w-full text-sm"/>
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

const ShopProfileSettings = () => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    return (
        <div className="space-y-8">
            <SettingsCard
                title="Shop Profile"
                description="Update your pharmacy's public details."
                footer={<button className="font-bold py-2 px-5 rounded-lg bg-primary text-primary-foreground">Save Changes</button>}
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium">Shop Name</label>
                            <input type="text" defaultValue={data.profile.name} className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Contact Phone</label>
                            <input type="tel" defaultValue={data.profile.phone} className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Contact Email</label>
                            <input type="email" defaultValue={data.profile.email} className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                        <div className="sm:col-span-2">
                            <label className="text-sm font-medium">Address</label>
                            <input type="text" defaultValue={data.profile.address} className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                        </div>
                    </div>
                </div>
            </SettingsCard>

            {/* NEW: Opening Hours Section */}
            <SettingsCard
                title="Opening Hours"
                description="Set your weekly schedule. This will be visible to patients."
                footer={<button className="font-bold py-2 px-5 rounded-lg bg-primary text-primary-foreground">Save Schedule</button>}
            >
                <div className="space-y-2">
                    {days.map(day => (
                        <DayAvailability key={day} day={day} initialHours={data.openingHours[day]} />
                    ))}
                </div>
            </SettingsCard>
        </div>
    );
};
export default ShopProfileSettings;