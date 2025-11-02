import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';

const CancelConfirmModal = ({ appointment, onConfirm, onClose, isCancelling }) => {
    const [showFinalConfirmation, setShowFinalConfirmation] = useState(false);

    const handleYesCancelClick = () => {
        setShowFinalConfirmation(true);
    };

    const handleOkClick = () => {
        onConfirm();
    };

    const handleBack = () => {
        setShowFinalConfirmation(false);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.9 }}
                    className="bg-card w-full max-w-md rounded-xl border border-border shadow-xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <AnimatePresence mode="wait">
                        {!showFinalConfirmation ? (
                            // First confirmation step
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="p-6 text-center">
                                    <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-red-100 dark:bg-red-900/30">
                                        <AlertTriangle size={24} className="text-red-600 dark:text-red-400" />
                                    </div>
                                    <h3 className="text-lg font-bold mt-4 text-foreground">Cancel Appointment?</h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        Are you sure you want to cancel your appointment with{' '}
                                        <strong className="text-foreground">Dr. {appointment?.doctor}</strong> on{' '}
                                        <strong className="text-foreground">{appointment?.date}</strong> at{' '}
                                        <strong className="text-foreground">{appointment?.time}</strong>?
                                    </p>
                                    <p className="text-xs text-red-500 mt-3 font-semibold">
                                        This action cannot be undone.
                                    </p>
                                </div>
                                <div className="p-4 flex gap-3 border-t border-border bg-muted/50 rounded-b-xl">
                                    <button
                                        onClick={onClose}
                                        disabled={isCancelling}
                                        className="flex-1 font-semibold py-2 px-4 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
                                    >
                                        Keep Appointment
                                    </button>
                                    <button
                                        onClick={handleYesCancelClick}
                                        disabled={isCancelling}
                                        className="flex-1 font-bold py-2 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Yes, Cancel
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            // Second confirmation step (Final Alert)
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="p-6 text-center">
                                    <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/30">
                                        <Info size={24} className="text-orange-600 dark:text-orange-400" />
                                    </div>
                                    <h3 className="text-lg font-bold mt-4 text-foreground">Final Confirmation</h3>
                                    <p className="text-sm text-muted-foreground mt-2">
                                        <strong className="text-foreground">This action will cancel your appointment</strong> with{' '}
                                        <strong className="text-foreground">Dr. {appointment?.doctor}</strong> on{' '}
                                        <strong className="text-foreground">{appointment?.date}</strong> at{' '}
                                        <strong className="text-foreground">{appointment?.time}</strong>.
                                    </p>
                                    <p className="text-xs text-red-500 mt-3 font-semibold">
                                        The appointment will be removed from both your profile and the doctor's schedule.
                                    </p>
                                </div>
                                <div className="p-4 flex gap-3 border-t border-border bg-muted/50 rounded-b-xl">
                                    <button
                                        onClick={handleBack}
                                        disabled={isCancelling}
                                        className="flex-1 font-semibold py-2 px-4 rounded-lg border border-border hover:bg-muted transition-colors disabled:opacity-50"
                                    >
                                        Back
                                    </button>
                                    <button
                                        onClick={handleOkClick}
                                        disabled={isCancelling}
                                        className="flex-1 font-bold py-2 px-4 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isCancelling ? 'Cancelling...' : 'OK'}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CancelConfirmModal;

