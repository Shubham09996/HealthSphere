import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Search, Trash2, UserX } from 'lucide-react';
import { usersData as initialUsers } from '../../data/usersData';
import UserList from '../../components/admin/users/UserList';
import Pagination from '../../components/admin/users/Pagination';
import EditUserModal from '../../components/admin/users/EditUserModal';
import ConfirmationModal from '../../components/admin/users/ConfirmationModal';

const filterOptions = ['All', 'Patient', 'Doctor', 'Shop', 'Donor'];

const UserManagementPage = () => {
    const [users, setUsers] = useState(initialUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    
    const [editingUser, setEditingUser] = useState(null);
    const [confirmAction, setConfirmAction] = useState(null);

    const filteredUsers = useMemo(() => {
        return users
            .filter(u => activeFilter === 'All' || u.role === activeFilter)
            .filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.id.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [users, searchTerm, activeFilter]);

    const usersPerPage = 10;
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

    const handleEditUser = (updatedUser) => {
        setUsers(users.map(u => u.id === updatedUser.id ? updatedUser : u));
        setEditingUser(null);
    };

    const handleActionConfirm = () => {
        if (!confirmAction) return;
        const { type, payload } = confirmAction;

        if (type === 'delete') {
            setUsers(users.filter(u => !payload.includes(u.id)));
        } else if (type === 'suspend') {
            setUsers(users.map(u => payload.includes(u.id) ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
        }
        
        setSelectedUsers([]);
        setConfirmAction(null);
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div>
                {/* UPDATED: Gradient color on heading */}
                <h1 className="text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    User Management
                </h1>
                <p className="text-muted-foreground mt-1">Monitor, manage, and take actions on all platform users.</p>
            </div>

            <div className="bg-card p-4 rounded-xl border border-border/70 shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="relative flex-1 sm:max-w-xs"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} /><input type="text" placeholder="Search users..." onChange={e => setSearchTerm(e.target.value)} className="w-full bg-background border border-border rounded-lg pl-10 pr-4 py-2 text-sm"/></div>
                    <div className="flex items-center gap-2 p-1 bg-muted rounded-full">
                        {filterOptions.map(f => (
                             <button key={f} onClick={() => setActiveFilter(f)} className={`relative px-3 py-1 text-sm font-semibold rounded-full ${activeFilter === f ? '' : 'text-muted-foreground'}`}>
                                {activeFilter === f && <motion.div layoutId="user-filter" className="absolute inset-0 bg-background rounded-full shadow-sm" />}
                                <span className="relative z-10">{f}</span>
                            </button>
                        ))}
                    </div>
                </div>
                <AnimatePresence>
                {selectedUsers.length > 0 && (
                    <motion.div initial={{height:0, opacity:0}} animate={{height:'auto', opacity:1}} exit={{height:0, opacity:0}} className="mt-4 p-2 bg-primary/10 rounded-lg flex items-center justify-between">
                         <p className="text-sm font-semibold">{selectedUsers.length} user(s) selected</p>
                         <div className="flex gap-2">
                            <button onClick={() => setConfirmAction({type: 'suspend', payload: selectedUsers})} className="flex items-center gap-1.5 text-sm text-orange-500 font-semibold p-2 hover:bg-orange-500/10 rounded-md"><UserX size={14}/> Suspend</button>
                            <button onClick={() => setConfirmAction({type: 'delete', payload: selectedUsers})} className="flex items-center gap-1.5 text-sm text-red-500 font-semibold p-2 hover:bg-red-500/10 rounded-md"><Trash2 size={14}/> Delete</button>
                         </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>

            <div className="flex-1 overflow-hidden">
                <UserList users={currentUsers} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} onEdit={setEditingUser} onSuspend={id => setConfirmAction({type: 'suspend', payload: [id]})} onDelete={id => setConfirmAction({type: 'delete', payload: [id]})}/>
            </div>
            
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            
            <AnimatePresence>
                {editingUser && <EditUserModal user={editingUser} onSave={handleEditUser} onClose={() => setEditingUser(null)} />}
                {confirmAction && <ConfirmationModal onConfirm={handleActionConfirm} onClose={() => setConfirmAction(null)} action={confirmAction.type} count={confirmAction.payload.length} />}
            </AnimatePresence>
        </div>
    );
};
export default UserManagementPage;