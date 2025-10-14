import React, { useState } from 'react';
import { Droplet, MapPin, FlaskConical, User as UserIcon, Heart } from 'lucide-react';

const DonatePage = () => {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const mockBloodDonationCenters = [
        { id: 1, name: 'Red Cross Donation Center - Downtown', address: '123 Main St, Cityville', distance: '2.5 km', contact: '555-1234' },
        { id: 2, name: 'Community Blood Bank - North', address: '456 Oak Ave, Townsville', distance: '5.1 km', contact: '555-5678' },
        { id: 3, name: 'HealthSphere Hospital - South', address: '789 Pine Ln, Villagetown', distance: '8.0 km', contact: '555-9012' },
    ];

    const handleScheduleDonation = () => {
        // In a real application, this would trigger an API call or navigation to a scheduling form.
        setShowConfirmation(true);
        setTimeout(() => setShowConfirmation(false), 5000); // Hide confirmation after 5 seconds
    };

    return (
        <div className="text-foreground min-h-screen">
            {/* FIX: Correctly aligned the heading and applied gradient only to the text */}
            <h1 className="text-3xl font-bold mb-6 flex items-center gap-3">
                <Droplet size={32} className="text-hs-gradient-start" />
                <span className="bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">
                    Blood Donation
                </span>
            </h1>

            <div className="bg-card p-6 rounded-lg shadow-lg mb-8 border border-border">
                <h2 className="text-2xl font-semibold mb-4">Why Donate Blood?</h2>
                <p className="text-lg text-muted-foreground mb-4">
                    Blood donations save millions of lives each year. Your single donation can help up to three people in need.
                    It's a simple, safe, and powerful way to make a difference.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><FlaskConical size={18} className="text-hs-gradient-middle" /> Helps accident victims, surgical patients, and those battling illnesses.</li>
                    <li className="flex items-center gap-2"><UserIcon size={18} className="text-hs-gradient-middle" /> Contributes to community health and well-being.</li>
                    <li className="flex items-center gap-2"><Heart size={18} className="text-hs-gradient-middle" /> A selfless act that shows compassion and support.</li>
                </ul>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg mb-8 border border-border">
                <h2 className="text-2xl font-semibold mb-4">Find a Donation Center</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockBloodDonationCenters.map(center => (
                        <div key={center.id} className="border border-border p-4 rounded-lg flex flex-col justify-between">
                            <div>
                                <h3 className="text-xl font-semibold mb-2">{center.name}</h3>
                                <p className="text-muted-foreground flex items-center gap-1 mb-1"><MapPin size={16} /> {center.address}</p>
                                <p className="text-muted-foreground flex items-center gap-1">{center.distance} away</p>
                            </div>
                            <button 
                                onClick={handleScheduleDonation}
                                className="mt-4 px-4 py-2 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-primary-foreground rounded-md hover:opacity-90 transition-opacity self-start"
                            >
                                Schedule Donation
                            </button>
                        </div>
                    ))}
                </div>
                {showConfirmation && (
                    <p className="text-center mt-6 text-green-500 dark:text-green-400 font-semibold">
                        Thank you for your interest! A representative will contact you shortly to schedule your donation.
                    </p>
                )}
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-4">Eligibility & Preparation</h2>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Be at least 17 years old (16 with parental consent in some areas).</li>
                    <li>Weigh at least 110 pounds (50 kg).</li>
                    <li>Be in good general health.</li>
                    <li>Drink plenty of water and eat a healthy meal before donating.</li>
                    <li>Bring a valid ID.</li>
                </ul>
            </div>
        </div>
    );
};

export default DonatePage;

