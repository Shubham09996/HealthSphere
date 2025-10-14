import React from 'react';
import { motion } from 'framer-motion';

const SettingsCard = ({ title, description, children, footer }) => (
    <motion.div 
        className="bg-card border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
    >
        <div className="p-6 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="p-6 space-y-4">{children}</div>
        <div className="p-4 bg-muted/50 rounded-b-xl text-right">
            {footer}
        </div>
    </motion.div>
);

const DoctorProfileSettings = () => {
    return (
        <SettingsCard
            title="Professional Profile"
            description="This information will be visible to patients."
            // === IS BUTTON PAR GRADIENT LAGAYA HAI ===
            footer={
                <button className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity">
                    Save Changes
                </button>
            }
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input type="text" defaultValue="Dr. Anjali Sharma" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                </div>
                <div>
                    <label className="text-sm font-medium">Specialty</label>
                    <input type="text" defaultValue="Cardiology" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                </div>
                <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Qualifications</label>
                    <input type="text" defaultValue="MBBS, MD (Cardiology)" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                </div>
                 <div>
                    <label className="text-sm font-medium">Medical Registration Number</label>
                    <input type="text" defaultValue="MCI-12345" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                </div>
                 <div>
                    <label className="text-sm font-medium">Years of Experience</label>
                    <input type="number" defaultValue="15" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                </div>
            </div>
        </SettingsCard>
    );
};

export default DoctorProfileSettings;