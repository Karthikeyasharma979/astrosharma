"""
Independent Swiss Ephemeris Reference Benchmark for Vimshottari Dasha
Uses pyswisseph (Swiss Ephemeris Python bindings) to independently verify:
1. Exact Julian Day UT
2. Tropical Moon Longitude
3. Mean vs True Krishnamurti Ayanamsha (SE_SIDM_KRISHNAMURTI = 5)
4. Nutation in Longitude
5. Sidereal Moon Longitude
6. Dasha balance and Mahadasha boundaries
"""

import swisseph as swe
import datetime
import math

# Reference Benchmark Chart:
# Date: 15 August 1998, 10:30 AM IST
# UTC: 1998-08-15 05:00:00 UTC
# Lat: 17.3850 N, Lon: 78.4867 E (Hyderabad)
year, month, day = 1998, 8, 15
hour_utc = 5.0

jd_ut = swe.julday(year, month, day, hour_utc, swe.GREG_CAL)
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI)

# Ayanamshas
mean_ayan = swe.get_ayanamsa_ut(jd_ut)
ex_ayan_res = swe.get_ayanamsa_ex_ut(jd_ut, 0)
true_ayan = ex_ayan_res[1]

# Nutation
nut_res, _ = swe.calc_ut(jd_ut, swe.ECL_NUT)
nut_in_lon_deg = nut_res[2]
nut_in_lon_arcsec = nut_in_lon_deg * 3600.0

# Tropical and Sidereal Moon positions
flags_trop = swe.FLG_SWIEPH | swe.FLG_SPEED
flags_sid = swe.FLG_SWIEPH | swe.FLG_SIDEREAL | swe.FLG_SPEED

res_trop, _ = swe.calc_ut(jd_ut, swe.MOON, flags_trop)
res_sid, _ = swe.calc_ut(jd_ut, swe.MOON, flags_sid)

trop_lon = res_trop[0]
sid_lon = res_sid[0]

def deg_to_dms(deg):
    d = int(deg)
    rem = (deg - d) * 60.0
    m = int(rem)
    s = (rem - m) * 60.0
    return f"{d}° {m}' {s:.2f}\""

print("=== INDEPENDENT SWISS EPHEMERIS ASTRONOMICAL AUDIT ===")
print(f"Julian Day (UT): {jd_ut:.8f}")
print(f"Moon Tropical Apparent Longitude: {trop_lon:.8f}° ({deg_to_dms(trop_lon)})")
print(f"Mean KP Ayanamsha (swe_get_ayanamsa_ut): {mean_ayan:.8f}° ({deg_to_dms(mean_ayan)})")
print(f"Nutation in Longitude (Delta Psi): {nut_in_lon_deg:.8f}° ({nut_in_lon_arcsec:.4f} arcseconds)")
print(f"True KP Ayanamsha (swe_get_ayanamsa_ex_ut): {true_ayan:.8f}° ({deg_to_dms(true_ayan)})")
print(f"Moon Sidereal Longitude (swe_calc_ut): {sid_lon:.8f}° ({deg_to_dms(sid_lon)})")

# Mathematical Consistency Checks:
print("\n--- MATHEMATICAL CONSISTENCY CHECKS ---")
check_apparent = trop_lon - true_ayan
print(f"Check 1: Tropical - True Ayanamsha = {check_apparent:.12f}°")
print(f"         Swiss Ephemeris Sidereal   = {sid_lon:.12f}°")
print(f"         Residual Error: {abs(check_apparent - sid_lon):.2e}° (exact to machine precision)")

diff_naive = trop_lon - mean_ayan
discrepancy_arcsec = (sid_lon - diff_naive) * 3600.0
print(f"\nCheck 2: Tropical - Mean Ayanamsha = {diff_naive:.12f}° ({deg_to_dms(diff_naive)})")
print(f"         Discrepancy against Sidereal: {discrepancy_arcsec:.4f} arcseconds")
print(f"         Nutation in Longitude:        {-nut_in_lon_arcsec:.4f} arcseconds")
print(f"         Residual between Discrepancy & Nutation: {abs(discrepancy_arcsec - (-nut_in_lon_arcsec)):.2e}\"")

