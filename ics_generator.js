const ical = require('ical-generator');
const hebcal = require('@hebcal/core');
const fs = require('fs').promises;
const path = require('path');

const REPO_PATH = 'stirlo/zmanim_ICS';
const EVENT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

// Define major Jewish communities with precise coordinates
const MAJOR_CITIES = {
    "Melbourne (St Kilda East)": {
        lat: -37.8716, 
        lon: 144.9989,
        timezone: "Australia/Melbourne",
        country: "AU",
        elevation: 35,
        cityName: "St Kilda East",
        region: "Victoria"
    },
    "Jerusalem": {
        lat: 31.778,
        lon: 35.235,
        timezone: "Asia/Jerusalem",
        country: "IL",
        elevation: 754,
        cityName: "Jerusalem",
        region: "Jerusalem District"
    },
    "Tel Aviv": {
        lat: 32.087,
        lon: 34.791,
        timezone: "Asia/Jerusalem",
        country: "IL",
        elevation: 5,
        cityName: "Tel Aviv",
        region: "Tel Aviv District"
    },
    "New York": {
        lat: 40.759,
        lon: -73.979,
        timezone: "America/New_York",
        country: "US",
        elevation: 10,
        cityName: "Manhattan",
        region: "New York"
    },
    "Los Angeles": {
        lat: 34.052,
        lon: -118.243,
        timezone: "America/Los_Angeles",
        country: "US",
        elevation: 71,
        cityName: "Los Angeles",
        region: "California"
    },
    "London": {
        lat: 51.507,
        lon: -0.127,
        timezone: "Europe/London",
        country: "GB",
        elevation: 11,
        cityName: "London",
        region: "England"
    },
    "Sydney": {
        lat: -33.868,
        lon: 151.209,
        timezone: "Australia/Sydney",
        country: "AU",
        elevation: 39,
        cityName: "Sydney",
        region: "New South Wales"
    }
};

