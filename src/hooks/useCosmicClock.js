
import { useState, useEffect } from 'react';
import { fetchPanchangData } from '../utils/panchangUtils';
// TITHI MAPPING for Moon Phase Logic
// 1-15: Shukla Paksha (Waxing), 16-30: Krishna Paksha (Waning)
// Padyami (1) to Pournami (15) -> Waxing
// Padyami (1) to Amavasya (15) [after Pournami] -> Waning
// Simplified logic: If "Sukla" or "Shukla" is in Tithi name -> Waxing
// If "Krishna" or "Bahula" is in Tithi name -> Waning
// Note: panchang.json "tithi" object might not explicitly say "Shukla"/"Krishna" in the 'en' field sometimes, 
// but often Tithis are just "Padyami", "Vidiya" etc. 
// We might need to look at the 'moon_phase' if available or deduce it from the index if we had a full calendar.
// OR, we can try to find 'Shukla'/'Krishna' in the 'te' (Telugu) or 'hi' (Hindi) or internal data if available.
// 
// For this MVP: 
// We will look for "Pournami" (Full Moon) and "Amavasya" (New Moon).
// For others, since we don't have explicit "Paksha" in the JSON 'tithi.en' field usually (it just says "Padyami"), 
// we might have to rely on a heuristic or just show a generic "Crescent" for now unless we can parse it from data.
// 
// WAIT: `panchangUtils.js` has a translation map, but `panchang.json` data for `tithi.en` is just "Padyami".
// However, looking at `panchang.json`:
// "tithi": { "en": "Amavasya", ... }
// "tithi": { "en": "Padyami", ... }
// It doesn't explicitly say "Shukla Padyami". 
// 
// Let's deduce phase from 2 things:
// 1. If it is Amavasya -> New Moon
// 2. If it is Pournami -> Full Moon
// 3. Else -> Waxing Crescent (Default for MVP visual, or we can try to be smarter if we had day index).

