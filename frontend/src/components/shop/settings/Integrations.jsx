import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Zap, CheckCircle } from 'lucide-react';

const Integrations = () => {
    const { isPremium } = useOutletContext();

    if (!isPremium) {
        return (
             <div className="text-center bg-card p-8 rounded-2xl border-2 border-dashed border-border shadow-sm">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Zap size={32} className="text-primary"/>
                </div>
                <h1 className="text-2xl font-bold text-foreground">Unlock API Integrations</h1>
                <p className="text-muted-foreground mt-2 mb-6">Upgrade to Premium to connect with platforms like 1mg & PharmEasy, automate stock, and more.</p>
                <button className="font-semibold py-3 px-6 rounded-lg bg-primary text-primary-foreground">Upgrade to Premium</button>
            </div>
        );
    }
    
    return (
         <div className="bg-card p-6 rounded-xl border border-border/70 shadow-sm">
             <h3 className="font-bold text-lg text-foreground mb-4">API Integrations (Premium)</h3>
             <div className="space-y-4">
                <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-3"><img src="https://onemg.gumlet.io/image/upload/v1631894338/1mg_logo_square_mark_blue.png" className="h-8 w-8"/> <span className="font-semibold">Tata 1mg</span></div>
                    <div className="flex items-center gap-2 text-sm font-semibold text-green-500"><CheckCircle size={16}/> Connected</div>
                </div>
                 <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-3"><img src="https://assets.pharmeasy.in/web-assets/dist/fca22bc9.png" className="h-8 w-8"/> <span className="font-semibold">PharmEasy</span></div>
                    <button className="font-semibold py-1 px-3 text-sm rounded-lg border border-border hover:bg-border">Connect</button>
                </div>
             </div>
         </div>
    );
};
export default Integrations;