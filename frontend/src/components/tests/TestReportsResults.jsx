import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import TestReportCard from './TestReportCard';

const TestReportsResults = ({ searchTerm, labTestOrders = [] }) => {
    const reportsWithResults = useMemo(() => {
        if (!labTestOrders || !Array.isArray(labTestOrders)) {
            return [];
        }
        return labTestOrders.filter(order => order.result && order.result.trim() !== '');
    }, [labTestOrders]);

    const searchResults = useMemo(() => {
        if (!reportsWithResults || !Array.isArray(reportsWithResults)) {
            return [];
        }

        if (!searchTerm.trim()) {
            return reportsWithResults;
        }

        return reportsWithResults.filter(report =>
            report.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            report.result.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, reportsWithResults]);

    return (
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        >
            {searchResults.length > 0 ? (
                searchResults.map(result => <TestReportCard key={result._id} result={result} />)
            ) : (
                <div className="md:col-span-2 text-center py-12 bg-card rounded-lg text-muted-foreground">
                    {searchTerm.trim() 
                        ? `No test reports found for "${searchTerm}".`
                        : 'No test reports available.'
                    }
                </div>
            )}
        </motion.div>
    );
};

export default TestReportsResults;

