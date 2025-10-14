import React from 'react';

const MyTokenPage = () => {
    const mockTokenData = {
        tokenNumber: 'P00123',
        status: 'Active',
        estimatedWaitTime: '15 minutes',
        clinicName: 'City General Hospital',
        doctorName: 'Dr. Emily White',
        lastUpdated: '2025-10-14 10:30 AM'
    };

    return (
        <div className="text-foreground min-h-screen">
            <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">My Token</h1>

            <div className="bg-card p-6 rounded-lg shadow-lg mb-8 border border-border">
                <h2 className="text-2xl font-semibold mb-4">Current Token Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Token Number:</p>
                        {/* FIX: Font size changed from text-3xl to text-2xl */}
                        <p className="text-2xl font-bold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">{mockTokenData.tokenNumber}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Status:</p>
                        {/* FIX: Font size changed from text-lg to text-base */}
                        <p className={`text-base font-semibold ${mockTokenData.status === 'Active' ? 'text-green-500' : 'text-yellow-500'}`}>{mockTokenData.status}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Estimated Wait Time:</p>
                        {/* FIX: Font size changed from text-lg to text-base */}
                        <p className="text-base font-semibold">{mockTokenData.estimatedWaitTime}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Clinic:</p>
                        {/* FIX: Font size changed from text-lg to text-base */}
                        <p className="text-base font-semibold">{mockTokenData.clinicName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Doctor:</p>
                        {/* FIX: Font size changed from text-lg to text-base */}
                        <p className="text-base font-semibold">{mockTokenData.doctorName}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Last Updated:</p>
                        {/* FIX: Font size changed from text-lg to text-base */}
                        <p className="text-base font-semibold">{mockTokenData.lastUpdated}</p>
                    </div>
                </div>
            </div>

            <div className="bg-card p-6 rounded-lg shadow-lg border border-border">
                <h2 className="text-2xl font-semibold mb-4">Token History</h2>
                <ul className="space-y-3">
                    <li className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                        {/* FIX: Font size changed to text-sm */}
                        <span className="text-sm">Token: P00120 - Dr. Smith (Completed)</span>
                        <span className="text-sm text-muted-foreground">2025-10-10</span>
                    </li>
                    <li className="flex justify-between items-center py-2 border-b border-border last:border-b-0">
                        {/* FIX: Font size changed to text-sm */}
                        <span className="text-sm">Token: P00115 - Dr. Jones (Cancelled)</span>
                        <span className="text-sm text-muted-foreground">2025-10-05</span>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default MyTokenPage;

