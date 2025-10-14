import React from 'react';
import { motion } from 'framer-motion';
import { Stethoscope, Users, Clock, BarChart2, Settings } from 'lucide-react';

const HospitalCard = ({ hospital }) => {
    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <motion.div 
            variants={cardVariants}
            className="bg-card rounded-xl border border-border/70 shadow-md flex flex-col group overflow-hidden"
        >
            <div className="h-40 overflow-hidden">
                <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
            </div>
            <div className="p-5 flex flex-col flex-1">
                <h3 className="font-bold text-lg text-foreground">{hospital.name}</h3>
                <p className="text-sm text-muted-foreground">{hospital.location}</p>
                <div className="my-4 border-t border-border"></div>
                <div className="grid grid-cols-3 gap-4 text-center">
                    <div><Stethoscope className="mx-auto text-primary mb-1"/><p className="font-bold">{hospital.stats.doctors}</p><p className="text-xs text-muted-foreground">Doctors</p></div>
                    <div><Users className="mx-auto text-primary mb-1"/><p className="font-bold">{hospital.stats.patientsToday}</p><p className="text-xs text-muted-foreground">Patients Today</p></div>
                    <div><Clock className="mx-auto text-primary mb-1"/><p className="font-bold">{hospital.stats.avgWaitTime}</p><p className="text-xs text-muted-foreground">Avg. Wait</p></div>
                </div>
                <div className="mt-auto pt-5 flex gap-3">
                    <button className="flex-1 font-semibold py-2 px-3 text-sm rounded-lg border border-border hover:bg-muted">
                        <Settings size={14} className="inline mr-1.5"/> Manage
                    </button>
                    <button className="flex-1 font-semibold py-2 px-3 text-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20">
                        <BarChart2 size={14} className="inline mr-1.5"/> Analytics
                    </button>
                </div>
            </div>
        </motion.div>
    );
};
export default HospitalCard;