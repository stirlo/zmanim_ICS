from datetime import datetime, timedelta
import pytz
from icalendar import Calendar, Event
import requests
from pathlib import Path
from cities import CITIES

def generate_calendar(city, info, output_dir):
    """Generate unified calendar for city with 8 weeks of data"""
    cal = Calendar()
    cal.add('prodid', f'-//Hebrew Calendar//{city}//EN')
    cal.add('version', '2.0')
    cal.add('x-wr-calname', f'Jewish Calendar - {city}')

    # Set timezone
    tz = pytz.timezone(info['timezone'])

    start_date = datetime.now(tz)
    end_date = start_date + timedelta(weeks=8)

    # Get Holidays and Shabbat times
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

    # Fetch holiday data
    holidays = requests.get('https://www.hebcal.com/hebcal', params=params).json()

    # Fetch Shabbat times
    shabbat = requests.get('https://www.hebcal.com/shabbat', params=params).json()

    # Combine all events
    all_events = holidays['items'] + shabbat['items']

    for item in all_events:
        event = Event()
        event.add('summary', item['title'])

        # Parse date in correct timezone
        event_date = datetime.fromisoformat(item['date']).replace(tzinfo=tz)
        event.add('dtstart', event_date)

        # Set duration based on event type
        if 'category' in item:
            if item['category'] == 'candles':
                event.add('duration', timedelta(minutes=18))
            elif item['category'] == 'havdalah':
                event.add('duration', timedelta(minutes=10))
            elif item['category'] == 'holiday':
                if 'yomtov' in item.get('subcat', []):
                    event.add('duration', timedelta(days=1))
                else:
                    event.add('duration', timedelta(minutes=15))  # Default duration
        else:
            event.add('duration', timedelta(minutes=15))  # Default duration

        if 'description' in item:
            event.add('description', item['description'])

        # Explicitly set no alarms
        event.add('x-microsoft-cdo-alarmhasDescription', False)
        event.add('x-microsoft-cdo-alarmhasSound', False)

        cal.add_component(event)

    # Ensure output directory exists
    output_dir.mkdir(parents=True, exist_ok=True)

    # Write calendar file
    with open(output_dir / f'{city.lower().replace(" ", "_")}.ics', 'wb') as f:
        f.write(cal.to_ical())

    print(f"Generated calendar for {city}")

def main():
    output_dir = Path("static/calendars")

    # Generate for all cities
    for city, info in CITIES.items():
        try:
            generate_calendar(city, info, output_dir)
        except Exception as e:
            print(f"Error generating calendar for {city}: {e}")

if __name__ == "__main__":
    main()
