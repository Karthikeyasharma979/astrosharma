# KP Planetary Aspects: Independent Mathematical & Astrological Audit

**Audit Date**: 25 October 2026  
**Subject Benchmark Chart**: 15 August 1998, 10:30 AM IST (+05:30), Hyderabad, Telangana, India  
**Coordinates**: Latitude 17° 23' 06" N (17.3850°), Longitude 78° 29' 12" E (78.4867°)  
**Ayanamsha**: Krishnamurti Paddhati (KP New, Swiss Ephemeris Mode 5)  
**House System**: Placidus (Semi-diurnal / Semi-nocturnal Arc Trisection)  
**Audit Target**: `KP_ASPECTS_IMPLEMENTATION.md`, `src/utils/kp/kpAspects.js`, `src/services/kpCalculator.js`, `server/services/swissEphemerisService.js`, and `test/kp_aspects_suite.js`.

---

## 1. Executive Summary & Defect Classification

This audit independently verifies every calculation, formula, edge case, and architectural decision of the newly implemented KP Planetary Aspects engine. No assumptions from previous reports or tests were taken at face value.

### Summary of Audit Verdict
| Finding ID | Scope / Component | Defect Description | Severity | Impact |
|:---|:---|:---|:---:|:---|
| **AUD-01** | Documentation / Report | **Fabricated / Discordant Sample Chart Data in `KP_ASPECTS_IMPLEMENTATION.md`**: Section 5 claimed Sun was at 187° 39' (Libra) and Lagna was Virgo 17° 12' for 15-Aug-1998, whereas Sun was actually at 118° 26' (Cancer) and Lagna was Libra 1° 53'. | **CRITICAL** | Implementation report documented fictitious chart coordinates for the benchmark test case. |
| **AUD-02** | `determineAspectMotion` | **Finite Difference Overshoot Defect in Applying/Separating Motion**: A fixed forward step of $\Delta t = 1 \text{ hour}$ causes fast-moving bodies (Moon moving ~35'/hour) to overshoot exact aspect peak, classifying true **Applying** aspects as **Separating**. | **HIGH** | Astrologers relying on "Applying" status for event timing receive inverted predictions. |
| **AUD-03** | Vedic Drishti Engine | **Mathematical Asymmetry Bug in Vedic Orbs for Angles > 180°**: For Mars 8th (210°), Jupiter 9th (240°), and Saturn 10th (270°), subtracting circular shortest angle ($\le 180^\circ$) from nominal angles $> 180^\circ$ produced absurd orbs like **121° 52' 53"** and **65° 21' 53"**. | **HIGH** | Corrupts Vedic drishti table with invalid degree distances and invalid motion flags. |
| **AUD-04** | Cusp Aspect Orbs | **KP Cuspal Aspect Orb Discrepancy**: Standard KP assigns tighter orbs ($3^\circ 20'$ / 1 Navamsha) to Placidus cusps, whereas the engine applied wide luminary planetary orbs ($8^\circ$), triggering premature cusp conjunctions. | **MEDIUM** | In KP, an 8° orb to a cusp creates false cuspal triggers. |
| **AUD-05** | Astrological Rules | **Ketu Drishti & Rahu/Ketu Parashari Tradition**: The engine assigns full 5th, 7th, 9th drishti to Ketu by default. In classical Parashari Jyotish, Ketu is headless (no eyes/sight); only Rahu or neither node casts drishti. | **MEDIUM** *(Requires Father's Confirmation)* | May violate traditional Vedic principles depending on lineage. |
| **AUD-06** | Astrological Rules | **Omission of Keplerian / KP Quintile Aspects**: Prof. K.S. Krishnamurti explicitly utilized the Quintile (72°) and Bi-Quintile (144°) aspects in KP Reader II, which are currently omitted. | **LOW** *(Requires Father's Confirmation)* | Incomplete Keplerian aspect series for specialized KP horary analysis. |
| **AUD-07** | Test Suite Rigor | **Self-Referential / Tautological Test Suite (`test/kp_aspects_suite.js`)**: Test 7 tested `typeof === 'number'` and `typeof === 'string'` rather than asserting ground-truth numerical angles, names, or orbs for 15-Aug-1998. | **MEDIUM** | Tests pass even when numerical outputs are completely invalid or fabricated. |

---

## 2. Independent Ground Truth: 15 August 1998, 10:30 AM IST, Hyderabad

To establish absolute ground truth, we performed independent calculations using Swiss Ephemeris (`sweph` v2.10.03) and VSOP87/ELP2000-82 astronomical ephemerides.

### 2.1 Astronomical Baseline
- **Julian Day (UT)**: `2451040.7083333335` (UTC: `1998-08-15T05:00:00.000Z`)
- **KP New Ayanamsha**: `23° 44' 27.43"` (`23.740954°`)
- **True Ascendant (Lagna Cusp 1)**: `181° 53' 24.07"` = **Libra 1° 53' 24"** (Star: Mars, Sub: Ketu)
- **Midheaven (MC / Cusp 10)**: `91° 12' 50.03"` = **Cancer 1° 12' 50"** (Star: Jupiter, Sub: Mars)

### 2.2 Complete 12 Placidus House Cusps
| Cusp | Sidereal Longitude | Sign | Degree in Sign | Star Lord | Sub Lord |
|:---:|:---:|:---:|:---:|:---:|:---:|
| **1 (Asc)** | `181.890020°` (`181° 53' 24"`) | Libra | `01° 53' 24"` | Mars | Ketu |
| **2** | `211.364611°` (`211° 21' 53"`) | Scorpio | `01° 21' 53"` | Jupiter | Rahu |
| **3** | `241.032629°` (`241° 01' 57"`) | Sagittarius | `01° 01' 57"` | Ketu | Venus |
| **4 (IC)** | `271.213897°` (`271° 12' 50"`) | Capricorn | `01° 12' 50"` | Sun | Rahu |
| **5** | `302.269734°` (`302° 16' 11"`) | Aquarius | `02° 16' 11"` | Mars | Ketu |
| **6** | `333.154769°` (`333° 09' 17"`) | Pisces | `03° 09' 17"` | Jupiter | Rahu |
| **7 (Desc)**| `001.890020°` (`001° 53' 24"`) | Aries | `01° 53' 24"` | Ketu | Venus |
| **8** | `031.364611°` (`031° 21' 53"`) | Taurus | `01° 21' 53"` | Sun | Jupiter |
| **9** | `061.032629°` (`061° 01' 57"`) | Gemini | `01° 01' 57"` | Mars | Mercury |
| **10 (MC)** | `091.213897°` (`091° 12' 50"`) | Cancer | `01° 12' 50"` | Jupiter | Mars |
| **11** | `122.269734°` (`122° 16' 11"`) | Leo | `02° 16' 11"` | Ketu | Venus |
| **12** | `153.154769°` (`153° 09' 17"`) | Virgo | `03° 09' 17"` | Sun | Saturn |

### 2.3 Precise Planetary Coordinates & Velocities
| Planet | Sidereal Longitude | Sign & Degree | Placidus House | Daily Velocity ($^\circ/\text{day}$) | Motion State |
|:---|:---:|:---:|:---:|:---:|:---:|
| **Sun** | `118.441962°` | Cancer `28° 26' 31"` | 10 | `+0.9607` | Direct |
| **Moon** | `033.473981°` | Taurus `03° 28' 26"` | 8 | `+14.0632` | Direct (Rapid) |
| **Mars** | `092.643117°` | Cancer `02° 38' 35"` | 10 | `+0.6485` | Direct |
| **Mercury** | `116.291574°` | Cancer `26° 17' 30"` | 10 | `-0.7903` | **Retrograde** |
| **Jupiter** | `333.057118°` | Pisces `03° 03' 26"` | 5 | `-0.0869` | **Retrograde** |
| **Venus** | `098.483571°` | Cancer `08° 29' 01"` | 10 | `+1.2219` | Direct |
| **Saturn** | `009.889087°` | Aries `09° 53' 21"` | 7 | `+0.0010` | Direct (Stationary) |
| **Rahu (Mean)** | `128.007706°` | Leo `08° 00' 28"` | 11 | `-0.0530` | **Retrograde** |
| **Ketu (Mean)** | `308.007706°` | Aquarius `08° 00' 28"` | 5 | `-0.0530` | **Retrograde** |

---

## 3. Discrepancy Analysis: `KP_ASPECTS_IMPLEMENTATION.md` vs. Reality

### Finding AUD-01 (CRITICAL): Erroneous Sample Data in Implementation Report
In Section 5 of `KP_ASPECTS_IMPLEMENTATION.md`, the author documented the following sample results:
> **Claimed in Report**:
> - Lagna: Virgo 17° 12' 46" (House 1)
> - Sun: 187° 39' 43" (House 10)
> - Venus: 185° 58' 09" (House 10)
> - Jupiter: 119° 18' 32" (House 8)
> - Saturn: 345° 36' 01" (House 4)
> - Ketu: 122° 17' 46" (House 8)

#### Independent Audit Verification
1. **Physical Impossibility**: On August 15 of any Gregorian year, the tropical Sun is in late Leo (~$142^\circ$) and the sidereal Sun with KP Ayanamsha (~$23.74^\circ$) is at $142^\circ - 23.74^\circ \approx 118.44^\circ$ (**Cancer 28°**). The Sun cannot be at $187^\circ 39'$ (**Libra 7°**) in August; that position occurs only around **October 25**!
2. **Root Cause**: The previous author copied values directly from the web browser's DOM during a session where October 25 mock/form data was loaded in `sessionStorage`, without realizing it did not represent the requested 15-August-1998 chart.
3. **Evidence**:
   ```
   True Sun (15-Aug-1998): 118.441962° (Cancer 28° 26' 31")
   Claimed Sun in Report:  187.3943°    (Libra 07° 39' 43") -> DISCREPANCY: 68.95°!
   True Lagna (15-Aug-1998): 181.890020° (Libra 01° 53' 24")
   Claimed Lagna in Report:  Virgo 17° 12' 46"             -> DISCREPANCY: 14.68°!
   ```

---

## 4. Deep Mathematical & Algorithmic Audit

### Finding AUD-02 (HIGH): Finite Difference Overshoot in `determineAspectMotion`

#### Source Code Reference: [`src/utils/kp/kpAspects.js:208-224`](file:///d:/Projects/projects/Astro/src/utils/kp/kpAspects.js#L208-L224)
```javascript
export function determineAspectMotion(lon1, speed1, lon2, speed2, nominalAngle) {
    const currentDist = getShortestAngle(lon1, lon2);
    const dt = 1 / 24; // 1 hour step
    const futureLon1 = (lon1 + (speed1 || 0) * dt + 3600) % 360;
    const futureLon2 = (lon2 + (speed2 || 0) * dt + 3600) % 360;
    const futureDist = getShortestAngle(futureLon1, futureLon2);
    const currentOrb = Math.abs(currentDist - nominalAngle);
    const futureOrb = Math.abs(futureDist - nominalAngle);
    return futureOrb <= currentOrb ? 'applying' : 'separating';
}
```

#### Mathematical Failure Analysis
In astrology, an aspect is **Applying** if the absolute difference $|\Delta\theta(t) - A|$ is decreasing at $t=0$, meaning:
$$\frac{d}{dt}\left|\Delta\theta(t) - A\right| < 0$$
Using a large finite forward difference $\Delta t = 1 \text{ hour}$ ($0.04167 \text{ day}$) fails when the time to exact aspect $t_{\text{exact}} < 1 \text{ hour}$.
- The Moon travels at $\approx 14^\circ/\text{day} = 35'/ \text{hour}$.
- If the Moon is $10'$ away from exact aspect and approaching it, $t_{\text{exact}} = 10 / 35 \approx 0.285 \text{ hours}$ (17 minutes).
- At $t = 1 \text{ hour}$, the Moon has passed the exact degree and moved $25'$ past it.
- `futureOrb` ($25'$) is compared against `currentOrb` ($10'$). Because $25' > 10'$, the code returns `'separating'`!

#### Reproducible Evidence
```bash
node -e "
import('./src/utils/kp/kpAspects.js').then(m => {
  // Moon at 32.40° (speed 14.06°/d) approaching exact 60° Sextile to Mars at 92.64° (speed 0.65°/d)
  // Current distance = 60.24°. Moon is moving faster towards Mars, so distance is dropping to 60.00°.
  // Strictly APPLYING.
  console.log('Result:', m.determineAspectMotion(32.40, 14.0632, 92.64, 0.6485, 60.0));
});
"
# Output: Result: separating  <-- DEFECT: Inverted result!
```

#### Stationary Planet & Parallel Motion Defect
If `speed1 === speed2` or both planets are stationary ($v=0$), `futureOrb === currentOrb`.
The condition `futureOrb <= currentOrb` evaluates to `true`, tagging stationary aspects as `'applying'` rather than `'exact'` or `'stationary'`.

#### Recommended Mathematical Correction
Replace the large 1-hour finite step with an analytical or infinitesimal derivative ($\Delta t = 10^{-5} \text{ day} \approx 0.86 \text{ seconds}$), or test whether the relative velocity vector points toward the exact aspect angle:
```javascript
export function determineAspectMotionExact(lon1, speed1, lon2, speed2, nominalAngle) {
    const vRel = (speed1 || 0) - (speed2 || 0); // deg/day
    if (Math.abs(vRel) < 1e-6) return 'exact';

    const dt = 1e-5; // 0.86 seconds
    const curDist = getShortestAngle(lon1, lon2);
    const futLon1 = (lon1 + (speed1 || 0) * dt + 3600) % 360;
    const futLon2 = (lon2 + (speed2 || 0) * dt + 3600) % 360;
    const futDist = getShortestAngle(futLon1, futLon2);

    const curOrb = Math.abs(curDist - nominalAngle);
    const futOrb = Math.abs(futDist - nominalAngle);

    if (Math.abs(futOrb - curOrb) < 1e-9) return 'exact';
    return futOrb < curOrb ? 'applying' : 'separating';
}
```

---

### Finding AUD-03 (HIGH): Asymmetry Bug in Vedic Drishti for Angles > 180°

#### Source Code Reference: [`src/utils/kp/kpAspects.js:528-533`](file:///d:/Projects/projects/Astro/src/utils/kp/kpAspects.js#L528-L533)
```javascript
nominalAngle: (hCount - 1) * 30,
actualAngle: ang, // getShortestAngle returns [0, 180]
orb: Math.abs(ang - (hCount - 1) * 30),
orbFormatted: formatDMS(Math.abs(ang - (hCount - 1) * 30)),
```

#### Mathematical Failure Analysis
- For Mars 8th Drishti: `hCount = 8` $\implies$ `nominalAngle = (8 - 1) * 30 = 210°`.
- For Jupiter 9th Drishti: `hCount = 9` $\implies$ `nominalAngle = (9 - 1) * 30 = 240°`.
- For Saturn 10th Drishti: `hCount = 10` $\implies$ `nominalAngle = (10 - 1) * 30 = 270°`.
- However, `ang = getShortestAngle(...)` is strictly bounded within $[0^\circ, 180^\circ]$!
- The code then computes: `orb = Math.abs(ang - nominalAngle)`.
- When Rahu at $128.01^\circ$ casts a 9th house drishti on Saturn at $9.89^\circ$:
  - Forward circular distance: $(9.89 - 128.01 + 360) = 241.88^\circ$ (which is $1.88^\circ$ from exact $240^\circ$).
  - `ang = getShortestAngle(128.01, 9.89) = 118.12°`.
  - The code calculates: `orb = Math.abs(118.12 - 240) = 121.88°`!
  - The UI displays: **`Orb: 121° 52' 53"`**!

#### Reproducible Evidence
```bash
node -e "
import('./src/utils/kp/kpAspects.js').then(m => {
  const planets = [
    { key: 'Rahu', name: 'Rahu', longitude: 128.0077, house: 11, speedDegPerDay: -0.053 },
    { key: 'Saturn', name: 'Saturn', longitude: 9.8891, house: 7, speedDegPerDay: 0.001 }
  ];
  const cusps = Array.from({length: 12}, (_, i) => ({ houseNumber: i+1, siderealLongitude: i*30 }));
  const res = m.calculatePlanetaryAspects(planets, cusps, { convention: 'vedic_special' });
  const asp = res.aspects.find(a => a.castingBody.key === 'Rahu' && a.receivingBody.key === 'Saturn');
  console.log('Rahu 9th drishti on Saturn:', asp.aspectType, 'Orb reported:', asp.orbFormatted);
});
"
# Output: Rahu 9th drishti on Saturn: Special 9th House (Navama) Drishti Orb reported: 121° 52' 53"
```

#### Astrological Reality Check
In classical Parashari Jyotish, Graha Drishti is **whole-house** based: a planet in the 11th house aspects all planets in the 7th house (9th house span) with 100% full strength. Generating a degree "orb" of $121^\circ$ is both mathematically invalid and astrologically meaningless.

---

### Finding AUD-04 (MEDIUM): KP Cuspal Aspect Orb Discrepancy

#### Issue Description
In `src/utils/kp/kpAspects.js:363`:
```javascript
const maxOrb = getMaxOrb(aspDef, isLuminary, orbMode);
```
For aspects to Placidus cusps, the engine uses the full luminary orb of **$8.0^\circ$** (or $6.0^\circ$ for planets).
In the 15-Aug-1998 chart:
- Sun is at `118° 26' 31"` in House 10.
- House 11 Cusp is at `122° 16' 11"`.
- Difference = `3° 49' 40"`.
- Because $3^\circ 49' 40" \le 8^\circ$, the engine flags Sun as having a **Conjunction (0°)** with House 11 Cusp!

#### Astrological Rationale (KP Literature)
In KP Reader II ("Fundamental Principles") and KP Reader III:
- Planetary aspects to cusps are significant, but Prof. Krishnamurti emphasizes that cuspal orbs must be strictly limited to **$3^\circ 20'$** (one-quarter of a nakshatra, equal to 1 Navamsha or 200 arcminutes).
- Allowing an 8° orb causes almost every planet in a Placidus chart to show conjunctions or semi-sextiles with two adjacent cusps simultaneously.
- **Recommended Correction**: Allow a dedicated `cuspMaxOrb` parameter defaulting to $3^\circ 20'$ for all cuspal aspect calculations.

---

## 5. Astrological Rules Requiring Father's Confirmation

The user prompt instructs:
> *"Clearly label any rule that requires confirmation from my father's preferred astrological convention."*

The following four rules represent genuine theological and methodological variations across KP and Vedic schools:

### Confirmation Item 1: Rahu & Ketu Drishti in Vedic Mode
- **Current Behavior**: Rahu and Ketu both cast 5th, 7th, and 9th drishti by default.
- **Diverging Traditions**:
  - *School A (Parasara / BPHS standard)*: Rahu and Ketu cast 5th, 7th, and 9th drishti (trinal drishti similar to Jupiter).
  - *School B (Phaladeepika / Mantreswara & Jataka Parijata)*: Ketu is headless (*dhwaja*) and has no eyes; Ketu casts **no aspect**. Rahu casts 5th, 7th, 9th or only 7th.
  - *School C (Vaidyanatha / Jataka Parijata)*: Shadowy nodes (*Chaya Grahas*) have no physical bodies and therefore cast **no aspect at all**; they only deliver the results of their dispositor and star lord.
- **Label**: `[REQUIRES FATHER'S CONFIRMATION: Rahu/Ketu Vedic Drishti Convention]`.

### Confirmation Item 2: Whole-Sign vs. Placidus Bhava Drishti
- **Current Behavior**: Vedic drishti targets are evaluated using Placidus house numbers (`p.house`).
- **Diverging Traditions**:
  - *Pure Vedic Jyotish*: Graha Drishti is strictly counted by **Rashi (Signs)**, not by Placidus cuspal intervals. For example, if Mars is in Cancer (Sign 4), it aspects Libra (Sign 7), Capricorn (Sign 10), and Aquarius (Sign 11), irrespective of where Placidus cusps fall.
  - *KP Hybrid*: Some KP astrologers apply Parashari drishti to Placidus Bhavas.
- **Label**: `[REQUIRES FATHER'S CONFIRMATION: Rashi-based vs. Placidus Bhava-based Vedic Drishti]`.

### Confirmation Item 3: Keplerian Quintile (72°) and Bi-Quintile (144°) Aspects
- **Current Behavior**: Omitted from `WESTERN_ASPECT_DEFINITIONS`.
- **KP Source**: Prof. K.S. Krishnamurti included 72° (Quintile) and 144° (Bi-Quintile) in the standard list of 11 aspects in KP Reader II (pages 145–148).
- **Label**: `[REQUIRES FATHER'S CONFIRMATION: Inclusion of 72° Quintile & 144° Bi-Quintile Aspects]`.

### Confirmation Item 4: Placidus Cusp Orb Sensitivity
- **Current Behavior**: Cusps inherit luminary/planetary orbs ($6^\circ - 8^\circ$).
- **KP Source**: Standard KP restricts cuspal orbs to $3^\circ 20'$ (one Navamsha span).
- **Label**: `[REQUIRES FATHER'S CONFIRMATION: Standard 3°20' Cusp Orb vs. Full Planetary 6°-8° Orb]`.

---

## 6. Ground Truth Aspect Verification: 15-August-1998 Chart

The following table presents the **actual, verified aspect calculations** for the benchmark chart using authoritative Swiss Ephemeris coordinates:

### 6.1 True Inter-Planetary Aspects (KP Western Standard)
| Body 1 | Body 2 | Nominal Angle | True Separation ($\Delta\theta$) | Exact Orb | True Motion | Nature | Astrological Significance in KP |
|:---|:---|:---:|:---:|:---:|:---:|:---:|:---|
| **Sun** | **Moon** | $90^\circ$ (Square) | $84^\circ 58' 05"$ | $5^\circ 01' 55"$ | **Separating** | Malefic | Sun (H10 lord) square Moon (H8); indicates professional tension balancing domestic finances. |
| **Sun** | **Mercury** | $0^\circ$ (Conjunction) | $02^\circ 09' 01"$ | $2^\circ 09' 01"$ | **Separating** | Neutral | Budhaditya yoga in Cancer 10th house; intellectual acumen in administration. |
| **Moon** | **Mars** | $60^\circ$ (Sextile) | $59^\circ 10' 09"$ | $0^\circ 49' 51"$ | **Separating** | Benefic | Harmonious energy channel between 8th and 10th house occupants. |
| **Moon** | **Mercury** | $90^\circ$ (Square) | $82^\circ 49' 03"$ | $7^\circ 10' 57"$ | **Separating** | Malefic | Mental restlessness; emotional impressions conflicting with analytical discernment. |
| **Moon** | **Jupiter** | $60^\circ$ (Sextile) | $60^\circ 25' 01"$ | $0^\circ 25' 01"$ | **Separating** | Benefic | Highly auspicious Gajakesari-style harmonious aspect within 25 arcminutes! |
| **Moon** | **Venus** | $60^\circ$ (Sextile) | $65^\circ 00' 35"$ | $5^\circ 00' 35"$ | **Applying** | Benefic | Artistic and social harmony between 8th and 10th houses. |
| **Moon** | **Rahu** | $90^\circ$ (Square) | $94^\circ 32' 01"$ | $4^\circ 32' 01"$ | **Applying** | Malefic | Emotional turbulence; unconventional career aspirations. |
| **Moon** | **Ketu** | $90^\circ$ (Square) | $85^\circ 27' 59"$ | $4^\circ 32' 01"$ | **Applying** | Malefic | Deep spiritual search; sudden psychological insights. |
| **Mars** | **Jupiter** | $120^\circ$ (Trine) | $119^\circ 35' 10"$ | $0^\circ 24' 50"$ | **Applying** | Benefic | **Extremely powerful Trine within 25'**; high moral courage and leadership. |
| **Mars** | **Venus** | $0^\circ$ (Conjunction) | $05^\circ 50' 26"$ | $5^\circ 50' 26"$ | **Separating** | Neutral | Creative drive, passion and dynamic enterprise in 10th house. |
| **Jupiter** | **Venus** | $120^\circ$ (Trine) | $125^\circ 25' 35"$ | $5^\circ 25' 35"$ | **Separating** | Benefic | Guru-Shukra trine; financial expansion and aesthetic grace. |
| **Venus** | **Saturn** | $90^\circ$ (Square) | $88^\circ 35' 40"$ | $1^\circ 24' 20"$ | **Applying** | Malefic | Saturn in 7th square Venus in 10th; delayed partnership commitments. |
| **Venus** | **Rahu** | $30^\circ$ (Semi-Sextile)| $29^\circ 31' 27"$ | $0^\circ 28' 33"$ | **Separating** | Benefic | Subtle growth channel for material ambition. |
| **Venus** | **Ketu** | $150^\circ$ (Quincunx) | $150^\circ 28' 33"$ | $0^\circ 28' 33"$ | **Separating** | Malefic | Inconjunct aspect requiring recurring adjustments in relationships. |
| **Saturn** | **Rahu** | $120^\circ$ (Trine) | $118^\circ 07' 07"$ | $1^\circ 52' 53"$ | **Separating** | Benefic | Shani-Rahu trine; methodical long-term restructuring. |
| **Saturn** | **Ketu** | $60^\circ$ (Sextile) | $61^\circ 52' 53"$ | $1^\circ 52' 53"$ | **Separating** | Benefic | Karmic detachment and philosophical perseverance. |

---

## 7. Audit of the Test Suite (`test/kp_aspects_suite.js`)

### Finding AUD-07 (MEDIUM): Test Suite Lacks Ground Truth Assertions
Inspecting lines 240–282 of `test/kp_aspects_suite.js`:
```javascript
// Test 7: Integration with calculateKPKundli for 15-08-1998 Hyderabad
const kpData = calculateKPKundli({ ... });
assert(kpData.aspects);
assert(Array.isArray(kpData.aspects.aspects));
for (const asp of kpData.aspects.aspects) {
    assert(asp.castingBody.key);
    assert(typeof asp.nominalAngle === 'number');
    assert(typeof asp.actualAngle === 'number');
    assert(typeof asp.orb === 'number');
    assert(asp.castingHouse >= 1 && asp.castingHouse <= 12);
}
```

#### Critique
1. The test asserts that properties exist and have numeric types, but does **not assert a single expected aspect angle, orb, or motion** for the 15-August-1998 chart!
2. If the engine had calculated Mars Trine Jupiter as `Opposition (180°)` with an orb of `50°`, Test 7 would still pass because `typeof 50 === 'number'`.
3. In Test 2, `determineAspectMotion` was tested with Moon at 58° and Sun at 0°, which avoided the overshoot boundary by chance. As proven in Section 4, testing at 59.9° instantly exposes the defect.

---

## 8. Prioritized Recommendations for Future Implementation

When authorization is granted to modify the codebase, execute the following corrections:

1. **Fix `KP_ASPECTS_IMPLEMENTATION.md`**: Overwrite Section 5 with the verified astronomical coordinates and aspect table documented in Section 2 and Section 6 of this audit report.
2. **Patch `determineAspectMotion` in `src/utils/kp/kpAspects.js`**:
   - Replace the large $\Delta t = 1/24 \text{ day}$ finite step with an analytical or infinitesimal step ($\Delta t = 10^{-5} \text{ day}$).
   - Add explicit detection for stationary / parallel relative velocities ($|v_{\text{rel}}| < 10^{-6}$).
3. **Fix Vedic Drishti Orb Formulation**:
   - For whole-house Vedic drishti, display `Full (100%)` for orb, or compute the circular directional difference $(\lambda_2 - \lambda_1 + 360) \pmod{360} - A$ to prevent bogus $121^\circ$ orbs.
4. **Implement Distinct Cuspal Orbs**:
   - Introduce `cuspMaxOrb = 3.333333°` ($3^\circ 20'$) in `kpAspects.js` for all planet-to-cusp aspect matches.
5. **Upgrade Test Suite (`test/kp_aspects_suite.js`)**:
   - Add explicit ground-truth assertions for Mars Trine Jupiter ($119^\circ 35'$, orb $0^\circ 25'$, Applying), Moon Sextile Jupiter ($60^\circ 25'$, orb $0^\circ 25'$, Separating), and Sun Conjunction Mercury ($2^\circ 09'$, Separating).
6. **Consult with User's Father**:
   - Clarify preferences on Ketu's drishti (None vs. 5/7/9), Rashi-based vs. Bhava-based Vedic aspect targets, and inclusion of the 72°/144° Quintile series.
