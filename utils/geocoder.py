"""
MapMyCareer | Delhi NCR Geo-Spatial Job Radar
Location Geocoding & Local SQLite Caching Module
Provides geocoding via Geopy (Nominatim) with persistent SQLite caching,
coordinate jittering for overlapping points, and offline fallback dictionaries.
"""

import hashlib
import logging
import os
import random
import sqlite3
from typing import Dict, List, Optional, Tuple

logger = logging.getLogger(__name__)

# Fallback coordinates for key Delhi NCR corridors (ensures offline reliability)
NCR_FALLBACK_HUBS: Dict[str, Tuple[float, float, str]] = {
    # Gurugram
    "cyber city": (28.4950, 77.0895, "DLF Cyber City, DLF Phase 2, Sector 24, Gurugram, Haryana"),
    "dlf cyberhub": (28.4950, 77.0895, "DLF CyberHub, DLF Cyber City, Gurugram, Haryana"),
    "golf course road": (28.4752, 77.0935, "Horizon Center, Golf Course Road, DLF Phase 5, Gurugram, Haryana"),
    "horizon center": (28.4752, 77.0935, "One Horizon Center, Golf Course Road, Gurugram, Haryana"),
    "golf course ext": (28.4150, 77.0780, "Golf Course Extension Road, Sector 65, Gurugram, Haryana"),
    "udyog vihar": (28.5033, 77.0833, "Udyog Vihar Phase 1-5, Gurugram, Haryana"),
    "sector 44": (28.4550, 77.0700, "Sector 44 Institutional Area, Gurugram, Haryana"),
    "candor sector 48": (28.4190, 77.0390, "Candor TechSpace, Sector 48, Gurugram, Haryana"),
    "candor sector 21": (28.5130, 77.0720, "Candor TechSpace, Sector 21, Gurugram, Haryana"),
    "unitech cyber park": (28.4480, 77.0540, "Unitech Cyber Park, Sector 39, Gurugram, Haryana"),
    "manesar": (28.3580, 76.9370, "IMT Manesar, Gurugram, Haryana"),
    "sohna road": (28.4120, 77.0420, "Sohna Road, Gurugram, Haryana"),

    # Noida
    "sector 62": (28.6270, 77.3725, "Logix / Stellar IT Park, Sector 62, Noida, Uttar Pradesh"),
    "sector 125": (28.5447, 77.3330, "Sector 125/126, Noida-Greater Noida Expressway, Noida, UP"),
    "sector 126": (28.5447, 77.3330, "Sector 126, Noida, Uttar Pradesh"),
    "sector 135": (28.5005, 77.4080, "Candor TechSpace / Expressway, Sector 135, Noida, UP"),
    "sector 16": (28.5750, 77.3180, "Film City / Metro, Sector 16/16A, Noida, Uttar Pradesh"),
    "sector 142": (28.5020, 77.4200, "Advant Navis Business Park, Sector 142, Noida, UP"),
    "sector 144": (28.5020, 77.4200, "Oxygen SEZ, Sector 144, Noida, UP"),
    "sector 59": (28.6080, 77.3650, "Sector 59 IT Hub, Noida, Uttar Pradesh"),

    # Delhi
    "aerocity": (28.5502, 77.1215, "Worldmark Hospitality & Commercial District, Aerocity, New Delhi"),
    "worldmark": (28.5502, 77.1215, "Worldmark 1-3, Aerocity, New Delhi"),
    "okhla": (28.5420, 77.2730, "Okhla Industrial Area Phase III, South Delhi, New Delhi"),
    "saket": (28.5284, 77.2185, "Saket District Centre, South Delhi, New Delhi"),
    "connaught place": (28.6315, 77.2200, "Connaught Place (Barakhamba / KG Marg), Central Delhi, New Delhi"),
    "jasola": (28.5390, 77.2880, "Jasola District Centre, South Delhi, New Delhi"),
    "netaji subhash place": (28.6980, 77.1520, "Netaji Subhash Place (Pitampura), North West Delhi, Delhi"),
    "nehru place": (28.5490, 77.2520, "Nehru Place Financial & IT District, South Delhi, New Delhi")
}


def apply_jitter(
    lat: float,
    lon: float,
    max_jitter: float = 0.002,
    seed_str: Optional[str] = None
) -> Tuple[float, float]:
    """
    Applies a small mathematical jitter (+/- max_jitter) to latitude and longitude
    to prevent exact overlap of marker pins in dense tech parks.

    If seed_str is provided, the jitter is deterministic across re-renders.
    """
    if seed_str:
        h = hashlib.sha256(seed_str.encode("utf-8")).hexdigest()
        jitter_lat_raw = (int(h[0:8], 16) / 0xFFFFFFFF) * 2 - 1
        jitter_lon_raw = (int(h[8:16], 16) / 0xFFFFFFFF) * 2 - 1
        return (
            lat + (jitter_lat_raw * max_jitter),
            lon + (jitter_lon_raw * max_jitter)
        )
    else:
        return (
            lat + random.uniform(-max_jitter, max_jitter),
            lon + random.uniform(-max_jitter, max_jitter)
        )


