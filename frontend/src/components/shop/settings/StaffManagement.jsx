import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { shopSettingsData } from '../../../data/shopSettingsData';
import AddStaffModal from './AddStaffModal'; // NEW: Import the modal

const StaffManagement = () => {
    const [staff, setStaff] = useState(shopSettingsData.staff);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openMenuId, setOpenMenuId] = useState(null);
    const menuRef = useRef(null);

    const handleAddStaff = (newStaffData) => {
        const newStaff = {
            id: `stf-${String(staff.length + 1).padStart(2, '0')}`,
            ...newStaffData,
        };
        setStaff(prevStaff => [newStaff, ...prevStaff]);
        setIsModalOpen(false);
    };

    const handleRemoveStaff = (idToRemove) => {
        setStaff(prevStaff => prevStaff.filter(member => member.id !== idToRemove));
        setOpenMenuId(null);
    };

    // Logic to close the dropdown menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <>
            <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                    <h3 className="font-bold text-lg text-foreground">Staff Management</h3>
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white text-sm"
                    >
                        <Plus size={16}/> Add Staff Member
                    </button>
                </div>
                <div className="space-y-3">
                    {staff.map(member => (
                        <div key={member.id} className="flex items-center justify-between bg-muted p-3 rounded-lg">
                            <div className="flex items-center gap-3">
                                <img src={member.pfp} alt={member.name} className="w-10 h-10 rounded-full"/>
                                <div>
                                    <p className="font-semibold text-foreground text-sm">{member.name}</p>
                                    <p className="text-xs text-muted-foreground">{member.role}</p>
                                </div>
                            </div>
                            <div className="relative" ref={menuRef}>
                                <button onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)} className="p-1 hover:bg-border rounded-full text-muted-foreground">
                                    <MoreHorizontal size={18}/>
                                </button>
                                <AnimatePresence>
                                {openMenuId === member.id && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="absolute right-0 mt-2 w-36 bg-card border border-border rounded-md shadow-lg z-20"
                                    >
                                        <div className="p-1">
                                            <button className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded hover:bg-muted"><Edit size={14}/> Edit</button>
                                            <button onClick={() => handleRemoveStaff(member.id)} className="flex items-center gap-2 w-full text-left px-3 py-1.5 text-sm rounded text-red-500 hover:bg-muted"><Trash2 size={14}/> Remove</button>
                                        </div>
                                    </motion.div>
                                )}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <AnimatePresence>
                {isModalOpen && (
                    <AddStaffModal 
                        isOpen={isModalOpen}
                        onClose={() => setIsModalOpen(false)}
                        onAddStaff={handleAddStaff}
                    />
                )}
            </AnimatePresence>
        </>
    );
};
export default StaffManagement;