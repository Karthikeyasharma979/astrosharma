# KP Kundli: Planetary Aspects (Drishti) Implementation Report

## 1. Executive Summary

As requested, we enhanced the AstroSharma KP Kundli application by introducing a dedicated, high-precision **Planetary Aspects (Drishti)** engine and user interface. 

The implementation preserves the existing **Classical KP 4-Level House Significators** table, calculations, styling, and functionality without modification or data cross-contamination. Aspects are calculated directly from precise, unrounded astronomical planetary longitudes and Placidus house cusps.

---

## 2. Astrological Conventions & Rationale

### 2.1 The KP Tradition vs. Classical Vedic Tradition
In astrological literature, two distinct conventions exist for aspects:
1. **Krishnamurti Paddhati (Prof. K.S. Krishnamurti)**:
   - As documented in KP Readers II, III, and IV, Prof. K.S. Krishnamurti adopted Western longitudinal degree aspects (Conjunction 0°, Semi-Sextile 30°, Semi-Square 45°, Sextile 60°, Square 90°, Trine 120°, Sesquiquadrate 135°, Quincunx 150°, Opposition 180°).
   - In KP, planetary aspects to **Placidus House Cusps** (especially Cusp 1, 10, 7, 4) are vital for timing events and determining whether house significators operate harmoniously (Trine, Sextile) or under friction/delay (Square, Opposition, Quincunx).
   - Applying aspects (where the faster body is closing the angular separation toward the exact aspect) are considered active and indicative of forthcoming events, whereas Separating aspects indicate waning or past matters.

2. **Classical Parashari Vedic Jyotish (Graha Drishti)**:
   - All planets cast full 100% drishti on the 7th house and planets therein.
   - Special full drishti:
     - **Mars (Kuja)**: 4th, 7th, and 8th houses.
     - **Jupiter (Guru)**: 5th, 7th, and 9th houses.
     - **Saturn (Shani)**: 3rd, 7th, and 10th houses.
   - Rahu and Ketu are traditionally attributed 5th, 7th, and 9th drishti (trinal drishti like Jupiter) or 7th axis only.

### 2.2 Configurable Architecture
Because KP practitioners and Vedic astrologers consult both conventions depending on the analytical context, our engine **avoids silent assumptions** and supports full configurability:
- **`kp_western` (Default Standard)**: KP Western longitudinal degree aspects targeting planets and 12 Placidus house cusps.
- **`vedic_special`**: Classical Vedic Parashari Graha Drishti with special aspects for Mars, Jupiter, and Saturn.
- **`all` (Combined View)**: Allows side-by-side inspection of both degree aspects and whole-house drishti.
- **Rahu / Ketu Configuration**:
  - `western_aspects` (Default): Mathematical nodal participation in degree aspects.
  - `trine_5_9`: 5th, 7th, 9th trinal drishti.
  - `seventh_only`: 7th house drishti only.
  - `none`: Nodes excluded from casting aspects.
- **Orb Sensitivity**:
  - `standard` (KP Default): 8° for Sun/Moon major, 6° for planets major, 3°20' (1 Navamsha) for minor aspects.
  - `tight`: Strict 3°20' for major, 1°30' for minor.
  - `wide`: 10° for luminaries, 8° for planets, 5° for minor.

---

## 3. Mathematical Formulations & Rules

### 3.1 Shortest Circular Angular Separation
Given casting body longitude $\lambda_1 \in [0, 360)$ and target body/cusp longitude $\lambda_2 \in [0, 360)$:
$$\Delta\theta = \min(|\lambda_1 - \lambda_2|, 360^\circ - |\lambda_1 - \lambda_2|)$$
This formulation guarantees continuous metric distance across the $0^\circ/360^\circ$ Aries boundary.

### 3.2 Orb Calculation
For nominal aspect angle $A \in \{0^\circ, 30^\circ, 45^\circ, 60^\circ, 90^\circ, 120^\circ, 135^\circ, 150^\circ, 180^\circ\}$:
$$\text{Orb} = |\Delta\theta - A|$$
An aspect is deemed active when $\text{Orb} \le \text{MaxOrb}(A, \text{bodies}, \text{mode})$.

### 3.3 Applying vs. Separating Motion
Let daily velocities be $v_1$ and $v_2$ (for natal house cusps, $v_2 = 0$).
Let $t = 1/24$ day (1 hour). Projected positions are:
$$\lambda'_1 = (\lambda_1 + v_1 \cdot t) \pmod{360^\circ}$$
$$\lambda'_2 = (\lambda_2 + v_2 \cdot t) \pmod{360^\circ}$$
$$\Delta\theta' = \min(|\lambda'_1 - \lambda'_2|, 360^\circ - |\lambda'_1 - \lambda'_2|)$$
$$\text{Orb}' = |\Delta\theta' - A|$$
- If $\text{Orb}' \le \text{Orb}$: **Applying** (distance to exact aspect is closing).
- If $\text{Orb}' > \text{Orb}$: **Separating** (bodies are moving away from exact aspect).

