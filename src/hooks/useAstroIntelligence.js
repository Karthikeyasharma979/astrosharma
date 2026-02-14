import { useState, useEffect } from 'react';
import { useCosmicClock } from './useCosmicClock';

// Deterministic random generator based on date
const getDailySeededRandom = (seedStr) => {
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
    }
    const x = Math.sin(hash) * 10000;
    return x - Math.floor(x);
};

export const useAstroIntelligence = () => {
    const baseClock = useCosmicClock();
    const [intelligence, setIntelligence] = useState({
        nakshatra: "Ashwini",
        luckyNumber: 7,
        luckyColor: "Royal Gold",
        direction: "North-East",
        energyLevel: 85,
        mantra: {
            text: "ఓం గం గణపతయే నమః",
            meaning: "Salutations to the Remover of Obstacles",
            energy: "Grounding & Success"
        }
    });

    useEffect(() => {
        const today = new Date();
        const dateStr = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

        // Generate daily insights
        const seed = getDailySeededRandom(dateStr);

        const nakshatras = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"];
        const colors = ["Royal Gold", "Sacred Orange", "Deep Indigo", "Temple Saffron", "Vedic White", "Cosmic Blue", "Emerald Green", "Ruby Red"];
        const directions = ["North", "North-East", "East", "South-East", "South", "South-West", "West", "North-West"];

        setIntelligence({
            nakshatra: nakshatras[Math.floor(seed * nakshatras.length)],
            luckyNumber: Math.floor(seed * 9) + 1,
            luckyColor: colors[Math.floor(seed * colors.length)],
            direction: directions[Math.floor(seed * directions.length)],
            energyLevel: 75 + Math.floor(seed * 25), // 75-100%
            mantra: {
                text: "ఓం గం గణపతయే నమః",
                meaning: "Salutations to Ganesha, the Remover of Obstacles",
                energy: "Grounding & Success"
            }
        });

    }, []);

    return { ...baseClock, ...intelligence };
};
