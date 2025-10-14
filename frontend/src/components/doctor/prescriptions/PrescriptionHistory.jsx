import React from 'react';
import { Search } from 'lucide-react';
import { doctorPrescriptionsData } from '../../../data/doctorPrescriptionsData';
import { motion } from 'framer-motion';

const PrescriptionHistory = () => {
    return (
        <motion.div
            className="bg-card p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
        >
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <h3 className="font-bold text-lg text-foreground">Issued Prescriptions</h3>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                    <input type="text" placeholder="Search by patient..." className="w-full sm:w-64 bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm" />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="text-xs text-muted-foreground bg-muted/50">
                        <tr>
                            <th className="p-3">Prescription ID</th>
                            <th className="p-3">Patient Name</th>
                            <th className="p-3">Date Issued</th>
                            <th className="p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {doctorPrescriptionsData.map(rx => (
                            <tr key={rx.id} className="border-b border-border hover:bg-muted cursor-pointer">
                                {/* === IS ID PAR GRADIENT LAGAYA HAI === */}
                                <td className="p-3 font-mono text-sm bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                                    {rx.id}
                                </td>
                                <td className="p-3 font-semibold text-foreground">{rx.patientName}</td>
                                <td className="p-3 text-muted-foreground">{rx.date}</td>
                                <td className="p-3">
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-green-100 text-green-800">{rx.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default PrescriptionHistory;