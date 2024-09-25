import feedparser
from icalendar import Calendar, Event
from datetime import datetime
import pytz

def rss_to_ics(rss_url, ics_file_path):
    # Fetch and parse RSS feed
    feed = feedparser.parse(rss_url)

    # Create a calendar
    cal = Calendar()
    cal.add('prodid', '-//Chabad Zmanim//EN')
    cal.add('version', '2.0')

    # Add events to the calendar
    for entry in feed.entries:
        event = Event()
        event.add('summary', entry.title)
        event.add('description', entry.description)

        # Parse the date from the title (adjust as needed)
        date_str = entry.title.split(' - ')[0]
        date = datetime.strptime(date_str, '%A, %B %d, %Y').replace(tzinfo=pytz.UTC)

        event.add('dtstart', date)
        event.add('dtend', date)
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
