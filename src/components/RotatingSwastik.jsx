import React from 'react';
import { motion } from 'framer-motion';

export const RotatingSwastik = () => {
    return (
        <div className="fixed inset-0 z-[5] flex items-center justify-center pointer-events-none overflow-hidden">
            <motion.div
                className="opacity-5 dark:opacity-[0.03] text-orange-500"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 100 100"
                    className="w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] fill-current"
                >
                    {/* Vertical Center Bar */}
                    <rect x="45" y="0" width="10" height="100" rx="1" />
                    {/* Horizontal Center Bar */}
                    <rect x="0" y="45" width="100" height="10" rx="1" />

                    {/* Top Arm -> Right */}
                    <rect x="55" y="0" width="45" height="10" rx="1" />
                    {/* Right Arm -> Down */}
                    <rect x="90" y="55" width="10" height="45" rx="1" />
                    {/* Bottom Arm -> Left */}
                    <rect x="0" y="90" width="45" height="10" rx="1" />
                    {/* Left Arm -> Up */}
                    <rect x="0" y="0" width="10" height="45" rx="1" />

                    {/* Four Dots */}
                    <circle cx="75" cy="25" r="5" />
                    <circle cx="75" cy="75" r="5" />
                    <circle cx="25" cy="75" r="5" />
                    <circle cx="25" cy="25" r="5" />
                </svg>
            </motion.div>
        </div>
    );
};
