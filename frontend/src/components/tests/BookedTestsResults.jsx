import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import BookedTestCard from './BookedTestCard';

const BookedTestsResults = ({ searchTerm, labTestOrders = [] }) => {
    const searchResults = useMemo(() => {
        if (!labTestOrders || !Array.isArray(labTestOrders)) {
            return [];
        }

        if (!searchTerm.trim()) {
            return labTestOrders;
        }

        return labTestOrders.filter(test =>
            test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.status.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, labTestOrders]);

    return (
        <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } } }}
        >
            {searchResults.length > 0 ? (
                searchResults.map(result => <BookedTestCard key={result._id} result={result} />)
            ) : (
                <div className="text-center py-12 bg-card rounded-lg text-muted-foreground">
                    {searchTerm.trim() 
                        ? `No booked tests found for "${searchTerm}".`
                        : 'No booked tests available.'
                    }
                </div>
            )}
        </motion.div>
    );
};

export default BookedTestsResults;

