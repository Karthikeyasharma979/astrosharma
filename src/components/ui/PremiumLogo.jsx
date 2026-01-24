import React from 'react';

export const PremiumLogo = ({ className }) => {
    return (
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
            <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="50%" stopColor="#D97706" />
                    <stop offset="100%" stopColor="#92400E" />
                </linearGradient>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            {/* Sun/Outer Ring */}
            <circle cx="50" cy="50" r="45" stroke="url(#goldGradient)" strokeWidth="2" strokeOpacity="0.5" strokeDasharray="4 4" />
            <circle cx="50" cy="50" r="38" stroke="url(#goldGradient)" strokeWidth="1" />

            {/* Crescent Moon */}
            <path d="M50 15 A35 35 0 1 1 15 50 A30 30 0 1 0 50 15 Z" fill="url(#goldGradient)" filter="url(#glow)" />

            {/* Star */}
            <path d="M50 35 L54 46 L65 46 L56 54 L59 65 L50 58 L41 65 L44 54 L35 46 L46 46 Z" fill="#FFF" fillOpacity="0.9" filter="url(#glow)" />

            {/* Decorative Dots */}
            <circle cx="50" cy="10" r="2" fill="#F59E0B" />
            <circle cx="90" cy="50" r="2" fill="#F59E0B" />
            <circle cx="50" cy="90" r="2" fill="#F59E0B" />
            <circle cx="10" cy="50" r="2" fill="#F59E0B" />
        </svg>
    );
};
