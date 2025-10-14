import React from 'react';
import { motion } from 'framer-motion';

// Reusable Card Component
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

const SecuritySettings = () => {
    return (
         <SettingsCard
            title="Change Password"
            description="For your security, we recommend choosing a strong password that you don't use elsewhere."
            footer={<button className="font-bold py-2 px-5 rounded-lg bg-primary text-primary-foreground">Update Password</button>}
        >
            <div>
                <label className="text-sm font-medium">Current Password</label>
                <input type="password" placeholder="••••••••" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium">New Password</label>
                    <input type="password" placeholder="••••••••" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                </div>
                 <div>
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <input type="password" placeholder="••••••••" className="mt-1 w-full bg-background border border-border rounded-md p-2"/>
                </div>
            </div>
        </SettingsCard>
    );
};

export default SecuritySettings;