/**
 * Shared state for the Get Kundli flow: birth details are entered once and can
 * be viewed in either the Vedic or the KP system.
 */
import { calculateKundli } from './kundliCalculator';
import { calculateKPKundli, KP_AYANAMSHA_MODES } from '../services/kpCalculator';

const PARAMS_KEY = 'astrosharma_kundli_params';
const SYSTEM_KEY = 'astrosharma_kundli_system';
const LANG_KEY = 'astrosharma_kundli_lang';
const KP_RESULT_KEY = 'astrosharma_kp_result';

const KP_API_TIMEOUT_MS = 15000;
const MIN_LOADING_MS = 800;

const readJSON = (key) => {
    try {
        const cached = sessionStorage.getItem(key);
        return cached ? JSON.parse(cached) : null;
    } catch {
        return null;
    }
};

const write = (key, value) => {
    try {
        sessionStorage.setItem(key, value);
    } catch (err) {
        console.warn(`Could not save ${key} to sessionStorage`, err);
    }
};

const remove = (...keys) => {
    try {
        keys.forEach(key => sessionStorage.removeItem(key));
    } catch {}
};

export const kundliResultsPath = (system) => `/kundli/${system}`;

export const loadKundliParams = () => readJSON(PARAMS_KEY);
export const loadKPResult = () => readJSON(KP_RESULT_KEY);
export const saveKPResult = (result) => write(KP_RESULT_KEY, JSON.stringify(result));
export const saveKundliSystem = (system) => write(SYSTEM_KEY, system);
export const saveKundliLang = (lang) => write(LANG_KEY, lang);

export const loadKundliLang = () => {
    try {
        return sessionStorage.getItem(LANG_KEY) || 'te';
    } catch {
        return 'te';
    }
};

// New birth details invalidate any KP result calculated from the previous ones
export const saveKundliParams = (params) => {
    remove(KP_RESULT_KEY, SYSTEM_KEY);
    write(PARAMS_KEY, JSON.stringify(params));
};

export const clearKundliSession = () => remove(PARAMS_KEY, SYSTEM_KEY, KP_RESULT_KEY);

// The last Kundli generated in this session, if any
export const loadRecentKundli = () => {
    const params = loadKundliParams();
    let system = null;
    try {
        system = sessionStorage.getItem(SYSTEM_KEY);
    } catch {}
    return params && system ? { params, system } : null;
};

export const calculateVedicKundli = (params) => calculateKundli({
    birthDate: params.birthDate,
    birthTime: params.birthTime,
    lat: params.lat,
    lon: params.lon,
    timezone: params.timezone
});

const requestKPKundli = async (params) => {
    const payload = {
        birthDate: params.birthDate,
        birthTime: params.birthTime,
        lat: params.lat,
        lon: params.lon,
        timezone: params.timezone,
        ayanamshaMode: params.ayanamshaMode || KP_AYANAMSHA_MODES.KP_NEW,
        nodeMode: params.nodeMode || 'mean'
    };

    // First attempt: Authoritative Swiss Ephemeris from backend API
    try {
        const response = await fetch('/api/kp-kundli', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
            signal: AbortSignal.timeout(KP_API_TIMEOUT_MS)
        });

        if (response.ok) {
            const json = await response.json();
            if (json && json.success && json.data) {
                return json.data;
            }
        }
    } catch (apiErr) {
        console.warn("Backend calculation API unreachable, falling back to local client engine:", apiErr.message);
    }

    // Fallback: If backend is offline, calculate via client-side high-precision engine
    return calculateKPKundli(payload);
};

export const generateKPKundli = async (params) => {
    const result = await requestKPKundli(params);
    saveKPResult(result);
    return result;
};

const preloadResultsPage = (system) => (
    system === 'kp' ? import('../pages/KPKundliResults') : import('../pages/KundliResults')
);

// Runs a Kundli calculation behind the loading screen: waits for the screen to
// paint first, since calculations block the main thread, loads the results page
// so it opens straight away, and keeps the screen up long enough not to flash.
export const runWithLoadingScreen = async (system, task) => {
    const startedAt = Date.now();
    await new Promise(resolve => requestAnimationFrame(() => setTimeout(resolve, 0)));

    const [result] = await Promise.all([task(), preloadResultsPage(system)]);

    const remaining = MIN_LOADING_MS - (Date.now() - startedAt);
    if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining));
    }
    return result;
};

export const formatBirthDate = (dStr, isTe) => {
    if (!dStr) return '';
    const parts = dStr.split('-');
    if (parts.length !== 3) return dStr;
    const [y, m, d] = parts;
    const monthsEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthsTe = ['జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్', 'జూలై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్'];
    const monthIndex = parseInt(m, 10) - 1;
    return `${d} ${isTe ? monthsTe[monthIndex] : monthsEn[monthIndex]} ${y}`;
};

export const formatBirthTime = (tStr) => {
    if (!tStr) return '';
    const [hStr, mStr] = tStr.split(':');
    const h = parseInt(hStr, 10);
    if (isNaN(h)) return tStr;
    return `${h % 12 || 12}:${mStr || '00'} ${h >= 12 ? 'PM' : 'AM'}`;
};

export const getGenderLabel = (gender, isTe) => {
    if (gender === 'male') return isTe ? 'పురుషుడు' : 'Male';
    if (gender === 'female') return isTe ? 'స్త్రీ' : 'Female';
    return null;
};
