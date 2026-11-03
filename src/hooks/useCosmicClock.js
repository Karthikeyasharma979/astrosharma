import { useState, useEffect } from 'react';
import { calculatePanchang } from '../utils/panchangUtils';

const HOUR_MS = 1000 * 60 * 60;
const MINUTE_MS = 1000 * 60;

// Hyderabad panchang is keyed by the IST calendar date, regardless of the viewer's own timezone
const istDateKey = (ms) => new Date(ms + 5.5 * HOUR_MS).toISOString().slice(0, 10);
const istNoon = (dateKey, addDays = 0) => {
    const [y, m, d] = dateKey.split('-').map(Number);
    return new Date(y, m - 1, d + addDays, 12, 0, 0);
};

export const useCosmicClock = () => {
    const [clockData, setClockData] = useState({
        loading: true,
        tithi: null,
        moonPhase: 'waxing-crescent',
        rahuKalam: null,
        rahuStatus: 'upcoming',
        rahuProgress: 0,
        countdown: '',
        error: null
    });

    useEffect(() => {
        let dayKey = null;
        let todayPanchang = null;
        let tomorrowPanchang = null;

        const refreshPanchang = (nowMs) => {
            dayKey = istDateKey(nowMs);
            try {
                todayPanchang = calculatePanchang(istNoon(dayKey), 'hyderabad');
                tomorrowPanchang = calculatePanchang(istNoon(dayKey, 1), 'hyderabad');
            } catch (err) {
                console.error("Cosmic Clock panchang calculation error:", err);
            }
        };

        const tick = () => {
            try {
                const nowMs = Date.now();
                if (!todayPanchang || istDateKey(nowMs) !== dayKey) refreshPanchang(nowMs);
                if (!todayPanchang) return;

                const tithiName = todayPanchang.tithi?.te || todayPanchang.tithi?.en || "శుక్ల పక్షం";

                // Moon Phase Logic
                let phase = 'waxing-crescent';
                const lowerTithi = (todayPanchang.tithi?.en || "").toLowerCase();
                if (lowerTithi.includes('amavasya')) phase = 'new-moon';
                else if (lowerTithi.includes('pournami') || lowerTithi.includes('purnima')) phase = 'full-moon';

                // Rahu Kalam Countdown Logic (absolute instants, so correct in any viewer timezone)
                const rahuKalamStr = todayPanchang.timings?.rahu_kalam;
                const [startMs, endMs] = todayPanchang.raw?.rahu_kalam || [];
                let rahuStatus = 'upcoming';
                let countdownStr = "";
                let rahuProgress = 0;

                if (startMs && endMs) {
                    const timeUntilStart = startMs - nowMs;
                    const timeUntilEnd = endMs - nowMs;

                    if (timeUntilStart > 0) {
                        const hours = Math.floor(timeUntilStart / HOUR_MS);
                        const minutes = Math.floor((timeUntilStart % HOUR_MS) / MINUTE_MS);
                        const seconds = Math.floor((timeUntilStart % MINUTE_MS) / 1000);
                        countdownStr = `Starts in ${hours}h ${minutes}m ${seconds}s`;
                    } else if (timeUntilEnd > 0) {
                        rahuStatus = 'active';
                        const hours = Math.floor(timeUntilEnd / HOUR_MS);
                        const minutes = Math.floor((timeUntilEnd % HOUR_MS) / MINUTE_MS);
                        const seconds = Math.floor((timeUntilEnd % MINUTE_MS) / 1000);
                        countdownStr = hours > 0 ? `Ends in ${hours}h ${minutes}m ${seconds}s` : `Ends in ${minutes}m ${seconds}s`;
                        rahuProgress = Math.min(100, Math.max(0, ((nowMs - startMs) / (endMs - startMs)) * 100));
                    } else {
                        // Passed for today, check Tomorrow's Rahu Kalam
                        const nextStartMs = tomorrowPanchang?.raw?.rahu_kalam?.[0];
                        const timeUntilNext = nextStartMs ? nextStartMs - nowMs : 0;
                        if (timeUntilNext > 0) {
                            const hours = Math.floor(timeUntilNext / HOUR_MS);
                            const minutes = Math.floor((timeUntilNext % HOUR_MS) / MINUTE_MS);
                            countdownStr = `Tmrw in ${hours}h ${minutes}m`;
                        } else {
                            rahuStatus = 'passed';
                            countdownStr = "Completed today";
                        }
                    }
                }

                setClockData({
                    loading: false,
                    tithi: tithiName,
                    moonPhase: phase,
                    rahuKalam: rahuKalamStr,
                    rahuStatus,
                    rahuProgress,
                    countdown: countdownStr,
                    error: null
                });
            } catch (tickErr) {
                console.error("Cosmic clock tick error:", tickErr);
            }
        };

        // Run immediately on mount
        tick();

        // Update the countdown timer every second in memory (zero network calls)
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, []);

    return clockData;
};
