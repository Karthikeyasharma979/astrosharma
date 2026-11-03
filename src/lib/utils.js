import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Hemisphere-aware coordinate label, e.g. "33.87°S, 151.21°E"
export function formatLatLon(lat, lon, digits = 2, sep = '') {
    const la = Number(lat);
    const lo = Number(lon);
    if (!Number.isFinite(la) || !Number.isFinite(lo)) return '—';
    return `${Math.abs(la).toFixed(digits)}°${sep}${la >= 0 ? 'N' : 'S'}, ${Math.abs(lo).toFixed(digits)}°${sep}${lo >= 0 ? 'E' : 'W'}`;
}
