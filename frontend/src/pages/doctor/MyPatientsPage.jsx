import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search } from 'lucide-react';
import { patientsData as initialPatients } from '../../data/patientsData';
import PatientListTable from '../../components/doctor/patients/PatientListTable';
import PatientDetailDrawer from '../../components/doctor/patients/PatientDetailDrawer';
import AddPatientModal from '../../components/doctor/patients/AddPatientModal';
import { useLocation } from 'react-router-dom';

const filterOptions = ['All', 'New', 'Active', 'Needs Follow-up'];

const MyPatientsPage = () => {
    const [patients, setPatients] = useState(initialPatients);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatientId, setSelectedPatientId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const idFromUrl = queryParams.get('patientId');
        if (idFromUrl) {
            setSelectedPatientId(idFromUrl);
        }
    }, [location.search]);

    const filteredPatients = useMemo(() => {
        return patients
            .filter(p => {
                if (activeFilter === 'All') return true;
                return p.status === activeFilter;
            })
            .filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    }, [searchTerm, patients, activeFilter]);

    const selectedPatient = useMemo(() => {
        return patients.find(p => p.id === selectedPatientId);
    }, [selectedPatientId, patients]);

    const handleAddPatient = (newPatientData) => {
        const newPatient = {
            id: `PID-${Math.floor(100000 + Math.random() * 900000)}`,
            name: newPatientData.name,
            pfp: `https://avatar.iran.liara.run/public/${newPatientData.gender === 'Male' ? 'boy' : 'girl'}?username=${newPatientData.name.split(' ')[0]}`,
            age: new Date().getFullYear() - new Date(newPatientData.dob).getFullYear(),
            gender: newPatientData.gender,
            lastVisit: new Date().toISOString().split('T')[0],
            status: newPatientData.status,
            contact: { phone: newPatientData.phone, email: newPatientData.email },
            criticalInfo: { 
                allergies: newPatientData.allergies ? newPatientData.allergies.split(',').map(a => a.trim()) : ['None'], 
                chronicConditions: newPatientData.chronicConditions ? newPatientData.chronicConditions.split(',').map(c => c.trim()) : ['None'],
            },
            recentVitals: { 
                bloodPressure: newPatientData.bloodPressure || 'N/A',
                bloodSugar: newPatientData.bloodSugar || 'N/A',
            },
            recentActivity: [
                { date: new Date().toISOString().split('T')[0], title: 'Patient Registered' }
            ]
        };
        setPatients(prevPatients => [newPatient, ...prevPatients]);
        setIsModalOpen(false);
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">My Patients</h1>
                    <p className="text-muted-foreground mt-1">Search, view, and manage your patient records.</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                >
                    <UserPlus size={18}/> Add New Patient
                </button>
            </div>

            {/* Search and Filters */}
            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
                    <input
                        type="text"
                        placeholder="Search by patient name or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5"
                    />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {filterOptions.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`relative px-3 py-1.5 text-sm font-semibold rounded-full transition-colors ${
                                activeFilter !== filter && 'text-muted-foreground hover:bg-muted'
                            }`}
                        >
                            {activeFilter === filter && (
                                <motion.div layoutId="patient-filter-indicator" className="absolute inset-0 bg-hs-gradient-start/10 rounded-full" />
                            )}
                            {/* === GRADIENT KO DIRECT TEXT WALE SPAN PAR LAGAYA HAI === */}
                            <span className={`relative z-10 ${
                                activeFilter === filter ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-transparent bg-clip-text' : ''
                            }`}>
                                {filter}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Patient List */}
            <div className="flex-1 overflow-hidden">
                <PatientListTable patients={filteredPatients} onPatientSelect={setSelectedPatientId} />
            </div>
            
            <AnimatePresence>
                {selectedPatient && (
                    <PatientDetailDrawer patient={selectedPatient} onClose={() => setSelectedPatientId(null)} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isModalOpen && (
                    <AddPatientModal 
                        isOpen={isModalOpen} 
                        onClose={() => setIsModalOpen(false)} 
                        onAddPatient={handleAddPatient} 
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default MyPatientsPage;