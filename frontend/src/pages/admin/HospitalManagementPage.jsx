import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { hospitalsData as initialHospitals } from '../../data/hospitalsData';
import { Plus, Search, Building } from 'lucide-react';
import HospitalCard from '../../components/admin/hospitals/HospitalCard';
import AddHospitalModal from '../../components/admin/hospitals/AddHospitalModal';

const HospitalManagementPage = () => {
    const [hospitals, setHospitals] = useState(initialHospitals);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const filteredHospitals = useMemo(() => {
        return hospitals.filter(h =>
            h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            h.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [hospitals, searchTerm]);

    const handleAddHospital = (newHospitalData) => {
        const newHospital = {
            id: `HOSP-${String(hospitals.length + 1).padStart(2, '0')}`,
            ...newHospitalData,
            stats: { doctors: 0, patientsToday: 0, avgWaitTime: 'N/A' } // Default stats
        };
        setHospitals(prev => [newHospital, ...prev]);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                        Hospital Management
                    </h1>
                    <p className="text-muted-foreground mt-1">Oversee and manage all partner hospitals.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white"
                >
                    <Plus size={18}/> Add New Hospital
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                <input type="text" placeholder="Search by name or location..." onChange={e => setSearchTerm(e.target.value)} className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2 text-sm"/>
            </div>

            <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                initial="hidden"
                animate="visible"
            >
                {filteredHospitals.map(hospital => (
                    <HospitalCard key={hospital.id} hospital={hospital} />
                ))}
            </motion.div>
            
            <AnimatePresence>
                {isModalOpen && <AddHospitalModal onClose={() => setIsModalOpen(false)} onAddHospital={handleAddHospital} />}
            </AnimatePresence>
        </div>
    );
};
export default HospitalManagementPage;