export const useCosmicClock = () => {
    const [clockData, setClockData] = useState({
        loading: true,
        tithi: null,
        moonPhase: 'waxing-crescent', // default
        rahuKalam: null,
        error: null
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchPanchangData();
                const today = new Date();
                const dd = String(today.getDate()).padStart(2, '0');
                const mm = String(today.getMonth() + 1).padStart(2, '0');
                const yyyy = today.getFullYear();
                const todayStr = `${dd}-${mm}-${yyyy}`;

                const todayPanchang = data.find(p => p.date === todayStr);

                if (todayPanchang) {
                    // 1. Tithi
                    const tithiName = todayPanchang.tithi?.en || "Unknown Tithi";

                    // 2. Moon Phase Logic (Simple Heuristic for now)
                    let phase = 'waxing-crescent';
                    const lowerTithi = tithiName.toLowerCase();
                    if (lowerTithi.includes('amavasya')) phase = 'new-moon';
                    else if (lowerTithi.includes('pournami') || lowerTithi.includes('purnima')) phase = 'full-moon';
                    // We could add more logic if we had Paksha data.
                    // For now, let's assume if it is NOT Amavasya/Pournami, we show a crescent.
                    // TODO: Improve this with Paksha detection if data allows in future.

                    // 3. Rahu Kalam Logic (Countdown)
                    let rahuKalamStr = todayPanchang.timings?.rahu_kalam; // "11:05 - 12:30"
                    let rahuStatus = 'upcoming'; // upcoming, active, passed
                    let countdownStr = "";

                    if (rahuKalamStr && rahuKalamStr.includes('-')) {
                        const [startStr, endStr] = rahuKalamStr.split('-').map(s => s.trim());
                        const now = new Date();

                        // Parse HH:MM to today's date objects
                        const [startH, startM] = startStr.split(':').map(Number);
                        const [endH, endM] = endStr.split(':').map(Number);

                        const startTime = new Date(now);
                        startTime.setHours(startH, startM, 0, 0);

                        const endTime = new Date(now);
                        endTime.setHours(endH, endM, 0, 0);

                        const timeUntilStart = startTime - now;
                        const timeUntilEnd = endTime - now;

                        if (timeUntilStart > 0) {
                            rahuStatus = 'upcoming';
                            // Format countdown hours, minutes, seconds
                            const hours = Math.floor(timeUntilStart / (1000 * 60 * 60));
                            const minutes = Math.floor((timeUntilStart % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((timeUntilStart % (1000 * 60)) / 1000);
                            countdownStr = `Starts in ${hours}h ${minutes}m ${seconds}s`;
                        } else if (timeUntilEnd > 0) {
                            rahuStatus = 'active';
                            const minutes = Math.floor((timeUntilEnd % (1000 * 60 * 60)) / (1000 * 60));
                            const seconds = Math.floor((timeUntilEnd % (1000 * 60)) / 1000);
                            countdownStr = `Ends in ${minutes}m ${seconds}s`;
                        } else {
                            // Passed for today, check Tomorrow
                            try {
                                const tomorrow = new Date(now);
                                tomorrow.setDate(tomorrow.getDate() + 1);
                                const t_dd = String(tomorrow.getDate()).padStart(2, '0');
                                const t_mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
                                const t_yyyy = tomorrow.getFullYear();
                                const tomorrowStr = `${t_dd}-${t_mm}-${t_yyyy}`;

                                const tomorrowPanchang = data.find(p => p.date === tomorrowStr);
                                if (tomorrowPanchang) {
                                    const nextRahuStr = tomorrowPanchang.timings?.rahu_kalam;
                                    if (nextRahuStr && nextRahuStr.includes('-')) {
                                        const [nStartStr] = nextRahuStr.split('-').map(s => s.trim());
                                        const [nStartH, nStartM] = nStartStr.split(':').map(Number);

                                        const nextStartTime = new Date(tomorrow);
                                        nextStartTime.setHours(nStartH, nStartM, 0, 0);

                                        const timeUntilNext = nextStartTime - now;

                                        if (timeUntilNext > 0) {
                                            rahuStatus = 'upcoming';
                                            rahuKalamStr = nextRahuStr; // Update display string

                                            const hours = Math.floor(timeUntilNext / (1000 * 60 * 60));
                                            const minutes = Math.floor((timeUntilNext % (1000 * 60 * 60)) / (1000 * 60));
                                            const seconds = Math.floor((timeUntilNext % (1000 * 60)) / 1000);
                                            countdownStr = `Tmrw in ${hours}h ${minutes}m`;
                                        }
                                    }
                                } else {
                                    rahuStatus = 'passed';
                                    countdownStr = "Completed today";
                                }
                            } catch (e) {
                                console.error("Error calculating next day rahu:", e);
                                rahuStatus = 'passed';
                                countdownStr = "Completed today";
                            }
                        }
                    }

                    // Calculate Progress
                    let rahuProgress = 0;
                    if (rahuStatus === 'active' && rahuKalamStr && rahuKalamStr.includes('-')) {
                        const [startStr, endStr] = rahuKalamStr.split('-').map(s => s.trim());
                        const now = new Date();
                        const [startH, startM] = startStr.split(':').map(Number);
                        const [endH, endM] = endStr.split(':').map(Number);

                        const startTime = new Date(now);
                        startTime.setHours(startH, startM, 0, 0);

                        const endTime = new Date(now);
                        endTime.setHours(endH, endM, 0, 0);

                        const totalDuration = endTime - startTime;
                        const elapsed = now - startTime;
                        rahuProgress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
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
                } else {
                    // Fallback
                    setClockData({
                        loading: false,
                        tithi: "Shukla Paksha",
                        moonPhase: 'waxing-crescent',
                        rahuKalam: "10:30 - 12:00",
                        rahuStatus: 'upcoming',
                        rahuProgress: 0,
                        countdown: "--:--:--",
                        error: "Data not found"
                    });
                }
            } catch (err) {
                console.error("Error loading cosmic clock data:", err);
                setClockData({
                    loading: false,
                    tithi: "Unavailable",
                    moonPhase: 'waxing-crescent',
                    rahuKalam: "--:--",
                    rahuStatus: 'passed',
                    rahuProgress: 0,
                    countdown: "",
                    error: err.message
                });
            }
        };

        loadData();
        const interval = setInterval(loadData, 1000); // Update every second for countdown
        return () => clearInterval(interval);
    }, []);

    return clockData;
};
