import React from 'react';
import { ArrowLeft, User, Building, Hospital, Calendar, Clock } from 'lucide-react';

const Step4Confirmation = ({ onNext, details, onBack }) => {
    const { hospital, department, doctor, date, time } = details;
    return (
        <div className="bg-card p-6 rounded-xl shadow-md">
            <ArrowLeft size={18} onClick={onBack} className="cursor-pointer text-muted-foreground mb-4"/>
            <h2 className="text-2xl font-bold text-foreground">Confirm Your Appointment</h2>
             <div className="bg-muted p-6 rounded-lg space-y-4 text-foreground border border-border my-6">
                <div className="flex items-center gap-3"><Hospital size={20}/><span className="font-bold text-lg">{hospital.name}</span></div>
                <div className="flex items-center gap-3"><Building size={20}/><span className="text-muted-foreground">{department.name}</span></div>
                <div className="flex items-center gap-3"><User size={20}/><span className="text-muted-foreground">{doctor ? doctor.name : 'First Available Doctor'}</span></div>
                <div className="border-t border-border/50 my-2"></div>
                <div className="flex items-center gap-3"><Calendar size={20}/><span className="font-bold">{new Date(date).toDateString()}</span></div>
                <div className="flex items-center gap-3"><Clock size={20}/><span className="font-bold">{time}</span></div>
            </div>
            <button onClick={() => onNext({ token: `HS-${Math.random().toString(36).substr(2, 6).toUpperCase()}` })} className="w-full mt-6 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-3 px-4 rounded-lg hover:opacity-90">
                Confirm & Get Token
            </button>
        </div>
    );
};
export default Step4Confirmation;