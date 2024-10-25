# cities.py
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

# app.py
from flask import Flask, render_template, send_file
from datetime import datetime, timedelta
import requests
from icalendar import Calendar, Event
import pytz
from cities import CITIES
import os
from pathlib import Path

app = Flask(__name__)

def generate_calendar_files():
    """Generate ICS files for each city with 8 weeks of data"""
    output_dir = Path("static/calendars")
    output_dir.mkdir(parents=True, exist_ok=True)

    for city, info in CITIES.items():
        # Generate three different calendar files for each city
        generate_holiday_calendar(city, info, output_dir)
        generate_shabbat_calendar(city, info, output_dir)
        generate_zmanim_calendar(city, info, output_dir)

def generate_holiday_calendar(city, info, output_dir):
    """Generate holiday calendar for 8 weeks"""
    cal = Calendar()
    cal.add('prodid', f'-//Hebrew Calendar//{city}//Holidays//EN')
    cal.add('version', '2.0')

    start_date = datetime.now()
    end_date = start_date + timedelta(weeks=8)

    params = {
        'cfg': 'json',
        'maj': 'on',
        'min': 'on',
        'mod': 'on',
        'latitude': info['lat'],
        'longitude': info['lon'],
        'tzid': info['timezone'],
        'start': start_date.strftime('%Y-%m-%d'),
        'end': end_date.strftime('%Y-%m-%d')
    }

    response = requests.get('https://www.hebcal.com/hebcal', params=params)
    data = response.json()

    for item in data['items']:
        if item['category'] == 'holiday':
            event = Event()
            event.add('summary', item['title'])
            event.add('dtstart', datetime.fromisoformat(item['date']))
            event.add('duration', timedelta(days=1))
            event.add('description', item.get('description', ''))
            cal.add_component(event)

    with open(output_dir / f'{city.lower().replace(" ", "_")}_holidays.ics', 'wb') as f:
        f.write(cal.to_ical())

def generate_shabbat_calendar(city, info, output_dir):
    """Generate Shabbat times calendar for 8 weeks"""
    cal = Calendar()
    cal.add('prodid', f'-//Hebrew Calendar//{city}//Shabbat//EN')
    cal.add('version', '2.0')

    start_date = datetime.now()
    end_date = start_date + timedelta(weeks=8)

    params = {
        'cfg': 'json',
        'latitude': info['lat'],
        'longitude': info['lon'],
        'tzid': info['timezone'],
        'start': start_date.strftime('%Y-%m-%d'),
        'end': end_date.strftime('%Y-%m-%d')
    }

    response = requests.get('https://www.hebcal.com/shabbat', params=params)
    data = response.json()

    for item in data['items']:
        event = Event()
        event.add('summary', item['title'])
        event.add('dtstart', datetime.fromisoformat(item['date']))
        if 'havdalah' in item['title'].lower():
            event.add('duration', timedelta(minutes=10))
        else:
            event.add('duration', timedelta(hours=25))
        cal.add_component(event)

    with open(output_dir / f'{city.lower().replace(" ", "_")}_shabbat.ics', 'wb') as f:
        f.write(cal.to_ical())

def generate_zmanim_calendar(city, info, output_dir):
    """Generate Zmanim calendar for 2 weeks"""
    cal = Calendar()
    cal.add('prodid', f'-//Hebrew Calendar//{city}//Zmanim//EN')
    cal.add('version', '2.0')

    start_date = datetime.now()
    end_date = start_date + timedelta(weeks=2)
    current = start_date

    while current <= end_date:
        params = {
            'cfg': 'json',
            'latitude': info['lat'],
            'longitude': info['lon'],
            'tzid': info['timezone'],
            'date': current.strftime('%Y-%m-%d')
        }

        response = requests.get('https://www.hebcal.com/zmanim', params=params)
        data = response.json()

        for name, time in data['times'].items():
            if isinstance(time, str):  # Only process time entries
                event = Event()
                event.add('summary', f'{name} - {city}')
                event_time = datetime.fromisoformat(time)
                event.add('dtstart', event_time)
                event.add('duration', timedelta(minutes=1))
                cal.add_component(event)

        current += timedelta(days=1)

    with open(output_dir / f'{city.lower().replace(" ", "_")}_zmanim.ics', 'wb') as f:
        f.write(cal.to_ical())

@app.route('/')
def index():
    return render_template('index.html', cities=CITIES)

@app.route('/calendars')
def calendar_page():
    return render_template('calendars.html', cities=CITIES)

@app.route('/generate')
def generate():
    generate_calendar_files()
    return "Calendars generated successfully!"

if __name__ == '__main__':
    app.run(debug=True)
