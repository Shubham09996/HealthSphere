import React, { useState, useEffect } from 'react';
import { Calendar, Syringe, MapPin, Clock, Info, CheckCircle, ArrowLeft, FlaskConical, ArrowRight, Hospital } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api'; // Import api for fetching hospitals
import { useAuth } from '../../context/AuthContext'; // NEW: Import useAuth

// Import Step1SelectHospital component
import Step1SelectHospital from '../../components/patient/booking/Step1SelectHospital';
import Step3SelectDateAndSlot from '../../components/patient/booking/Step3SelectDateAndSlot'; // NEW: Import Step3SelectDateAndSlot

// Removed dummy data for tests, locations, and times

const steps = ["Select Lab", "Select Test", "Date & Slot", "Confirm"]; // Updated steps for test booking

const BookTestAppointmentPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // NEW: Get user from AuthContext
    const [currentStep, setCurrentStep] = useState(1);
    const [bookingDetails, setBookingDetails] = useState({
        lab: null, test: null, date: null, time: null,
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [labs, setLabs] = useState([]); // State for labs
    const [loadingLabs, setLoadingLabs] = useState(true); // Loading state for labs
    const [errorLabs, setErrorLabs] = useState(null); // Error state for labs
    const [availableTests, setAvailableTests] = useState([]); // State for tests offered by selected lab
    const [loadingTests, setLoadingTests] = useState(false);
    const [errorTests, setErrorTests] = useState(null);

    // Fetch labs on component mount
    useEffect(() => {
        const fetchLabs = async () => {
            try {
                setLoadingLabs(true);
                const response = await api.get('/api/labs/available'); // Fetch available labs
                setLabs(response.data);
            } catch (err) {
                setErrorLabs(err);
            } finally {
                setLoadingLabs(false);
            }
        };
        fetchLabs();
    }, []);

    // Fetch tests when a lab is selected
    useEffect(() => {
        const fetchTests = async () => {
            if (bookingDetails.lab) {
                try {
                    setLoadingTests(true);
                    const response = await api.get(`/api/labs/${bookingDetails.lab._id}/tests`);
                    setAvailableTests(response.data);
                } catch (err) {
                    setErrorTests(err);
                } finally {
                    setLoadingTests(false);
                }
            } else {
                setAvailableTests([]); // Clear tests if no lab is selected
            }
        };
        fetchTests();
    }, [bookingDetails.lab]);

    const handleNextStep = (data) => {
        setBookingDetails(prev => ({ ...prev, ...data }));
        setCurrentStep(prev => prev + 1);
    };

    const handlePrevStep = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmitBooking = async () => {
        if (!user || !user._id) {
            console.error("User not authenticated.");
            return;
        }

        try {
            const testToBook = availableTests.find(t => t.testName === bookingDetails.test.name);

            const bookingPayload = {
                labId: bookingDetails.lab._id,
                testName: bookingDetails.test.name,
                testType: testToBook ? testToBook.testType : 'Other',
                price: testToBook ? testToBook.price : 0,
                orderDate: `${bookingDetails.date}T${bookingDetails.time}:00.000Z`, // Combine date and time
            };

            await api.post('/api/labs/lab-test-orders', bookingPayload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : ''}`,
                },
            });
            setIsSubmitted(true);
        } catch (error) {
            console.error("Error booking test appointment:", error);
            // Handle error (e.g., show error message to user)
        }
    };

    const startOver = () => {
        setCurrentStep(1);
        setIsSubmitted(false);
        setBookingDetails({ lab: null, test: null, date: null, time: null });
    };

    const variants = {
        enter: { opacity: 0, x: 30 },
        center: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -30 },
    };

    // Loading and error handling for labs
    if (loadingLabs) {
        return <div className="text-center text-foreground py-12">Loading labs...</div>;
    }

    if (errorLabs) {
        return <div className="text-center text-red-500 py-12">Error loading labs: {errorLabs.message}</div>;
    }

    // Step Components
    const Step1SelectLab = ({ onNext, labsData }) => (
        <Step1SelectHospital onNext={(data) => onNext({ lab: data.hospital })} data={labsData} label="Choose Lab" icon={<FlaskConical size={20}/>} bookingType="lab" /> // Reusing Step1SelectHospital for now, will refactor
    );

    const Step2SelectTest = ({ onNext, onBack }) => {
        const [selectedTestName, setSelectedTestName] = useState(bookingDetails.test?.name || '');

        const handleSelectTest = (e) => {
            const testName = e.target.value;
            setSelectedTestName(testName);
        };

        const selectedTestDetails = availableTests.find(t => t.testName === selectedTestName);

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Select Your Test</h2>
                {loadingTests ? (
                    <div className="text-center text-muted-foreground">Loading tests...</div>
                ) : errorTests ? (
                    <div className="text-center text-red-500">Error loading tests: {errorTests.message}</div>
                ) : availableTests.length > 0 ? (
                    <div>
                        <label htmlFor="test" className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><Syringe size={16}/> Choose Test</label>
                        <select
                            id="test"
                            value={selectedTestName}
                            onChange={handleSelectTest}
                            className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                            required
                        >
                            <option value="">Select a test</option>
                            {availableTests.map(test => (
                                <option key={test.testName} value={test.testName}>{test.testName} (₹{test.price})</option>
                            ))}
                        </select>
                        {selectedTestName && selectedTestDetails && (
                            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Info size={14}/> {selectedTestDetails.testType} - ₹{selectedTestDetails.price}</p>
                        )}
                    </div>
                ) : (
                    <div className="text-center text-muted-foreground">No tests available for the selected lab.</div>
                )}
                
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onBack}
                        className="bg-muted text-foreground font-bold py-2 px-4 rounded-lg hover:bg-muted-foreground/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button
                        onClick={() => handleNextStep({ test: { name: selectedTestName, details: selectedTestDetails } })}
                        disabled={!selectedTestName || !selectedTestDetails}
                        className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        Next <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    };

    const Step3SelectDateAndSlotForTest = ({ onNext, onBack, details }) => {
        // For simplicity, generate fixed time slots for now
        const fixedAvailableTimes = [
            '09:00', '10:00', '11:00', '14:00', '15:00', '16:00',
        ];
        const [selectedDate, setSelectedDate] = useState(details.date || '');
        const [selectedTime, setSelectedTime] = useState(details.time || '');

        const handleDateChange = (e) => {
            setSelectedDate(e.target.value);
            setSelectedTime(''); // Reset time when date changes
        };

        const handleTimeChange = (time) => {
            setSelectedTime(time);
        };

        // Filter out past dates and times
        const getMinDate = () => {
            const today = new Date();
            today.setDate(today.getDate()); // Today's date
            return today.toISOString().split('T')[0];
        };

        const handleNext = () => {
            if (selectedDate && selectedTime) {
                onNext({ date: selectedDate, time: selectedTime });
            }
        };

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Select Date & Time Slot</h2>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><Calendar size={16}/> Choose Date</label>
                    <input 
                        type="date" 
                        id="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        min={getMinDate()}
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                        required
                    />
                </div>
                {selectedDate && (
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2 mt-4 flex items-center gap-2"><Clock size={16}/> Choose Time</label>
                        <div className="grid grid-cols-3 gap-3">
                            {fixedAvailableTimes.map(time => (
                                <button
                                    key={time}
                                    onClick={() => handleTimeChange(time)}
                                    className={`p-3 rounded-md text-sm font-medium transition-colors border ${
                                        selectedTime === time
                                            ? 'bg-primary text-primary-foreground border-primary'
                                            : 'bg-muted text-muted-foreground border-border hover:bg-muted-foreground/20'
                                    }`}
                                >
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onBack}
                        className="bg-muted text-foreground font-bold py-2 px-4 rounded-lg hover:bg-muted-foreground/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!selectedDate || !selectedTime}
                        className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        Next <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    };

    const Step4TestDetails = ({ onNext, onBack }) => {
        const [notes, setNotes] = useState(''); // State for notes

        const handleDetailsSubmit = () => {
            onNext({ notes }); // Pass notes to booking details
        };

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Additional Test Information (Optional)</h2>
                <p className="text-muted-foreground mb-4">You can add any specific instructions or notes for the lab here.</p>
                <div>
                    <label htmlFor="notes" className="block text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2"><Info size={16}/> Special Instructions</label>
                    <textarea
                        id="notes"
                        rows="4"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full p-3 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-hs-gradient-middle"
                        placeholder="e.g., Fasting required, specific timing preference..."
                    ></textarea>
                </div>

                <div className="flex justify-between mt-6">
                    <button
                        onClick={onBack}
                        className="bg-muted text-foreground font-bold py-2 px-4 rounded-lg hover:bg-muted-foreground/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button
                        onClick={handleDetailsSubmit}
                        className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        Review & Confirm <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        );
    };

    const Step5ConfirmTestBooking = ({ details, onSubmit, onBack }) => {
        const selectedTestDetails = details.test.details; // Get full test details
        const selectedLabDetails = details.lab;

        return (
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-foreground mb-4">Confirm Your Test Appointment</h2>
                <div className="bg-muted/30 p-5 rounded-lg border border-border space-y-4">
                    <p className="flex items-center gap-2 text-foreground font-semibold"><FlaskConical size={18}/> Test: <span className="font-normal text-muted-foreground">{selectedTestDetails?.testName} ({selectedTestDetails?.testType})</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><span className="font-normal text-muted-foreground">Price: ₹{selectedTestDetails?.price}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Hospital size={18}/> Lab: <span className="font-normal text-muted-foreground">{selectedLabDetails?.name}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><MapPin size={18}/> Location: <span className="font-normal text-muted-foreground">{selectedLabDetails?.address}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Calendar size={18}/> Date: <span className="font-normal text-muted-foreground">{details.date}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Clock size={18}/> Time: <span className="font-normal text-muted-foreground">{details.time}</span></p>
                    {details.notes && <p className="flex items-start gap-2 text-foreground font-semibold"><Info size={18}/> Notes: <span className="font-normal text-muted-foreground">{details.notes}</span></p>}
                </div>
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onBack}
                        className="bg-muted text-foreground font-bold py-2 px-4 rounded-lg hover:bg-muted-foreground/20 transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft size={18} /> Back
                    </button>
                    <button
                        onClick={onSubmit}
                        className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
                    >
                        Confirm Booking <CheckCircle size={18} />
                    </button>
                </div>
            </div>
        );
    };

    const Step6SuccessMessage = ({ details, onDone }) => {
        const selectedTestDetails = details.test.details;
        const selectedLabDetails = details.lab;
        return (
            <div className="flex flex-col items-center justify-center text-center bg-card rounded-lg p-8 shadow-lg min-h-[70vh]">
                <CheckCircle size={80} className="text-green-500 mb-6 animate-bounce" />
                <h2 className="text-3xl font-bold text-foreground mb-3">Appointment Booked!</h2>
                <p className="text-lg text-muted-foreground mb-4">Your test appointment has been successfully scheduled.</p>
                <div className="bg-muted/30 p-5 rounded-lg border border-border inline-block text-left max-w-sm space-y-3 mb-6">
                    <p className="flex items-center gap-2 text-foreground font-semibold"><FlaskConical size={18}/> Test: <span className="font-normal text-muted-foreground">{selectedTestDetails?.testName} ({selectedTestDetails?.testType})</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><span className="font-normal text-muted-foreground">Price: ₹{selectedTestDetails?.price}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Hospital size={18}/> Lab: <span className="font-normal text-muted-foreground">{selectedLabDetails?.name}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><MapPin size={18}/> Location: <span className="font-normal text-muted-foreground">{selectedLabDetails?.address}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Calendar size={18}/> Date: <span className="font-normal text-muted-foreground">{details.date}</span></p>
                    <p className="flex items-center gap-2 text-foreground font-semibold"><Clock size={18}/> Time: <span className="font-normal text-muted-foreground">{details.time}</span></p>
                    {details.notes && <p className="flex items-start gap-2 text-foreground font-semibold"><Info size={18}/> Notes: <span className="font-normal text-muted-foreground">{details.notes}</span></p>}
                </div>
                <button
                    onClick={onDone}
                    className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white font-bold py-2 px-5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={18} /> View All Appointments
                </button>
            </div>
        );
    };

    if (isSubmitted) {
        return (
            <Step6SuccessMessage details={bookingDetails} onDone={() => navigate('/patient/appointments')} />
        );
    }

    return (
        <div className="flex flex-col gap-8 md:gap-12">
            <h1 className="text-2xl sm:text-3xl md:text-3xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">Book Test Appointment</h1>

            {/* Stepper Display */}
            <div className="w-full flex justify-center">
                <div className="flex items-center space-x-4">
                    {steps.map((step, index) => (
                        <React.Fragment key={step}>
                            <div className={`flex items-center ${index + 1 <= currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index + 1 <= currentStep ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end text-white' : 'bg-muted border border-border'}`}>
                                    {index + 1}
                                </div>
                                <span className={`ml-2 hidden sm:block ${index + 1 <= currentStep ? 'font-semibold text-foreground' : 'font-medium'}`}>{step}</span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 w-12 h-px ${index + 1 < currentStep ? 'bg-gradient-to-r from-hs-gradient-start to-hs-gradient-end' : 'bg-border'}`}></div>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="flex-1 bg-card p-6 rounded-lg shadow-md border border-border">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.3, type: 'tween' }}
                        className="min-h-[400px] flex flex-col justify-between"
                    >
                        {currentStep === 1 && <Step1SelectLab onNext={handleNextStep} labsData={labs} />} 
                        {currentStep === 2 && <Step2SelectTest onNext={handleNextStep} onBack={handlePrevStep} />} 
                        {currentStep === 3 && <Step3SelectDateAndSlotForTest onNext={handleNextStep} onBack={handlePrevStep} details={bookingDetails} />} 
                        {currentStep === 4 && <Step4TestDetails onNext={handleNextStep} onBack={handlePrevStep} />} 
                        {currentStep === 5 && <Step5ConfirmTestBooking details={bookingDetails} onSubmit={handleSubmitBooking} onBack={handlePrevStep} />} 
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BookTestAppointmentPage;
