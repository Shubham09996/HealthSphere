import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Trash2, Mic, FileJson } from 'lucide-react';
import { patientsData } from '../../../data/patientsData'; // Reuse patient data
import { medicinesList } from '../../../data/medicinesList';

const PrescriptionWriter = ({ isOpen, onClose, preselectedPatient }) => {
    const [medicines, setMedicines] = useState([{ name: '', strength: '', frequency: '', duration: '' }]);
    const [notes, setNotes] = useState('');
    const [selectedPatient, setSelectedPatient] = useState(preselectedPatient ? preselectedPatient.id : '');

    useEffect(() => {
        if (preselectedPatient) {
            setSelectedPatient(preselectedPatient.id);
        }
    }, [preselectedPatient]);

    const handleAddMedicine = () => {
        setMedicines([...medicines, { name: '', strength: '', frequency: '', duration: '' }]);
    };

    const handleRemoveMedicine = (index) => {
        const list = [...medicines];
        list.splice(index, 1);
        setMedicines(list);
    };

    const handleMedicineChange = (e, index) => {
        const { name, value } = e.target;
        const list = [...medicines];
        list[index][name] = value;
        setMedicines(list);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, y: 30 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.9, y: -30 }}
                    className="bg-card w-full max-w-4xl rounded-xl border border-border shadow-lg flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="p-4 flex justify-between items-center border-b border-border">
                        <h2 className="text-lg font-bold text-foreground">Create New Prescription</h2>
                        <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
                    </div>

                    {/* Body */}
                    <div className="p-6 flex-1 overflow-y-auto space-y-6">
                        {/* Patient Selection */}
                        <div>
                            <label className="text-sm font-medium">Select Patient</label>
                            {preselectedPatient ? (
                                <input
                                    type="text"
                                    value={`${preselectedPatient.name} (${preselectedPatient.id})`}
                                    className="mt-1 w-full bg-background border border-border rounded-md p-2 cursor-not-allowed text-muted-foreground"
                                    disabled
                                />
                            ) : (
                                <select 
                                    className="mt-1 w-full bg-background border border-border rounded-md p-2"
                                    value={selectedPatient}
                                    onChange={(e) => setSelectedPatient(e.target.value)}
                                >
                                    <option value="">Select a patient...</option>
                                    {patientsData.map(p => <option key={p.id} value={p.id}>{p.name} ({p.id})</option>)}
                                </select>
                            )}
                        </div>
                        
                        {/* Medicines List */}
                        <div className="space-y-4">
                             {medicines.map((med, i) => (
                                <div key={i} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                                    <input list="medicines" name="name" value={med.name} onChange={e => handleMedicineChange(e, i)} placeholder="Medicine Name" className="sm:col-span-4 bg-background border border-border rounded-md p-2" />
                                    <datalist id="medicines">
                                        {medicinesList.map(m => <option key={m.name} value={m.name} />)}
                                    </datalist>
                                    <input name="strength" value={med.strength} onChange={e => handleMedicineChange(e, i)} placeholder="Strength (e.g., 500mg)" className="sm:col-span-2 bg-background border border-border rounded-md p-2" />
                                    <input name="frequency" value={med.frequency} onChange={e => handleMedicineChange(e, i)} placeholder="Frequency (e.g., 1-0-1)" className="sm:col-span-2 bg-background border border-border rounded-md p-2" />
                                    <input name="duration" value={med.duration} onChange={e => handleMedicineChange(e, i)} placeholder="Duration (e.g., 5 days)" className="sm:col-span-3 bg-background border border-border rounded-md p-2" />
                                    <button onClick={() => handleRemoveMedicine(i)} className="sm:col-span-1 text-red-500 hover:bg-red-500/10 p-2 rounded-md"><Trash2 size={18}/></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={handleAddMedicine} className="flex items-center gap-2 text-sm font-semibold text-primary"><Plus size={16}/> Add Medicine</button>

                        {/* Notes */}
                        <div className="relative">
                            <label className="text-sm font-medium">Doctor's Notes</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows="3" placeholder="Add any special instructions..." className="mt-1 w-full bg-background border border-border rounded-md p-2 pr-10"></textarea>
                            <Mic size={16} className="absolute right-3 top-9 text-muted-foreground cursor-pointer"/>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 flex flex-col sm:flex-row gap-3 border-t border-border bg-muted/50 rounded-b-xl">
                        <button className="flex-1 flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg border border-border text-foreground hover:bg-muted">
                            <FileJson size={16}/> Preview
                        </button>
                        <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-lg bg-primary text-primary-foreground hover:opacity-90">
                           Issue Prescription
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default PrescriptionWriter;