import swisseph as swe
import json
import sys

# Reference Details:
# Date: 15 August 1998, 10:30 AM IST (05:00 UTC)
# Location: Hyderabad, Telangana, India
# Latitude: 17.3850 N, Longitude: 78.4867 E
# Mode: KP (Swiss Ephemeris mode SE_SIDM_KRISHNAMURTI = 5)
# House system: Placidus ('P')
# Node: Mean Node

year, month, day = 1998, 8, 15
hour = 5.0 # 05:00 UTC

jd_ut = swe.julday(year, month, day, hour)
swe.set_sid_mode(swe.SIDM_KRISHNAMURTI)
ayan = swe.get_ayanamsa_ut(jd_ut)

lat = 17.3850
lon = 78.4867

cusps_sid, ascmc_sid = swe.houses_ex(jd_ut, lat, lon, b'P', swe.FLG_SIDEREAL)

planets_to_calc = [
    ('Sun', swe.SUN),
    ('Moon', swe.MOON),
    ('Mars', swe.MARS),
    ('Mercury', swe.MERCURY),
    ('Jupiter', swe.JUPITER),
    ('Venus', swe.VENUS),
    ('Saturn', swe.SATURN),
    ('Rahu', swe.MEAN_NODE)
]

planet_results = {}
for name, pid in planets_to_calc:
    res, _ = swe.calc_ut(jd_ut, pid, swe.FLG_SIDEREAL | swe.FLG_SPEED)
    planet_results[name] = {
        'lon': res[0],
        'speed': res[3],
        'retro': bool(res[3] < 0)
    }

rahu_lon = planet_results['Rahu']['lon']
ketu_lon = (rahu_lon + 180.0) % 360.0
planet_results['Ketu'] = {
    'lon': ketu_lon,
    'speed': -0.05295,
    'retro': True
}

data = {
    'swe_version': swe.version,
    'ayan': ayan,
    'asc': ascmc_sid[0],
    'mc': ascmc_sid[1],
    'cusps': list(cusps_sid),
    'planets': planet_results
}

if '--json' in sys.argv:
    print(json.dumps(data, indent=2))
else:
    print(f"SWISSEPH_VERSION = {swe.version}")
    print(f"JD_UT = {jd_ut:.8f}")
    print(f"AYANAMSHA = {ayan:.8f}")
    print(f"ASCENDANT = {ascmc_sid[0]:.8f}")
    print(f"MC = {ascmc_sid[1]:.8f}")
    print("\nCUSPS:")
    for i in range(12):
        print(f"CUSP_{i+1} = {cusps_sid[i]:.8f}")
    print("\nPLANETS:")
    for name, pdata in planet_results.items():
        print(f"{name:8s} = {pdata['lon']:.8f} (speed={pdata['speed']:+.6f}, retro={pdata['retro']})")
