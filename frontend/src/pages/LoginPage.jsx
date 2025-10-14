import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Stethoscope, Pill, Bot, User, Briefcase, Heart, Shield, Eye, EyeOff, Mail, Lock, Ambulance, Building, CheckCircle, Hospital, Syringe, ClipboardList 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

// Data for dynamic content based on selected role
const roleData = {
    patient: {
        icon: User,
        welcome: "Access your Health Profile",
        subtext: "Book appointments, view prescriptions, and track your health journey.",
        features: [
            { icon: Stethoscope, title: "Smart Token System", desc: "Real-time queue tracking with wait time estimates." },
            { icon: Pill, title: "E-Prescriptions", desc: "Digital prescriptions with automatic verification." },
            { icon: Bot, title: "AI Assistant", desc: "24/7 health support and appointment booking." }
        ]
    },
    doctor: {
        icon: Stethoscope,
        welcome: "Manage your Practice",
        subtext: "Streamline patient consultations, manage schedules, and issue e-prescriptions.",
        features: [
            { icon: ClipboardList, title: "Appointment Dashboard", desc: "View and manage all your patient appointments in one place." },
            { icon: CheckCircle, title: "Digital Verification", desc: "Securely sign and verify prescriptions and reports digitally." },
            { icon: Hospital, title: "Patient Records", desc: "Access comprehensive and secure patient health records." }
        ]
    },
    shop: {
        icon: Building,
        welcome: "Pharmacy Portal",
        subtext: "Verify prescriptions, manage inventory, and fulfill patient orders.",
        features: [
            { icon: Pill, title: "Prescription Verification", desc: "Instantly verify the authenticity of e-prescriptions." },
            { icon: Briefcase, title: "Order Management", desc: "Receive and manage orders from patients seamlessly." },
            { icon: CheckCircle, title: "Inventory Sync", desc: "Keep your stock updated with our smart inventory system." }
        ]
    },
    donor: {
        icon: Heart,
        welcome: "Be a Lifesaver",
        subtext: "Find blood donation camps, track your donations, and help save lives.",
        features: [
            { icon: Ambulance, title: "Find Camps", desc: "Easily locate nearby blood donation drives and events." },
            { icon: Heart, title: "Donation History", desc: "Keep a record of your donations and see your impact." },
            { icon: Syringe, title: "Eligibility Check", desc: "Quickly check if you are eligible for donation." }
        ]
    },
    admin: {
        icon: Shield,
        welcome: "Administrator Control",
        subtext: "Oversee the entire platform, manage users, and view analytics.",
        features: [
            { icon: Briefcase, title: "User Management", desc: "Onboard, manage, and monitor all user roles." },
            { icon: CheckCircle, title: "Verification Pipeline", desc: "Approve or reject doctor and pharmacy applications." },
            { icon: Bot, title: "System Analytics", desc: "View platform usage statistics and generate reports." }
        ]
    }
};