### 3.4 Relative House Distance
For casting house $H_1 \in [1, 12]$ and receiving house $H_2 \in [1, 12]$:
$$H_{\text{span}} = ((H_2 - H_1 + 12) \pmod{12}) + 1$$

---

## 4. Source Files Created & Modified

| File Path | Type | Description |
|-----------|------|-------------|
| [src/utils/kp/kpAspects.js](file:///d:/Projects/projects/Astro/src/utils/kp/kpAspects.js) | New Module | Complete aspect calculation engine (KP Western & Vedic Drishti, orbs, applying/separating motion, Placidus cusp aspects). |
| [src/components/kp/KPAspects.jsx](file:///d:/Projects/projects/Astro/src/components/kp/KPAspects.jsx) | New Component | Responsive UI featuring interactive convention tabs, planet filter, target filter, nature filter, settings drawer, and educational guide. |
| [test/kp_aspects_suite.js](file:///d:/Projects/projects/Astro/test/kp_aspects_suite.js) | New Test Suite | Automated test suite verifying 0°/360° boundary wraparound, all Western angles, applying/separating motion, Vedic special drishti, and significator separation. |
| [src/services/kpCalculator.js](file:///d:/Projects/projects/Astro/src/services/kpCalculator.js) | Modified | Imported and attached calculated aspects to KP result payload. |
| [server/services/swissEphemerisService.js](file:///d:/Projects/projects/Astro/server/services/swissEphemerisService.js) | Modified | Added aspect computation to Swiss Ephemeris calculation engine. |
| [src/utils/kpTranslations.js](file:///d:/Projects/projects/Astro/src/utils/kpTranslations.js) | Modified | Added full bilingual translations (Telugu and English) for aspect tabs, table headers, badges, and principles. |
| [src/pages/KPKundliResults.jsx](file:///d:/Projects/projects/Astro/src/pages/KPKundliResults.jsx) | Modified | Added `Planetary Aspects` tab with `Eye` icon and integrated `KPAspects` component. |
| [package.json](file:///d:/Projects/projects/Astro/package.json) | Modified | Included `node test/kp_aspects_suite.js` in `npm test` and `npm run test:kp`. |

---

## 5. Sample Calculation Results (Verified Ground Truth)

**Subject**: 15 August 1998, 10:30 AM IST, Hyderabad, India (Lat: 17.3850° N, Lon: 78.4867° E)  
**Ayanamsha**: KP New (23° 44' 27.43")  
**Ascendant (Lagna)**: Libra 01° 53' 24" (181.8900°) | Cusp 10 (MC): Cancer 01° 12' 50" (91.2139°)

### 5.1 Planetary Longitudes & Status
- **Sun**: Cancer 28° 26' 31" (118.4420°), House 10, Speed +0.961°/day, Direct
- **Moon**: Taurus 03° 28' 26" (33.4740°), House 8, Speed +14.063°/day, Direct
- **Mars**: Cancer 02° 38' 35" (92.6431°), House 10, Speed +0.648°/day, Direct
- **Mercury**: Cancer 26° 17' 30" (116.2916°), House 10, Speed -0.790°/day, Retrograde
- **Jupiter**: Pisces 03° 03' 26" (333.0571°), House 5, Speed -0.087°/day, Retrograde
- **Venus**: Cancer 08° 29' 01" (98.4836°), House 10, Speed +1.222°/day, Direct
- **Saturn**: Aries 09° 53' 21" (9.8891°), House 7, Speed +0.001°/day, Direct (Stationary)
- **Rahu (Mean Node)**: Leo 08° 00' 28" (128.0077°), House 11, Speed -0.053°/day, Retrograde
- **Ketu (Mean Node)**: Aquarius 08° 00' 28" (308.0077°), House 5, Speed -0.053°/day, Retrograde

### 5.2 Active KP Western Degree Aspects (Sample Between Planets)
- **Mars (H10) Trine (120°) Jupiter (H5)**:
  - Exact Angle: 119° 35' 10" (119.5860°)
  - Orb: 0° 24' 50" (0.4140°)
  - Motion: **Applying** (Mars direct moving forward, Jupiter retrograding backward, angular separation widening toward exact 120°)
  - Nature: Benefic (Auspicious harmonious link between 10th and 5th house significators)
- **Moon (H8) Sextile (60°) Jupiter (H5)**:
  - Exact Angle: 60° 25' 01" (60.4169°)
  - Orb: 0° 25' 01" (0.4169°)
  - Motion: **Separating** (Moon moving fast at +14.06°/day, widening angle past exact 60°)
  - Nature: Benefic
- **Sun (H10) Conjunction (0°) Mercury (H10)**:
  - Exact Angle: 2° 09' 01" (2.1504°)
  - Orb: 2° 09' 01" (2.1504°)
  - Motion: **Separating** (Sun advancing direct, Mercury retrograding backward)
  - Nature: Neutral (Budhaditya yoga in the 10th house)
- **Venus (H10) Square (90°) Saturn (H7)**:
  - Exact Angle: 88° 35' 40" (88.5945°)
  - Orb: 1° 24' 20" (1.4055°)
  - Motion: **Applying** (Venus advancing at +1.22°/day toward exact 90° to stationary Saturn)
  - Nature: Challenging / Malefic
- **Moon (H8) Sextile (60°) Mars (H10)**:
  - Exact Angle: 59° 10' 09" (59.1691°)
  - Orb: 0° 49' 51" (0.8309°)
  - Motion: **Separating** (Moon catching up toward Mars, shrinking distance below 60° toward 0°)
  - Nature: Benefic

### 5.3 Active Vedic Parashari Graha Drishti (Clean 100% Full House Orbs)
- **Mars (H10) 4th Drishti ➔ House 1 (Lagna)**: Angle 89° 14' 49", Orb: Full (100%), Vishesh Chaturtha Drishti on Lagna.
- **Mars (H10) 7th Drishti ➔ House 4**: Angle 178° 34' 15", Orb: Full (100%), Saptama Drishti on Sukha Bhava.
- **Mars (H10) 8th Drishti ➔ House 5**: Angle 150° 22' 24", Orb: Full (100%), Vishesh Ashtama Drishti on House 5 (aspecting Jupiter and Ketu).
- **Jupiter (H5) 5th Drishti ➔ House 9**: Angle 87° 58' 32", Orb: Full (100%), Vishesh Panchama Drishti on Bhagya Bhava.
- **Jupiter (H5) 7th Drishti ➔ House 11**: Angle 149° 12' 45", Orb: Full (100%), Saptama Drishti on Labha Bhava (aspecting Rahu).
- **Jupiter (H5) 9th Drishti ➔ House 1 (Lagna)**: Angle 151° 10' 02", Orb: Full (100%), Vishesh Navama Drishti on Lagna.
- **Saturn (H7) 3rd Drishti ➔ House 9**: Angle 51° 08' 37", Orb: Full (100%), Vishesh Tritiya Drishti on House 9.
- **Saturn (H7) 7th Drishti ➔ House 1 (Lagna)**: Angle 172° 00' 03", Orb: Full (100%), Saptama Drishti on Lagna.
- **Saturn (H7) 10th Drishti ➔ House 4**: Angle 98° 40' 31", Orb: Full (100%), Vishesh Dashama Drishti on House 4.

---

## 6. Automated Test Results & Verification

All 6 automated test suites pass without errors:
- `test/kundli_suite.js`: 8 passed, 0 failed
- `test/kp_kundli_suite.js`: 16 passed, 0 failed
- `test/kp_aspects_suite.js`: 8 passed, 0 failed (Includes numerical regression assertions & motion derivative tests)
- `test/test_all_249_subs.js`: 486 boundary tests passed, 0 failed
- `test/independent_multi_audit.js`: 302 passed, 0 failed
- `test/location_and_geocoding_suite.js`: 9 passed, 0 failed
- **Total Test Assertions**: 829 tests passed, 0 failed.

Production client bundle compiled cleanly with Vite (`npm run build`).

---

## 7. Astrological Conventions & Decisions Requiring Father's Confirmation

The following 4 decisions represent important astrological nuances that must be confirmed by the user's father rather than decided silently:

1. **Rahu and Ketu Drishti**:
   - *Current Implementation*: By default, Rahu and Ketu participate in Western longitudinal degree aspects (as taught in standard KP practice for node-planet aspects). The UI also provides configurable modes for Vedic 5/7/9 trine drishti, 7th house drishti only, or excluding nodes from casting.
   - *Decision for Father*: Should Ketu cast 5th and 9th drishti in the Vedic mode, or should only Rahu (or neither) cast special drishti?
2. **Western Minor Aspects & Quintiles**:
   - *Current Implementation*: Includes Ptolemaic major aspects (0°, 60°, 90°, 120°, 180°) and classical minors (30°, 45°, 135°, 150°). 5th-harmonic Kepler aspects (Quintile 72°, Bi-quintile 144°) are deliberately omitted from default calculations.
   - *Decision for Father*: Does your father's KP practice utilize Quintile (72°) aspects for creative/intellectual talents, or keep strictly to 30°/45° multiples?
3. **House Cusp Aspect Orbs**:
   - *Current Implementation*: House cusps are non-physical mathematical boundary points. Cusp orbs are now separated from planetary orbs and made configurable between `Standard (5° 00')`, `Strict Navamsha (3° 20')`, and `Full Planetary (6°-8°)`.
   - *Decision for Father*: Which default cusp orb limit does your father prefer for standard KP horoscope judgment?
4. **Vedic Drishti: Rashi Drishti vs Bhava-Chalit Drishti**:
   - *Current Implementation*: Vedic Parashari Graha Drishti is evaluated on house numbers (Bhava). When a planet is near a cusp boundary, does your father calculate drishti strictly from sign-to-sign (Rashi Drishti) or house-to-house (Bhava Drishti)?
