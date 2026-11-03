import swisseph as swe
import json
import sys

# Test Cases
test_cases = [
    {
        "id": "case1_hyderabad",
        "name": "Hyderabad (Standard Indian)",
        "year": 1998, "month": 8, "day": 15, "hour_utc": 5.0, # 10:30 IST
        "lat": 17.3850, "lon": 78.4867,
        "date_str": "1998-08-15", "time_str": "10:30", "timezone": "Asia/Kolkata"
    },
    {
        "id": "case2_dallas",
        "name": "Dallas (USA / CDT DST / West Lon)",
        "year": 2024, "month": 6, "day": 21, "hour_utc": 20.75, # 15:45 CDT (UTC-5) -> 20:45 UTC
        "lat": 32.7767, "lon": -96.7970,
        "date_str": "2024-06-21", "time_str": "15:45", "timezone": "America/Chicago"
    },
    {
        "id": "case3_sydney",
        "name": "Sydney (Southern Hemisphere / AEDT DST)",
        "year": 1985, "month": 12, "day": 24, "hour_utc": 17.25, # 1985-12-25 04:15 AEDT (UTC+11) -> Dec 24 17:15 UTC
        "lat": -33.8688, "lon": 151.2093,
        "date_str": "1985-12-25", "time_str": "04:15", "timezone": "Australia/Sydney"
    },
    {
        "id": "case4_london",
        "name": "London (Prime Meridian / J2000 Epoch)",
        "year": 2000, "month": 1, "day": 1, "hour_utc": 12.0, # 12:00 UTC
        "lat": 51.5074, "lon": -0.1278,
        "date_str": "2000-01-01", "time_str": "12:00", "timezone": "Europe/London"
    },
    {
        "id": "case5_singapore",
        "name": "Singapore (Equatorial Latitude)",
        "year": 2015, "month": 3, "day": 19, "hour_utc": 16.0, # 2015-03-20 00:00 SGT (UTC+8) -> Mar 19 16:00 UTC
        "lat": 1.3521, "lon": 103.8198,
        "date_str": "2015-03-20", "time_str": "00:00", "timezone": "Asia/Singapore"
    },
    {
        "id": "case6_reykjavik",
        "name": "Reykjavik (High Latitude 64N Placidus Stress)",
        "year": 1990, "month": 7, "day": 15, "hour_utc": 18.5, # 18:30 UTC
        "lat": 64.1466, "lon": -21.9426,
        "date_str": "1990-07-15", "time_str": "18:30", "timezone": "UTC"
    },
    {
        "id": "case7_tromso",
        "name": "Tromso (Extreme Polar Latitude 69.6N Fallback)",
        "year": 2005, "month": 6, "day": 21, "hour_utc": 12.0, # 12:00 UTC
        "lat": 69.6492, "lon": 18.9553,
        "date_str": "2005-06-21", "time_str": "12:00", "timezone": "UTC"
    },
    {
        "id": "case8_delhi_1947",
        "name": "New Delhi (Historic 1947 Midnight Independence)",
        "year": 1947, "month": 8, "day": 14, "hour_utc": 18.5, # 1947-08-15 00:00 IST -> Aug 14 18:30 UTC
        "lat": 28.6139, "lon": 77.2090,
        "date_str": "1947-08-15", "time_str": "00:00", "timezone": "Asia/Kolkata"
    }
]

planets_to_calc = [
    ('Sun', swe.SUN),
    ('Moon', swe.MOON),
    ('Mars', swe.MARS),
    ('Mercury', swe.MERCURY),
    ('Jupiter', swe.JUPITER),
    ('Venus', swe.VENUS),
    ('Saturn', swe.SATURN),
    ('Rahu_Mean', swe.MEAN_NODE),
    ('Rahu_True', swe.TRUE_NODE)
]

results = {}

for tc in test_cases:
    jd_ut = swe.julday(tc['year'], tc['month'], tc['day'], tc['hour_utc'])
    
    # 1. Vedic (Lahiri mode)
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    lahiri_ayan = swe.get_ayanamsa_ut(jd_ut)
    
    # 2. KP (Krishnamurti mode 5)
    swe.set_sid_mode(swe.SIDM_KRISHNAMURTI)
    kp_ayan = swe.get_ayanamsa_ut(jd_ut)
    
    # KP Placidus Houses
    # For high latitudes, swe.houses_ex may fail or return Porphyry
    try:
        cusps_kp, ascmc_kp = swe.houses_ex(jd_ut, tc['lat'], tc['lon'], b'P', swe.FLG_SIDEREAL)
        cusps_kp_list = list(cusps_kp)
        asc_kp = ascmc_kp[0]
        mc_kp = ascmc_kp[1]
        armc_kp = ascmc_kp[2]
        house_error = None
    except Exception as e:
        cusps_kp_list = None
        asc_kp = None
        mc_kp = None
        armc_kp = None
        house_error = str(e)
    
    # KP Planets
    kp_planets = {}
    for name, pid in planets_to_calc:
        res, _ = swe.calc_ut(jd_ut, pid, swe.FLG_SIDEREAL | swe.FLG_SPEED)
        kp_planets[name] = {
            'lon': res[0],
            'speed': res[3],
            'retro': bool(res[3] < 0)
        }
    kp_planets['Ketu_Mean'] = {
        'lon': (kp_planets['Rahu_Mean']['lon'] + 180.0) % 360.0,
        'speed': -0.05295,
        'retro': True
    }
    kp_planets['Ketu_True'] = {
        'lon': (kp_planets['Rahu_True']['lon'] + 180.0) % 360.0,
        'speed': kp_planets['Rahu_True']['speed'],
        'retro': kp_planets['Rahu_True']['retro']
    }

    # Vedic (Lahiri) Planets
    swe.set_sid_mode(swe.SIDM_LAHIRI)
    vedic_planets = {}
    for name, pid in planets_to_calc:
        res, _ = swe.calc_ut(jd_ut, pid, swe.FLG_SIDEREAL | swe.FLG_SPEED)
        vedic_planets[name] = {
            'lon': res[0],
            'speed': res[3],
            'retro': bool(res[3] < 0)
        }
    vedic_planets['Ketu_Mean'] = {
        'lon': (vedic_planets['Rahu_Mean']['lon'] + 180.0) % 360.0,
        'speed': -0.05295,
        'retro': True
    }
    # Vedic Ascendant
    _, ascmc_vedic = swe.houses_ex(jd_ut, tc['lat'], tc['lon'], b'W', swe.FLG_SIDEREAL) # Whole sign
    vedic_asc = ascmc_vedic[0]

    results[tc['id']] = {
        "case": tc,
        "jd_ut": jd_ut,
        "lahiri_ayanamsha": lahiri_ayan,
        "kp_ayanamsha": kp_ayan,
        "vedic_ascendant": vedic_asc,
        "vedic_planets": vedic_planets,
        "kp_ascendant": asc_kp,
        "kp_mc": mc_kp,
        "kp_armc": armc_kp,
        "kp_cusps": cusps_kp_list,
        "kp_planets": kp_planets,
        "house_error": house_error
    }

output_json = json.dumps(results, indent=2)
with open('test/swe_multi_ref.json', 'w', encoding='utf-8') as f:
    f.write(output_json)

if '--print' in sys.argv:
    print(output_json)
else:
    print(f"Generated test/swe_multi_ref.json successfully with {len(results)} test cases.")
