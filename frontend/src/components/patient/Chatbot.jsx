import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X } from 'lucide-react';
import ChatWindow from './ChatWindow';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const navigate = useNavigate();

    // Initial welcome message when chat opens for the first time
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                { 
                    id: 1, 
                    sender: 'bot', 
                    text: 'Hello! I am your Health Assistant. How can I help you today?',
                    suggestions: ['Book an Appointment', 'Find a Medicine', 'View My Records']
                }
            ]);
        }
    }, [isOpen, messages.length]);

    const getBotResponse = (userMessage) => {
        const lowerCaseMessage = userMessage.toLowerCase();
        
        if (lowerCaseMessage.includes('appointment')) {
            return {
                text: 'You can book an appointment by clicking the button below or navigating to the appointments section.',
                action: () => navigate('/patient/appointments') // Navigate to the page
            };
        }
        if (lowerCaseMessage.includes('medicine') || lowerCaseMessage.includes('find')) {
            return {
                text: 'I can help you find medicines. Please go to our Medicine Finder page.',
                action: () => navigate('/patient/medicine-finder')
            };
        }
        if (lowerCaseMessage.includes('record') || lowerCaseMessage.includes('report')) {
            return {
                text: 'You can view all your health records on the Health Records page.',
                action: () => navigate('/patient/health-records')
            };
        }
        if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
            return { text: 'Hello there! How can I assist you?' };
        }

        return { 
            text: "I'm sorry, I don't understand that. You can try asking about appointments, medicines, or your records.",
            suggestions: ['Book an Appointment', 'Find a Medicine', 'View My Records']
        };
    };

    const handleSendMessage = (text) => {
        const userMessage = { id: Date.now(), sender: 'user', text };
        setMessages(prev => [...prev, userMessage]);

        // Simulate bot thinking and responding
        setTimeout(() => {
            const botResponse = getBotResponse(text);
            const newBotMessage = {
                id: Date.now() + 1,
                sender: 'bot',
                ...botResponse // Spread the response object
            };
            setMessages(prev => [...prev, newBotMessage]);
            
            // If the bot response has an action, execute it
            if (botResponse.action) {
                setTimeout(() => {
                     botResponse.action();
                     setIsOpen(false); // Close chat after navigation
                }, 1000);
            }

        }, 1500); // 1.5 second delay
    };

    return (
        <>
            {/* Floating Action Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white p-4 rounded-full shadow-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <MessageSquare size={24} />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                        className="fixed bottom-24 right-6 z-50 w-full max-w-sm"
                    >
                        <ChatWindow 
                            onClose={() => setIsOpen(false)} 
                            messages={messages}
                            onSendMessage={handleSendMessage}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Chatbot;