const LoginPage = () => {
    const [role, setRole] = useState('patient');
    const [showPassword, setShowPassword] = useState(false);
    const selectedRoleData = roleData[role];
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1, 
            transition: { staggerChildren: 0.1, duration: 0.5 } 
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    return (
        <motion.div
            // FIX: Adjusted padding to remove gap below navbar
            className="min-h-screen flex flex-col items-center justify-start bg-background px-4 pt-24 pb-10 sm:px-6 lg:px-8 font-sans overflow-y-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
            {/* FIX: Removed flex-grow to stop vertical centering */}
            <div className="flex flex-col xl:flex-row items-stretch justify-center max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl w-full gap-4 sm:gap-8">
                {/* Left Promotional Panel - Dynamic */}
                <motion.div
                    className="w-full xl:w-1/2 p-6 md:p-8 bg-card rounded-2xl shadow-xl border border-border flex flex-col justify-center flex-shrink-0"
                    variants={itemVariants}
                >
                    <div className="flex items-center space-x-2 mb-6">
                        <div className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end p-2 rounded-md">
                            <span className="text-primary-foreground font-bold text-lg">H</span>
                        </div>
                        <span className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">HealthSphere</span>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={role}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">{selectedRoleData.welcome}</h2>
                            <p className="text-base sm:text-lg text-muted-foreground mb-6">{selectedRoleData.subtext}</p>
                            <div className="space-y-5">
                                {selectedRoleData.features.map((feature, index) => (
                                    <div key={index} className="flex items-start space-x-4">
                                        <feature.icon size={24} className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-foreground">{feature.title}</h3>
                                            <p className="text-muted-foreground text-sm">{feature.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </motion.div>

                {/* Right Login Form */}
                <motion.div
                    className="w-full xl:w-1/2 p-6 md:p-8 bg-card rounded-2xl shadow-xl border border-border flex flex-col justify-start space-y-5 flex-shrink-0"
                    variants={itemVariants}
                >
                    <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Sign In</h2>
                    <p className="text-muted-foreground text-sm sm:text-base">Choose your role and sign in to continue</p>

                    {/* Role Selection */}
                    <div className="relative flex flex-wrap justify-center sm:justify-start gap-x-3 sm:gap-x-4 gap-y-2 border-b border-border pb-2">
                        {Object.keys(roleData).map((r) => {
                            const RoleIcon = roleData[r].icon;
                            return (
                                <motion.button
                                    key={r}
                                    className={`relative px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2 ${role === r ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                                    onClick={() => setRole(r)}
                                >
                                    <RoleIcon size={16} />
                                    {r.charAt(0).toUpperCase() + r.slice(1)}
                                    {role === r && (
                                        <motion.div
                                            className="absolute bottom-[-9px] left-0 right-0 h-0.5 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end"
                                            layoutId="underline"
                                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                                        />
                                    )}
                                </motion.button>
                            )
                        })}
                    </div>
                    
                    {/* Form Inputs */}
                    <div className="relative group">
                        <label htmlFor="email" className="sr-only">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="your.email@example.com"
                            className="w-full p-3 pl-10 pr-10 border border-border rounded-md bg-transparent text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle text-sm sm:text-base"
                        />
                        <Mail size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors" />
                    </div>
                    <div className="relative group">
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter your password"
                            className="w-full p-3 pl-10 pr-10 border border-border rounded-md bg-transparent text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle text-sm sm:text-base"
                        />
                        <Lock size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-hs-gradient-middle transition-colors" />
                        <motion.button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                            whileHover={{ scale: 1.1 }}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </motion.button>
                    </div>

                    <div className="flex justify-between items-center text-xs sm:text-sm">
                        <label className="flex items-center space-x-2 text-muted-foreground cursor-pointer">
                            <input type="checkbox" className="form-checkbox rounded text-hs-gradient-middle focus:ring-hs-gradient-middle border-border" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="font-medium bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    <motion.button
                        className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Sign In
                    </motion.button>

                    {/* Dummy Login Buttons for Patient and Doctor */}
                    <div className="flex flex-col space-y-3">
                        <motion.button
                            className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/patient/dashboard')}
                        >
                            Patient Login
                        </motion.button>
                        <motion.button
                            className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/doctor/dashboard')}
                        >
                            Doctor Login
                        </motion.button>
                        {/* NEW: Shop Login Button */}
                        <motion.button
                            className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/shop/dashboard')}
                        >
                            Shop Login
                        </motion.button>
                        {/* NEW: Admin Login Button */}
                        <motion.button
                            className="w-full bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground py-3 rounded-md font-semibold hover:opacity-90 transition-opacity"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => navigate('/admin/dashboard')}
                        >
                            Admin Login
                        </motion.button>
                    </div>
                    
                    <p className="text-center text-muted-foreground text-xs sm:text-sm">
                        Don't have an account? 
                        <Link to="/signup" className="font-medium bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text hover:underline ml-1">
                            Sign up
                        </Link>
                    </p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default LoginPage;

