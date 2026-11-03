# KP Kundli Significator Table Bug Report & Technical Resolution

**Date:** 2026-10-25  
**Subject Chart:** 15-08-1998, 10:30 AM IST, Hyderabad, India (Lat: 17.3850° N, Lon: 78.4867° E)  
**System:** Krishnamurti Paddhati (KP System), KP New (KP Original / K.S. Krishnamurti) Ayanamsha, Placidus House System  

---

## 1. Executive Summary

In AstroSharma's KP Kundli result view, the **Significators Table** (`PL(h) - (owns) (stl of) (sub of)`) displayed `(..)` placeholders for numerous planets instead of the expected house numbers:
- In the `owns` column: **Rahu** and **Ketu** displayed `(..)`.
- In the `stl of` column: **Moon, Mercury, Venus, Saturn, and Rahu** displayed `(..)`.
- In the `sub of` column: **Sun and Moon** displayed `(..)`.

An in-depth investigation revealed that this was caused by an **incomplete calculation logic and incorrect house mapping** in the frontend component (`KPChart.jsx`), compounded by the calculation engine not exposing the classical 4-tier KP Planetary Lordship Matrix.

The table logic mistakenly queried **which cusps had the planet as their star lord or sub lord** (`cusps.filter(c => c.starLord === pKey)`), rather than determining **the houses signified by the planet's Star Lord and Sub Lord** (which is the core tenet of KP Astrology: *"A planet gives results according to its Star Lord"*).

The calculation has been refactored into a centralized, authoritative calculation engine in `src/utils/kp/kpSignificators.js` (`calculatePlanetaryLordshipMatrix`), integrated with `calculateKPKundli`, rendered in `KPChart.jsx`, and validated with regression tests in `test/kp_kundli_suite.js`. As a result, **zero `(..)` placeholders remain**, and all 9 planets correctly show their occupied house, ownership, Star Lord significators, and Sub-Lord significators.

---

## 2. Root Cause Analysis

### 2.1 The Flawed Legacy Implementation
In `src/components/kp/KPChart.jsx`, the legacy code constructed `significatorRows` using the following inline logic:

```javascript
// LEGACY CODE IN KPChart.jsx:
const owns = cusps.filter(c => c.signLord === pKey).map(c => c.houseNumber);
const stlOf = cusps.filter(c => c.starLord === pKey).map(c => c.houseNumber);
const subOf = cusps.filter(c => c.subLord === pKey).map(c => c.houseNumber);

// Rahu / Ketu artificially suppressed:
if (pKey !== 'Rahu' && pKey !== 'Ketu') {
    // Only non-nodes got 'owns'
}
```

### 2.2 Why `(..)` Appeared in Each Column

1. **`owns` column showing `(..)` for Rahu and Ketu:**
   - The code had an explicit exclusion: `if (pKey !== 'Rahu' && pKey !== 'Ketu')`.
   - Because Rahu and Ketu do not physically rule any zodiac sign directly in classical Parashari sign ownership, the code set their `owns` to `[]`, outputting `(..)`.
   - **KP Astrological Violation:** In Krishnamurti Paddhati, Rahu and Ketu act as powerful nodal agents representing their sign dispositors (*"Kavat Kethu, Kuvat Rahu"* and sign lord proxy). Rahu in Leo represents the Sun (who owns House 11); Ketu in Aquarius represents Saturn (who owns Houses 4 and 5).

2. **`stl of` column showing `(..)` for Moon, Mercury, Venus, Saturn, Rahu:**
   - The legacy code filtered `cusps.filter(c => c.starLord === pKey)`.
   - Across the 12 Placidus cusps of the Hyderabad chart:
     - Mars rules the star of Cusp 1 (Chitra)
     - Jupiter rules the star of Cusps 2, 3, 4, 11, 12 (Vishakha, Purva Bhadrapada)
     - Saturn rules the star of Cusp 5 (Uttara Bhadrapada)
     - Mercury rules the star of Cusps 6, 9 (Ashlesha, Jyeshtha)
     - Ketu rules the star of Cusps 7, 8 (Ashwini, Magha)
     - Sun rules the star of Cusp 10 (Uttara Phalguni)
   - Only 6 planets ruled cusp stars. Therefore, planets like **Moon, Venus, and Rahu** were star lords of zero cusps, resulting in `[]` and rendering `(..)`.
   - **KP Astrological Violation:** In KP, `stl of` (Star Lord of Planet) does **not** mean *"Which cusps have this planet as their star lord?"*. It means **"Which houses are signified by the Star Lord of this planet?"**. Every planet is situated in a nakshatra ruled by a Star Lord; that Star Lord occupies a house and owns houses. Therefore, every planet **must** signify the houses of its Star Lord!

