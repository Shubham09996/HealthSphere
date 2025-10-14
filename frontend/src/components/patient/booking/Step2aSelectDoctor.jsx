import React from 'react';
import { User, Users, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Step2aSelectDoctor = ({ onNext, details, onBack }) => (
    <div className="bg-card p-6 rounded-xl shadow-md">
        <ArrowLeft size={18} onClick={onBack} className="cursor-pointer text-muted-foreground mb-4"/>
        <h2 className="text-2xl font-bold text-foreground">Select a Doctor (Follow-up)</h2>
        <p className="text-muted-foreground mb-6">Choose a doctor from {details.department.name} or book with the first available.</p>
        <div className="space-y-3">
            <motion.div onClick={() => onNext({ doctor: null })}
                className="flex items-center gap-4 p-4 border-2 border-primary rounded-lg cursor-pointer hover:bg-muted bg-primary/10"
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                <Users className="text-primary" size={32} />
                <div>
                    <h3 className="font-semibold text-foreground">First Available Doctor</h3>
                    <p className="text-sm text-muted-foreground">Book the earliest available slot in the department.</p>
                </div>
            </motion.div>
            {details.department.doctors.map(doc => (
                 <motion.div key={doc.id} onClick={() => onNext({ doctor: doc })}
                    className="flex items-center gap-4 p-4 border border-border rounded-lg cursor-pointer hover:bg-muted"
                    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}>
                    <img src={doc.pfp} alt={doc.name} className="w-12 h-12 object-cover rounded-full"/>
                    <div>
                        <h3 className="font-semibold text-foreground">{doc.name}</h3>
                        <p className="text-sm text-muted-foreground">{doc.experience} years of experience</p>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
);
export default Step2aSelectDoctor;