// Helper function to format time descriptions
function formatTimeDescription(date, hebrewDate, cityName) {
    return `Time: ${date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZoneName: 'short'
    })}
Hebrew Date: ${hebrewDate.toString()}
Location: ${cityName}`;
}
async function generateICSForCity(cityName, cityData) {
    console.log(`Generating calendar for ${cityName}...`);

    const calendar = ical({
        name: `Jewish Calendar - ${cityName}`,
        timezone: cityData.timezone,
        prodId: {
            company: 'Jewish Calendar Service',
            product: `Zmanim-Calendar-${cityName.replace(/\s+/g, '-')}`,
            language: 'EN'
        },
        method: 'PUBLISH',
        ttl: 60 * 60 * 24 // 24 hours
    });

    const location = new hebcal.Location(
        cityName,
        cityData.lat,
        cityData.lon,
        cityData.elevation || 0,
        cityData.timezone,
        cityData.country
    );

    // Generate events for the next year
    const now = new Date();
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    // Generate daily zmanim events
    for (let d = new Date(now); d <= oneYearFromNow; d.setDate(d.getDate() + 1)) {
        const hDate = new hebcal.HDate(d);
        const zmanim = new hebcal.Zmanim(location, hDate, true);

        const zmanimTimes = {
            'Alot HaShachar (Dawn)': {
                time: zmanim.alotHaShachar(),
                category: 'Dawn'
            },
            'Misheyakir': {
                time: zmanim.misheyakir(),
                category: 'Morning'
            },
            'Sunrise (HaNetz)': {
                time: zmanim.sunrise(),
                category: 'Morning'
            },
            'Sof Zman Shma GRA': {
                time: zmanim.sofZmanShma(),
                category: 'Morning'
            },
            'Sof Zman Tfilla GRA': {
                time: zmanim.sofZmanTfilla(),
                category: 'Morning'
            },
            'Chatzot (Midday)': {
                time: zmanim.chatzot(),
                category: 'Midday'
            },
            'Mincha Gedola': {
                time: zmanim.minchaGedola(),
                category: 'Afternoon'
            },
            'Mincha Ketana': {
                time: zmanim.minchaKetana(),
                category: 'Afternoon'
            },
            'Plag HaMincha': {
                time: zmanim.plagHaMincha(),
                category: 'Evening'
            },
            'Sunset (Shkia)': {
                time: zmanim.sunset(),
                category: 'Evening'
            },
            'Tzeit HaKochavim': {
                time: zmanim.tzeit(),
                category: 'Night'
            }
        };

        Object.entries(zmanimTimes).forEach(([name, data]) => {
            if (data.time) {
                calendar.createEvent({
                    start: data.time,
                    end: new Date(data.time.getTime() + EVENT_DURATION),
                    summary: `${name} - ${cityName}`,
                    description: formatTimeDescription(data.time, hDate, cityName),
                    location: `${cityName}, ${cityData.region}`,
                    categories: ['Zmanim', data.category],
                    status: 'CONFIRMED',
                    busystatus: 'FREE',
                    transparency: 'TRANSPARENT'
                });
            }
        });
    }
    // Generate holiday and special events
    const events = hebcal.HebrewCalendar.calendar({
        start: now,
        end: oneYearFromNow,
        location: location,
        candlelighting: true,
        sedrot: true,
        mask: hebcal.flags.ROSH_CHODESH |
              hebcal.flags.MAJOR_FAST |
              hebcal.flags.MINOR_HOLIDAY |
              hebcal.flags.MAJOR_HOLIDAY |
              hebcal.flags.MODERN_HOLIDAY |
              hebcal.flags.SPECIAL_SHABBAT |
              hebcal.flags.ROSH_CHODESH |
              hebcal.flags.SHABBAT_MEVARCHIM |
              hebcal.flags.PARSHA_HASHAVUA
    });

    events.forEach(ev => {
        const startDate = ev.getDate().greg();
        const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); // Full day events
        const emoji = ev.getEmoji?.() || '';
        const categories = ev.getCategories();

        calendar.createEvent({
            start: startDate,
            end: endDate,
            allDay: true,
            summary: `${emoji ? emoji + ' ' : ''}${ev.render('en')}`,
            description: `${ev.desc('en')}\nLocation: ${cityName}, ${cityData.region}\nHebrew Date: ${ev.getDate().toString()}`,
            location: `${cityName}, ${cityData.region}`,
            categories: categories,
            status: 'CONFIRMED',
            busystatus: ev.getFlags() & hebcal.flags.MAJOR_HOLIDAY ? 'FREE' : 'BUSY',
            transparency: 'TRANSPARENT'
        });
    });

    // Add candle lighting times
    const candleLightingEvents = hebcal.HebrewCalendar.calendar({
        start: now,
        end: oneYearFromNow,
        location: location,
        candlelighting: true,
        havdalah: true,
        havdalahMins: 42,
        candleLightingMins: 18
    });

    candleLightingEvents.forEach(ev => {
        if (ev.getFlags() & (hebcal.flags.LIGHT_CANDLES | hebcal.flags.HAVDALAH)) {
            const date = ev.getDate().greg();
            const emoji = ev.getFlags() & hebcal.flags.LIGHT_CANDLES ? '🕯️' : '✨';

            calendar.createEvent({
                start: date,
                end: new Date(date.getTime() + EVENT_DURATION),
                summary: `${emoji} ${ev.render('en')} - ${cityName}`,
                description: formatTimeDescription(date, ev.getDate(), cityName),
                location: `${cityName}, ${cityData.region}`,
                categories: ['Candle Lighting'],
                status: 'CONFIRMED',
                busystatus: 'FREE',
                transparency: 'TRANSPARENT'
            });
        }
    });

    // Save the calendar
    const filename = path.join(__dirname, 'calendars', `${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`);
    await fs.mkdir(path.dirname(filename), { recursive: true });
    await fs.writeFile(filename, calendar.toString());

    console.log(`Calendar generated for ${cityName}`);
}
