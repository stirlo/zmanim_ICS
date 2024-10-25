CITIES = {
    "Melbourne (St Kilda East)": {
        "lat": -37.8716,
        "lon": 144.9989,
        "timezone": "Australia/Melbourne",
        "country": "AU"
    },
    "Jerusalem": {
        "lat": 31.778,
        "lon": 35.235,
        "timezone": "Asia/Jerusalem",
        "country": "IL"
    },
    "Tel Aviv": {
        "lat": 32.087,
        "lon": 34.791,
        "timezone": "Asia/Jerusalem",
        "country": "IL"
    },
    "New York": {
        "lat": 40.759,
        "lon": -73.979,
        "timezone": "America/New_York",
        "country": "US"
    },
    "Los Angeles": {
        "lat": 34.052,
        "lon": -118.243,
        "timezone": "America/Los_Angeles",
        "country": "US"
    },
    "Hong Kong": {
        "lat": 22.302,
        "lon": 114.177,
        "timezone": "Asia/Hong_Kong",
        "country": "HK"
    },
    "Sydney": {
        "lat": -33.868,
        "lon": 151.209,
        "timezone": "Australia/Sydney",
        "country": "AU"
    },
    "London": {
        "lat": 51.507,
        "lon": -0.127,
        "timezone": "Europe/London",
        "country": "GB"
    }
}

# Optional: Helper functions for city operations
def get_city_coords(city_name):
    """Get coordinates for a given city"""
    if city_name in CITIES:
        return CITIES[city_name]["lat"], CITIES[city_name]["lon"]
    return None

def get_city_timezone(city_name):
    """Get timezone for a given city"""
    if city_name in CITIES:
        return CITIES[city_name]["timezone"]
    return None

def get_all_city_names():
    """Get list of all available cities"""
    return list(CITIES.keys())

def get_cities_by_country(country_code):
    """Get all cities in a given country"""
    return {name: info for name, info in CITIES.items() 
            if info["country"] == country_code}

# If you need to add a new city, use this format:
"""
CITIES["New City"] = {
    "lat": 00.000,
    "lon": 00.000,
    "timezone": "Region/City",
    "country": "CC"
}
"""
