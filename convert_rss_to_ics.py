import feedparser
from icalendar import Calendar, Event
from datetime import datetime, timedelta
import pytz
import re

def rss_to_ics(rss_url, ics_file_path):
    # Fetch and parse RSS feed
    feed = feedparser.parse(rss_url)

    # Create a calendar
    cal = Calendar()
    cal.add('prodid', '-//Chabad Zmanim//EN')
    cal.add('version', '2.0')

    # Extract the date from the title
    title_date_match = re.search(r'on (\w+, \w+ \d+, \d{4})', feed.feed.title)
    if title_date_match:
        base_date_str = title_date_match.group(1)
        base_date = datetime.strptime(base_date_str, "%A, %B %d, %Y")
    else:
        base_date = datetime.now()

    # Add events to the calendar
    for entry in feed.entries:
        event = Event()
        event.add('summary', entry.title)
        event.add('description', entry.description)

        # Extract time using regex
        time_match = re.search(r'(\d{1,2}:\d{2} [AP]M)', entry.title)
        if time_match:
            time_str = time_match.group(1)

            # Parse time
            time = datetime.strptime(time_str, "%I:%M %p").time()

            # Combine base_date and time
            date_time = datetime.combine(base_date.date(), time)

            # Handle midnight crossing
            if time.hour < 12 and "AM" in time_str:
                date_time += timedelta(days=1)

            date_time = date_time.replace(tzinfo=pytz.UTC)

            event.add('dtstart', date_time)
            event.add('dtend', date_time + timedelta(minutes=1))  # Assume 1-minute duration
            event.add('dtstamp', datetime.now(tz=pytz.UTC))
            event.add('url', entry.link)
            cal.add_component(event)

    # Write to file
    with open(ics_file_path, 'wb') as f:
        f.write(cal.to_ical())

# Usage
rss_url = 'https://www.chabad.org/tools/rss/zmanim.xml?locationId=1270&locationType=1&bDef=0&before=18'
ics_file_path = 'chabad_zmanim.ics'
rss_to_ics(rss_url, ics_file_path)
