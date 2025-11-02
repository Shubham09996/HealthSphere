import React from 'react';
import { Download } from 'lucide-react';
import { Link } from 'react-router-dom';

const EPrescriptions = ({ ePrescriptions }) => {
    return (
        <div className="bg-card p-4 sm:p-6 rounded-lg sm:rounded-xl border border-border shadow-sm">
            <h2 className="text-base sm:text-lg lg:text-xl font-bold text-foreground mb-1">E-Prescriptions</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mb-4">Your digital prescriptions</p>

            <div className="space-y-3 sm:space-y-4 lg:max-h-[500px] lg:overflow-y-auto">
                {ePrescriptions && ePrescriptions.length > 0 ? (
                    ePrescriptions.map((prescription) => (
                        <Link to={`/patient/prescriptions/${prescription._id}`} key={prescription._id} className="block">
                            <div className="bg-background p-3 sm:p-4 rounded-lg border border-border hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-start gap-2">
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-sm sm:text-base lg:text-lg text-foreground truncate">Dr. {prescription.doctor?.user?.name || 'N/A'}</h4>
                                        <p className="text-xs sm:text-sm text-muted-foreground">{new Date(prescription.issueDate).toLocaleDateString()}</p>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-mono break-all sm:break-normal">{prescription.prescriptionId}</span>
                                </div>
                                <ul className="list-disc list-inside text-xs sm:text-sm text-foreground mt-2 space-y-1">
                                    {prescription.medicines.slice(0, 3).map((medicineItem, index) => (
                                        <li key={index} className="truncate">
                                            {`${medicineItem.medicine?.brandName || medicineItem.medicine?.genericName || 'Unknown Medicine'} ${medicineItem.dosage || ''}`.trim()}
                                        </li>
                                    ))}
                                    {prescription.medicines.length > 3 && (
                                        <li className="text-muted-foreground italic">+{prescription.medicines.length - 3} more</li>
                                    )}
                                </ul>
                                <div className="text-left sm:text-right mt-3">
                                    <button className="text-xs sm:text-sm font-semibold bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-transparent bg-clip-text flex items-center gap-1 sm:gap-2 sm:ml-auto sm:inline-flex">
                                        <Download size={14} className="sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Download PDF</span><span className="sm:hidden">Download</span>
                                    </button>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="text-center text-sm sm:text-base text-muted-foreground py-4">No e-prescriptions found.</div>
                )}
            </div>
        </div>
    );
};

export default EPrescriptions;