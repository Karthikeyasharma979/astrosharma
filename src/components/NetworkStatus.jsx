import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, Wifi } from 'lucide-react';

export const NetworkStatus = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [showBackOnline, setShowBackOnline] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            setShowBackOnline(true);
            // Hide the "Back online" message after 3 seconds
            setTimeout(() => {
                setShowBackOnline(false);
            }, 3000);
        };

        const handleOffline = () => {
            setIsOnline(false);
            setShowBackOnline(false); // Reset
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    return (
        <AnimatePresence>
            {!isOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/20 border-b border-red-400"
                >
                    <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
                        <WifiOff className="w-5 h-5 animate-pulse" />
                        <p className="font-bold text-sm tracking-wide">
                            You are currently offline. Please check your internet connection.
                        </p>
                    </div>
                </motion.div>
            )}

            {isOnline && showBackOnline && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="fixed top-0 left-0 right-0 z-[9999] bg-gradient-to-r from-green-600 to-green-500 text-white shadow-lg shadow-green-500/20 border-b border-green-400"
                >
                    <div className="container mx-auto px-4 py-2.5 flex items-center justify-center gap-3">
                        <Wifi className="w-5 h-5" />
                        <p className="font-bold text-sm tracking-wide">
                            Back online! Connection restored.
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
