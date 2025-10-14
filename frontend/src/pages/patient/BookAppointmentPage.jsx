import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { hospitalData } from '../../data/doctorsData';

// Import New and Redesigned Step Components
import BookingStepper from '../../components/patient/booking/BookingStepper';
import Step1SelectHospital from '../../components/patient/booking/Step1SelectHospital';
import Step2SelectDepartment from '../../components/patient/booking/Step2SelectDepartment';
import Step2aSelectDoctor from '../../components/patient/booking/Step2aSelectDoctor';
import Step3SelectDateAndSlot from '../../components/patient/booking/Step3SelectDateAndSlot';
import Step4Confirmation from '../../components/patient/booking/Step4Confirmation';
import Step5Success from '../../components/patient/booking/Step5Success';

const steps = ["Hospital", "Department", "Date & Slot", "Confirm"];

const BookAppointmentPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isFollowUp, setIsFollowUp] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({
        hospital: null, department: null, doctor: null,
        date: null, time: null, token: null,
    });

    const variants = {
        enter: { opacity: 0, x: 30 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
    };

    const handleNextStep = (data) => {
        setBookingDetails(prev => ({ ...prev, ...data }));
        if (currentStep === 2 && isFollowUp) {
            setCurrentStep(2.5);
        } else if (currentStep === 2.5) {
            setCurrentStep(3);
        } else {
             setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevStep = () => {
        if (currentStep === 5) return; // Can't go back from success screen
        if (currentStep === 3 && isFollowUp) setCurrentStep(2.5);
        else if (currentStep === 2.5) setCurrentStep(2);
        else if (currentStep > 1) setCurrentStep(Math.floor(currentStep - 1));
    };
    
    const startOver = () => {
        setCurrentStep(1);
        setIsFollowUp(false);
        setBookingDetails({ hospital: null, department: null, doctor: null, date: null, time: null, token: null });
    };

    const progressStep = currentStep === 2.5 ? 1.5 : Math.floor(currentStep);

    // If booking is successful, show a full-page success message
    if (currentStep === 5) {
        return (
             <motion.div key={5} variants={variants} initial="enter" animate="center" transition={{ duration: 0.5 }}>
                <Step5Success details={bookingDetails} onDone={startOver} />
             </motion.div>
        );
    }
    
    return (
        <div className="flex flex-col gap-8 md:gap-12 min-h-[70vh]">
            {/* Left Column: Stepper */}
            <div className="w-full">
                <BookingStepper steps={steps} currentStep={progressStep} isFollowUp={isFollowUp} />
            </div>

            {/* Right Column: Step Content */}
            <div className="flex-1">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, type: 'tween' }}
                    >
                        {currentStep === 1 && <Step1SelectHospital onNext={handleNextStep} data={hospitalData} isFollowUp={isFollowUp} setIsFollowUp={setIsFollowUp} />}
                        {currentStep === 2 && <Step2SelectDepartment onNext={handleNextStep} details={bookingDetails} onBack={handlePrevStep} />}
                        {currentStep === 2.5 && <Step2aSelectDoctor onNext={handleNextStep} details={bookingDetails} onBack={handlePrevStep} />}
                        {currentStep === 3 && <Step3SelectDateAndSlot onNext={handleNextStep} details={bookingDetails} onBack={handlePrevStep} />}
                        {currentStep === 4 && <Step4Confirmation onNext={handleNextStep} details={bookingDetails} onBack={handlePrevStep} />}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BookAppointmentPage;