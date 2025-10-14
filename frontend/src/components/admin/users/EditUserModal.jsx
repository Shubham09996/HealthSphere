import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const EditUserModal = ({ user, onSave, onClose }) => {
    const [formData, setFormData] = useState(user);
    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    return (
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div initial={{scale:0.9}} animate={{scale:1}} exit={{scale:0.9}} className="bg-card w-full max-w-lg rounded-xl border" onClick={e=>e.stopPropagation()}>
                <div className="p-4 flex justify-between items-center border-b"><h2 className="text-lg font-bold">Edit User: {user.name}</h2><button onClick={onClose} className="p-1 rounded-full hover:bg-muted"><X size={20}/></button></div>
                <div className="p-6 space-y-4">
                    <div><label className="text-sm font-medium">Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full bg-background border border-border p-2 rounded-md"/></div>
                    <div><label className="text-sm font-medium">Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full bg-background border border-border p-2 rounded-md"/></div>
                </div>
                <div className="p-4 flex justify-end gap-3 border-t bg-muted/50 rounded-b-xl">
                    <button onClick={onClose} className="font-semibold py-2 px-4 rounded-lg border border-border hover:bg-border">Cancel</button>
                    {/* UPDATED: Gradient on primary button */}
                    <button onClick={() => onSave(formData)} className="font-bold py-2 px-5 rounded-lg bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white">Save Changes</button>
                </div>
            </motion.div>
        </motion.div>
    );
};
export default EditUserModal;