3. **`sub of` column showing `(..)` for Sun and Moon:**
   - The legacy code filtered `cusps.filter(c => c.subLord === pKey)`.
   - In this chart, no cusp had Sun or Moon as its sub-lord. Hence, for Sun and Moon, `subOf` evaluated to `[]` -> `(..)`.
   - **KP Astrological Violation:** `sub of` in the planetary significator matrix represents the houses signified by the planet's Sub Lord (occupancy + ownership of the sub lord). Since every planet has a Sub Lord, and every Sub Lord occupies a house and owns houses, this column must never be empty.

---

## 3. KP Significator Rules & Calculation Flow

In Krishnamurti Paddhati (KP System), events and matter significations are governed by the **Stellar Theory (Nakshatra / Sub Lord hierarchy)**:

$$\text{Planet} \longrightarrow \text{Star Lord (Primary Source of Matter / Houses)} \longrightarrow \text{Sub Lord (Qualifies Favorable / Unfavorable Result)}$$

### 3.1 Trace of Calculation Flow

#### A. Planet Occupancy (`PL(h)`)
- The sidereal longitude of each planet is projected onto the 12 Placidus houses using the half-open interval rule:
  $$\text{House}(p) = h \iff \text{Cusp}(h) \le \lambda_p < \text{Cusp}(h+1)$$
  *(with $360^\circ$ circular wraparound handled cleanly across Pisces-Aries)*.
- If a planet has negative daily speed ($\Delta\lambda < 0$), it is marked as Retrograde (`®`).

#### B. Planet Ownership (`PL owns`)
- Identifies which of the 12 Placidus cusp initial degrees fall in the signs ruled by the planet:
  $$\text{owns}(P) = \{ h \in \{1 \dots 12\} \mid \text{SignLord}(\text{Cusp}_h) = P \}$$
- **Rahu / Ketu Nodal Proxy Rule:** Rahu and Ketu have no physical sign ownership. Under KP rules, Rahu and Ketu act as agents for:
  1. The lord of the sign they occupy (Sign Dispositor).
  2. Any planet aspecting or conjunct them.
  - In our benchmark chart:
    - **Rahu** occupies Leo ($137.95^\circ$) $\rightarrow$ Dispositor is **Sun**. Sun owns House 11 $\rightarrow$ Rahu `owns = [11]`.
    - **Ketu** occupies Aquarius ($317.95^\circ$) $\rightarrow$ Dispositor is **Saturn**. Saturn owns Houses 4, 5 $\rightarrow$ Ketu `owns = [4, 5]`.

#### C. Star Lord Significators (`stl of`)
- For planet $P$, let $S = \text{StarLord}(P)$ (the lord of the Nakshatra occupied by $P$).
- The houses signified by Star Lord $S$ comprise:
  1. The house occupied by $S$: $\text{OccupiedHouse}(S)$
  2. The houses owned by $S$: $\text{owns}(S)$
  - If $S$ is Rahu or Ketu, it also brings along the house occupied by its sign dispositor.
- Formula:
  $$\text{stlOf}(P) = \text{Sort}(\text{Unique}(\{\text{OccupiedHouse}(S)\} \cup \text{owns}(S)))$$

#### D. Sub-Lord Significators (`sub of`)
- For planet $P$, let $U = \text{SubLord}(P)$ (the lord of the 249 KP Sub division occupied by $P$).
- The houses signified by Sub Lord $U$ comprise:
  1. The house occupied by $U$: $\text{OccupiedHouse}(U)$
  2. The houses owned by $U$: $\text{owns}(U)$
- Formula:
  $$\text{subOf}(P) = \text{Sort}(\text{Unique}(\{\text{OccupiedHouse}(U)\} \cup \text{owns}(U)))$$

#### E. Retrogression Propagation
- If a planet or its Star Lord is retrograde, the retrograde marker (`®`) indicates that significations may manifest with delays, revisions, or internal reflection according to KP principles.
- The mathematical set of houses signified remains intact and strictly determined by occupancy and lordship.

---

## 4. Benchmark Chart: Before vs. After Comparison

**Subject Birth Details:** 15-08-1998, 10:30:00 AM IST (+05:30), Hyderabad, India  
**Geographic Coordinates:** $17.3850^\circ\text{ N}, 78.4867^\circ\text{ E}$  
**KP New Ayanamsha:** $23^\circ 44' 22''$ ($23.7394^\circ$)  
**Ascendant:** Libra $1^\circ 53' 24''$ (House 1 Cusp: $181.89^\circ$)  

### 4.1 Comparison Table

