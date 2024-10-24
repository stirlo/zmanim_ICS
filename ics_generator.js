const ical = require('ical-generator');
const hebcal = require('@hebcal/core');
const fs = require('fs').promises;

const MAJOR_CITIES = {
    "Melbourne (St Kilda East)": {
        lat: -37.8716, 
        lon: 144.9989,
        timezone: "Australia/Melbourne",
        country: "AU"
    },
    "Jerusalem": {
        lat: 31.778,
        lon: 35.235,
        timezone: "Asia/Jerusalem",
        country: "IL"
    },
    "Tel Aviv": {
        lat: 32.087,
        lon: 34.791,
        timezone: "Asia/Jerusalem",
        country: "IL"
    },
    "New York": {
        lat: 40.759,
        lon: -73.979,
        timezone: "America/New_York",
        country: "US"
    },
    "Los Angeles": {
        lat: 34.052,
        lon: -118.243,
        timezone: "America/Los_Angeles",
        country: "US"
    },
    "Hong Kong": {
        lat: 22.302,
        lon: 114.177,
        timezone: "Asia/Hong_Kong",
        country: "HK"
    },
    "Sydney": {
        lat: -33.868,
        lon: 151.209,
        timezone: "Australia/Sydney",
        country: "AU"
    },
    "London": {
        lat: 51.507,
        lon: -0.127,
        timezone: "Europe/London",
        country: "GB"
    }
};

async function generateICSForCity(cityName, cityData) {
    const calendar = ical({
        name: `Jewish Calendar - ${cityName}`,
        timezone: cityData.timezone,
        prodId: {
            company: 'Jewish Calendar Service',
            product: 'Zmanim-Calendar',
            language: 'EN'
        },
        method: 'PUBLISH',
        ttl: 60 * 60 * 6 // 6 hours
    });

    // Create location object for hebcal
    const location = new hebcal.Location(
        cityData.lat,
        cityData.lon,
        false,
        cityData.timezone,
        cityName,
        cityData.country
    );

    // Generate zmanim events for the next 30 days
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    for (let d = new Date(now); d <= thirtyDaysFromNow; d.setDate(d.getDate() + 1)) {
        const hDate = new hebcal.HDate(d);
        const zmanim = new hebcal.Zmanim(location, hDate, true);

        const zmanimTimes = {
            'Alot HaShachar': zmanim.alotHaShachar(),
            'Misheyakir': zmanim.misheyakir(),
            'Sunrise': zmanim.sunrise(),
            'Sof Zman Shma': zmanim.sofZmanShma(),
            'Sof Zman Tfilla': zmanim.sofZmanTfilla(),
            'Chatzot': zmanim.chatzot(),
            'Mincha Gedola': zmanim.minchaGedola(),
            'Mincha Ketana': zmanim.minchaKetana(),
            'Plag HaMincha': zmanim.plagHaMincha(),
            'Sunset': zmanim.sunset(),
            'Tzeit HaKochavim': zmanim.tzeit()
        };

        Object.entries(zmanimTimes).forEach(([name, time]) => {
            if (time) {
                calendar.createEvent({
                    start: time,
                    end: new Date(time.getTime() + 5 * 60000), // 5 minute duration
                    summary: `${name} - ${cityName}`,
                    description: `${name} for ${cityName}\nHebrew Date: ${hDate.toString()}`,
                    location: cityName,
                    categories: ['Zmanim'],
                    status: 'CONFIRMED',
                    busystatus: 'FREE',
                    transparency: 'TRANSPARENT',
                    alarms: [{
                        type: 'display',
                        trigger: 300 // 5 minutes before
                    }]
                });
            }
        });
    }

    // Generate holiday events for the next 6 months
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    const events = hebcal.HebrewCalendar.calendar({
        start: now,
        end: sixMonthsFromNow,
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
        const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
        const emoji = ev.getEmoji?.() || '';

        calendar.createEvent({
            start: startDate,
            end: endDate,
            allDay: true,
            summary: `${emoji ? emoji + ' ' : ''}${ev.render('en')}`,
            description: `${ev.desc('en')}\nHebrew Date: ${ev.getDate().toString()}`,
            location: cityName,
            categories: [ev.getCategories()[0]],
            status: 'CONFIRMED',
            busystatus: ev.getFlags() & hebcal.flags.MAJOR_HOLIDAY ? 'FREE' : 'BUSY',
            transparency: 'TRANSPARENT'
        });
    });

    // Add candle lighting times if available
    const candleLightingEvents = hebcal.HebrewCalendar.calendar({
        start: now,
        end: sixMonthsFromNow,
        location: location,
        candlelighting: true,
        havdalah: true
    });

    candleLightingEvents.forEach(ev => {
        if (ev.getFlags() & (hebcal.flags.LIGHT_CANDLES | hebcal.flags.HAVDALAH)) {
            const date = ev.getDate().greg();
            calendar.createEvent({
                start: date,
                end: new Date(date.getTime() + 10 * 60000), // 10 minute duration
                summary: ev.render('en'),
                description: `${ev.desc('en')}\nHebrew Date: ${ev.getDate().toString()}`,
                location: cityName,
                categories: ['Candle Lighting'],
                status: 'CONFIRMED',
                busystatus: 'FREE',
                transparency: 'TRANSPARENT',
                alarms: [{
                    type: 'display',
                    trigger: 900 // 15 minutes before
                }]
            });
        }
    });

    // Save the calendar
    const filename = `./calendars/${cityName.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`;
    await fs.mkdir('./calendars', { recursive: true });
    await fs.writeFile(filename, calendar.toString());

    console.log(`Generated calendar for ${cityName}`);
}

async function generateAllCalendars() {
    console.log('Starting calendar generation...');

    try {
        await fs.mkdir('./calendars', { recursive: true });

        for (const [cityName, cityData] of Object.entries(MAJOR_CITIES)) {
            console.log(`Processing ${cityName}...`);
            await generateICSForCity(cityName, cityData);
        }

        console.log('Calendar generation completed successfully.');
    } catch (error) {
        console.error('Error generating calendars:', error);
        process.exit(1);
    }
}

// Run the generator if this file is being executed directly
if (require.main === module) {
    generateAllCalendars();
}

module.exports = {
    generateAllCalendars,
    generateICSForCity,
    MAJOR_CITIES
};
