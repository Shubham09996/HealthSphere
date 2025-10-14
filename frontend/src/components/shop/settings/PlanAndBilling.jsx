import React from 'react';
import { Star } from 'lucide-react';
import { shopSettingsData } from '../../../data/shopSettingsData'; // NEW: Data import added

const PlanAndBilling = () => {
    const { subscription } = shopSettingsData;

    return (
        <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h3 className="font-bold text-lg text-foreground">Current Plan</h3>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-2xl bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text">{subscription.plan} Tier</span>
                        {subscription.plan === 'Premium' && <Star className="text-yellow-500 fill-yellow-500"/>}
                    </div>
                </div>
                <button className="font-semibold py-2 px-4 rounded-lg border border-border hover:bg-muted self-start sm:self-center">
                    Manage Plan
                </button>
            </div>
            <div className="border-t border-border my-4"></div>
            <div className="text-sm space-y-2">
                <p><span className="text-muted-foreground">Monthly Price:</span> <span className="font-semibold text-foreground">₹{subscription.price}</span></p>
                <p><span className="text-muted-foreground">Next Billing Date:</span> <span className="font-semibold text-foreground">{new Date(subscription.nextBillingDate).toDateString()}</span></p>
            </div>
        </div>
    );
};

export default PlanAndBilling;