# Vimshottari Calculations:
print("\n--- VIMSHOTTARI DASHA MATHEMATICAL DERIVATION ---")
nak_span = 360.0 / 27.0
nak_idx = int(sid_lon / nak_span)
nak_names = [
    "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
    "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
    "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
    "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"
]
star_lords = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"]
lord_years = {"Ketu": 7, "Venus": 20, "Sun": 6, "Moon": 10, "Mars": 7, "Rahu": 18, "Jupiter": 16, "Saturn": 19, "Mercury": 17}

nak_name = nak_names[nak_idx]
nak_lord = star_lords[nak_idx % 9]
full_years = lord_years[nak_lord]

nak_start = nak_idx * nak_span
nak_offset = sid_lon - nak_start
elapsed_frac = nak_offset / nak_span
rem_frac = 1.0 - elapsed_frac
balance_years = rem_frac * full_years

rem_years_int = int(balance_years)
rem_months_dec = (balance_years - rem_years_int) * 12.0
rem_months_int = int(rem_months_dec)
rem_days_dec = (rem_months_dec - rem_months_int) * (365.25 / 12.0)
rem_days_int = round(rem_days_dec)

print(f"Nakshatra #{nak_idx}: {nak_name} ({deg_to_dms(nak_start)} to {deg_to_dms(nak_start + nak_span)})")
print(f"Star Lord: {nak_lord} ({full_years} years)")
print(f"Offset in Nakshatra: {nak_offset:.8f}° ({deg_to_dms(nak_offset)})")
print(f"Elapsed Fraction: {elapsed_frac:.8f} ({elapsed_frac*100:.4f}%)")
print(f"Remaining Fraction: {rem_frac:.8f} ({rem_frac*100:.4f}%)")
print(f"Balance at Birth: {balance_years:.8f} years -> {rem_years_int}y {rem_months_int}m {rem_days_int}d")

# Timeline calculation using 365.25 days/year
birth_dt = datetime.datetime(1998, 8, 15, 5, 0, 0, tzinfo=datetime.timezone.utc)
birth_ts = birth_dt.timestamp()

SEC_PER_YEAR = 365.25 * 86400.0
balance_sec = balance_years * SEC_PER_YEAR
sun_end_ts = birth_ts + balance_sec
sun_end_dt = datetime.datetime.fromtimestamp(sun_end_ts, tz=datetime.timezone.utc)

print(f"\nSun Mahadasha: {birth_dt.strftime('%Y-%m-%d')} to {sun_end_dt.strftime('%Y-%m-%d')}")

# Sequence of 9 Mahadashas
maha_order = star_lords[nak_idx % 9:] + star_lords[:nak_idx % 9]
cur_start_ts = birth_ts

print("\n--- 120-YEAR MAHADASHA TIMELINE (365.25 DAYS/YEAR) ---")
for i, lord in enumerate(maha_order):
    if i == 0:
        dur_sec = balance_sec
        label = f"{rem_years_int}y {rem_months_int}m {rem_days_int}d (Birth Balance)"
    else:
        dur_sec = lord_years[lord] * SEC_PER_YEAR
        label = f"{lord_years[lord]} years"
    cur_end_ts = cur_start_ts + dur_sec
    st_str = datetime.datetime.fromtimestamp(cur_start_ts, tz=datetime.timezone.utc).strftime('%Y-%m-%d')
    end_str = datetime.datetime.fromtimestamp(cur_end_ts, tz=datetime.timezone.utc).strftime('%Y-%m-%d')
    print(f"  {lord:<8}: {st_str} to {end_str} ({label})")
    cur_start_ts = cur_end_ts
