import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Calendar, MapPin } from 'lucide-react';

// Removed getValueStatus function

const TestReportCard = ({ result }) => {
    const completionDate = new Date(result.completionDate);
    const reportedOn = completionDate.toLocaleDateString();

    const isFileUrl = result.result && (result.result.startsWith('http://') || result.result.startsWith('https://'));

    return (
        <motion.div
            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
            className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 group hover:border-primary transition-colors"
        >
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                    <div className="w-12 h-12 bg-gradient-to-br from-hs-gradient-start to-hs-gradient-end rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText className="text-white" size={20} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-lg text-foreground">{result.testName}</h3>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <MapPin size={12} />
                            <span>{result.labName}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    <span>{reportedOn}</span>
                </div>
            </div>

            {result.result && (
                <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    {result.result}
                </p>
            )}

            {/* Removed the detailed results section */}

            <div className="mt-auto pt-2">
                {isFileUrl ? (
                    <a 
                        href={result.result} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full font-bold py-2.5 px-4 rounded-lg bg-gradient-to-r from-hs-gradient-start via-hs-gradient-middle to-hs-gradient-end text-white hover:opacity-90 transition-opacity"
                    >
                        <Download size={16} /> Download Report
                    </a>
                ) : (
                    <button 
                        disabled 
                        className="inline-flex items-center justify-center gap-2 w-full font-bold py-2.5 px-4 rounded-lg bg-gray-300 text-gray-500 cursor-not-allowed"
                    >
                        <Download size={16} /> No Report Available
                    </button>
                )}
            </div>
        </motion.div>
    );
};

export default TestReportCard;