class GeoCoder:
    """
    SQLite-backed persistent Geocoding manager with Geopy Nominatim integration.
    """

    def __init__(self, db_path: str = "locations.db"):
        self.db_path = db_path
        self._init_db()
        self._geolocator = None

    def _init_db(self):
        """Creates the geocache table if it does not exist."""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    CREATE TABLE IF NOT EXISTS geocache (
                        query TEXT PRIMARY KEY,
                        lat REAL NOT NULL,
                        lon REAL NOT NULL,
                        display_name TEXT,
                        source TEXT DEFAULT 'nominatim',
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                """)
                conn.commit()
        except Exception as e:
            logger.error(f"Error initializing SQLite geocache at {self.db_path}: {e}")

    def _get_geolocator(self):
        """Lazy loader for geopy Nominatim."""
        if self._geolocator is None:
            try:
                from geopy.geocoders import Nominatim
                self._geolocator = Nominatim(user_agent="mapmycareer_ncr_v1", timeout=6)
            except ImportError:
                logger.warning("geopy is not installed. Using local cache and fallback dictionary.")
                self._geolocator = None
        return self._geolocator

    def get_from_cache(self, query: str) -> Optional[Tuple[float, float, str, str]]:
        """Retrieve coordinates from SQLite cache."""
        clean_query = query.strip().lower()
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute(
                    "SELECT lat, lon, display_name, source FROM geocache WHERE query = ?",
                    (clean_query,)
                )
                row = cursor.fetchone()
                if row:
                    return (row[0], row[1], row[2], row[3])
        except Exception as e:
            logger.error(f"Cache lookup failed for '{query}': {e}")
        return None

    def save_to_cache(self, query: str, lat: float, lon: float, display_name: str, source: str = "nominatim"):
        """Save a geocoded result to SQLite cache."""
        clean_query = query.strip().lower()
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT OR REPLACE INTO geocache (query, lat, lon, display_name, source)
                    VALUES (?, ?, ?, ?, ?)
                """, (clean_query, lat, lon, display_name, source))
                conn.commit()
        except Exception as e:
            logger.error(f"Failed to cache geocode result for '{query}': {e}")

    def geocode(
        self,
        query: str,
        city_hint: Optional[str] = "Delhi NCR, India",
        default_lat: float = 28.5355,
        default_lon: float = 77.2500
    ) -> Tuple[float, float, str, str]:
        """
        Geocodes a location query:
        1. Checks SQLite local cache.
        2. Checks NCR fallback dictionary for instant match.
        3. Invokes Geopy Nominatim with rate limiting/timeout tolerance.
        4. Caches successful result.
        5. Falls back to default NCR coordinates if unresolved.

        Returns (lat, lon, display_name, source)
        """
        if not query or not query.strip():
            return (default_lat, default_lon, "Delhi NCR Default Center", "fallback")

        clean_query = query.strip()
        query_key = clean_query.lower()

        # 1. Check local SQLite cache
        cached = self.get_from_cache(query_key)
        if cached:
            return cached

        # 2. Check NCR Fallback Dictionary
        for hub_key, (f_lat, f_lon, f_name) in NCR_FALLBACK_HUBS.items():
            if hub_key in query_key:
                self.save_to_cache(query_key, f_lat, f_lon, f_name, source="ncr_fallback")
                return (f_lat, f_lon, f_name, "ncr_fallback")

        # 3. Nominatim Geocoding
        geolocator = self._get_geolocator()
        if geolocator:
            search_query = f"{clean_query}, {city_hint}" if city_hint and city_hint not in clean_query else clean_query
            try:
                location = geolocator.geocode(search_query)
                if location:
                    self.save_to_cache(query_key, location.latitude, location.longitude, location.address, source="nominatim")
                    return (location.latitude, location.longitude, location.address, "nominatim")
            except Exception as e:
                logger.warning(f"Nominatim lookup failed for '{search_query}': {e}")

        # 4. Fallback if lookup completely failed
        fallback_name = f"{clean_query} (Approx. NCR Region)"
        self.save_to_cache(query_key, default_lat, default_lon, fallback_name, source="default_fallback")
        return (default_lat, default_lon, fallback_name, "default_fallback")

    def list_all_cached(self) -> List[Dict[str, any]]:
        """Returns all cached geocoded queries."""
        results = []
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("SELECT query, lat, lon, display_name, source, created_at FROM geocache ORDER BY created_at DESC")
                for row in cursor.fetchall():
                    results.append({
                        "query": row[0],
                        "lat": row[1],
                        "lon": row[2],
                        "display_name": row[3],
                        "source": row[4],
                        "created_at": row[5]
                    })
        except Exception as e:
            logger.error(f"Failed to list cached locations: {e}")
        return results
