import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Pill, Video } from 'lucide-react';

const PatientQueueCard = ({ patient, isActive = false }) => {
    return (
        <motion.div 
            className={`p-4 rounded-xl border ${isActive ? 'bg-primary/10 border-primary' : 'bg-muted border-transparent'}`}
            layout
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <img src={patient.patient.pfp} alt={patient.patient.name} className="w-14 h-14 rounded-full"/>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <p className="font-bold text-foreground">{patient.patient.name}, {patient.patient.age}</p>
                        <span className="font-mono text-xs px-2 py-0.5 bg-card rounded-md">{patient.token}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{patient.reason}</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                     <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg border border-border hover:bg-border">
                        <FileText size={14}/> History
                    </button>
                     <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm font-semibold py-2 px-3 rounded-lg border border-border hover:bg-border">
                        <Pill size={14}/> Prescribe
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default PatientQueueCard;