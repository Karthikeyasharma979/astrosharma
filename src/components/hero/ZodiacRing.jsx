import React from 'react';

export const ZodiacRing = ({ className }) => {
    return (
        <svg
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
            <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />

            {/* Zodiac Symbols Mockup (Simple geometric representations for "Science" feel) */}
            {[...Array(12)].map((_, i) => (
                <g key={i} transform={`rotate(${i * 30} 50 50)`}>
                    <line x1="50" y1="38" x2="50" y2="48" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
                    {/* Simple Dot for Star/Constellation */}
                    <circle cx="50" cy="43" r="0.5" fill="currentColor" fillOpacity="0.6" />
                </g>
            ))}

            {/* Inner Decorative Dashes */}
            <circle cx="50" cy="50" r="42" stroke="currentColor" strokeWidth="0.2" strokeDasharray="1 2" strokeOpacity="0.5" />
        </svg>
    );
};