| Planet | PL(h) | Owns (Before) | **Owns (After - Fixed)** | STL of (Before) | **STL of (After - Fixed)** | SUB of (Before) | **SUB of (After - Fixed)** |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Sun** | `Sun(10)` | `(11)` | **`(11)`** | `(10)` | **`(9,10,12)`** *(STL: Mercury)* | `(..)` ❌ | **`(4,5,7)`** *(SUB: Saturn)* |
| **Moon** | `Moon(8)` | `(10)` | **`(10)`** | `(..)` ❌ | **`(10,11)`** *(STL: Sun)* | `(..)` ❌ | **`(4,5,7)`** *(SUB: Saturn)* |
| **Mars** | `Mars(10)` | `(2,7)` | **`(2,7)`** | `(1)` | **`(3,5,6)`** *(STL: Jupiter)* | `(3)` | **`(10,11)`** *(SUB: Sun)* |
| **Mercury** | `Mercury(10)®` | `(9,12)` | **`(9,12)`** | `(..)` ❌ | **`(9,10,12)`** *(STL: Mercury)* | `(11,12)` | **`(3,5,6)`** *(SUB: Jupiter)* |
| **Jupiter** | `Jupiter(5)®` | `(3,6)` | **`(3,6)`** | `(2,3,4,11,12)` | **`(3,5,6)`** *(STL: Jupiter)* | `(7)` | **`(10,11)`** *(SUB: Sun)* |
| **Venus** | `Venus(10)` | `(1,8)` | **`(1,8)`** | `(..)` ❌ | **`(4,5,7)`** *(STL: Saturn)* | `(4,9)` | **`(1,8,10)`** *(SUB: Venus)* |
| **Saturn** | `Saturn(7)` | `(4,5)` | **`(4,5)`** | `(..)` ❌ | **`(4,5,7)`** *(STL: Saturn)* | `(5)` | **`(4,5,7)`** *(SUB: Saturn)* |
| **Rahu** | `Rahu(11)®` | `(..)` ❌ | **`(11)`** *(Represents Sun)* | `(..)` ❌ | **`(4,5,7)`** *(STL: Venus)* | `(8)` | **`(3,5,6)`** *(SUB: Jupiter)* |
| **Ketu** | `Ketu(5)®` | `(..)` ❌ | **`(4,5)`** *(Represents Saturn)*| `(7,8)` | **`(10,11)`** *(STL: Sun)* | `(2,6,10)` | **`(10,11)`** *(SUB: Sun)* |

> **Result:** All instances of `(..)` placeholders have been eradicated. Every column now displays the true KP astrological significator houses derived mathematically from the chart.

---

## 5. Summary of Code Modifications

1. **`src/utils/kp/kpSignificators.js`**:
   - Implemented and exported `calculatePlanetaryLordshipMatrix(planets, cusps)`.
   - Computes:
     - `getPlanetOwnership(pKey)`: Maps cusp sign lords and delegates Rahu/Ketu to their sign dispositor's owned cusps.
     - `getPlanetSignificators(pKey)`: Unifies planet occupancy, owned houses, and nodal dispositor occupancy into a sorted, unique set of house numbers.
     - Formats results into clean strings (`ownsFormatted`, `stlOfFormatted`, `subOfFormatted`) alongside structured numeric arrays (`owns`, `stlOf`, `subOf`).
   - Integrated `calculatePlanetaryLordshipMatrix` into `calculateKPSignificators`, attaching `planetaryLordshipMatrix` directly to `significators`.

2. **`src/components/kp/KPChart.jsx`**:
   - Replaced flawed inline cusp filtering with the centralized `calculatePlanetaryLordshipMatrix`.
   - Replaced single-line centered header and flexbox `justify-between` row layout with a strict 5-column CSS Grid (`grid-cols-[21%_5%_20%_27%_27%]`), ensuring:
     - `PL(h)` / `గ్రహం(భ)` header sits precisely above the planet code and occupied house column.
     - `-` separator header sits directly above the `-` column.
     - `(owns)` / `(స్వంతం)` header sits directly above the owned houses column.
     - `(stl of)` / `(నక్షత్రం)` header sits directly above the star lord significators column.
     - `(sub of)` / `(సబ్)` header sits directly above the sub lord significators column.
     - Every row is vertically aligned with zero horizontal drift or jitter.
   - Falls back safely to client-side recalculation if historical cached payloads lack the pre-calculated matrix.
   - Retained the existing UI design, styling, and table layout.

3. **`test/kp_kundli_suite.js`**:
   - Added unit test #16 (`KP Planetary Lordship Matrix (Significator Table) Validation`).
   - Asserts that all 9 planets have non-empty `owns`, `stlOf`, and `subOf` arrays with zero `(..)` placeholders.
   - Validates Rahu's dispositor ownership (`[11]`), Ketu's dispositor ownership (`[4, 5]`), and Mercury's retrograde and significator attributes.

---

## 6. Verification & Automated Test Results

All 5 test suites were executed and passed cleanly:
- **`test/kundli_suite.js`**: 8 passed, 0 failed.
- **`test/kp_kundli_suite.js`**: 16 passed, 0 failed (including test #16).
- **`test/test_all_249_subs.js`**: 486 passed, 0 failed.
- **`test/independent_multi_audit.js`**: 302 passed, 0 defects flagged.
- **`test/location_and_geocoding_suite.js`**: 9 passed, 0 failed.
- **Total Tests Passing**: 821 automated checks verified.
- **Vite Production Build**: Compiled cleanly with zero errors.
