import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, User } from 'lucide-react';

const AddStaffModal = ({ isOpen, onClose, onAddStaff }) => {
    const [formData, setFormData] = useState({ name: '', role: 'Pharmacist', email: '', phone: '' });
    const [avatarPreview, setAvatarPreview] = useState(null);
    const avatarInputRef = useRef(null);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) setAvatarPreview(URL.createObjectURL(file));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.role) return;
        const pfp = avatarPreview || `https://avatar.iran.liara.run/public/${formData.name.split(' ')[0]}`;
        onAddStaff({ ...formData, pfp });
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                className="bg-card w-full max-w-lg rounded-xl border border-border shadow-lg flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-4 flex justify-between items-center border-b border-border">
                    <h2 className="text-lg font-bold text-foreground">Add New Staff Member</h2>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-muted"><X size={20}/></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group w-24 h-24">
                            <img src={avatarPreview || 'https://avatar.iran.liara.run/public'} alt="Avatar" className="w-full h-full rounded-full object-cover border-2 border-border"/>
                            <button type="button" onClick={() => avatarInputRef.current.click()} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload size={24} className="text-white"/>
                            </button>
                            <input type="file" ref={avatarInputRef} className="hidden" accept="image/*" onChange={handleAvatarChange}/>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium">Full Name*</label><input type="text" name="name" onChange={handleChange} required className="mt-1 w-full bg-background border border-border rounded-md p-2"/></div>
                        <div><label className="text-sm font-medium">Role*</label>
                            <select name="role" onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2">
                                <option>Pharmacist</option><option>Cashier</option><option>Manager</option>
                            </select>
                        </div>
                        <div><label className="text-sm font-medium">Email Address</label><input type="email" name="email" onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2"/></div>
                        <div><label className="text-sm font-medium">Phone Number</label><input type="tel" name="phone" onChange={handleChange} className="mt-1 w-full bg-background border border-border rounded-md p-2"/></div>
                    </div>
                </form>

                <div className="p-4 flex flex-col sm:flex-row-reverse gap-3 border-t border-border bg-muted/50 rounded-b-xl">
                    <button type="submit" onClick={handleSubmit} className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white">
                        Save Staff Member
                    </button>
                    <button type="button" onClick={onClose} className="font-semibold py-2 px-5 rounded-lg border border-border hover:bg-border">
                        Cancel
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default AddStaffModal;