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

function createCitySelector() {
    const container = document.querySelector('.input-group').parentElement;
    const selectorDiv = document.createElement('div');
    selectorDiv.className = 'city-selector';

    const html = `
        <div class="input-group">
            <label>Select City: </label>
            <select id="citySelect" onchange="handleCityChange()">
                <option value="">Custom Location</option>
                ${Object.keys(MAJOR_CITIES).map(city => 
                    `<option value="${city}">${city}</option>`
                ).join('')}
            </select>
        </div>
    `;

    selectorDiv.innerHTML = html;
    container.insertBefore(selectorDiv, container.firstChild);
}

function handleCityChange() {
    const citySelect = document.getElementById('citySelect');
    const selectedCity = citySelect.value;

    if (selectedCity) {
        const city = MAJOR_CITIES[selectedCity];
        document.getElementById('latitude').value = city.lat.toFixed(3);
        document.getElementById('longitude').value = city.lon.toFixed(3);
        calculateHebrewDate();
    }
}

function findMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            document.getElementById('latitude').value = position.coords.latitude.toFixed(3);
            document.getElementById('longitude').value = position.coords.longitude.toFixed(3);
            document.getElementById('citySelect').value = ''; // Reset city selector to custom
            calculateHebrewDate();
        }, error => {
            alert("Error getting location: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function formatTime(date) {
    if (!date) return 'N/A';
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });
}

function getWeekZmanim(location) {
    const zmanimList = [];
    const now = new Date();

    // Get zmanim for next 7 days
    for(let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        const hDate = new hebcal.HDate(date);
        const zmanim = new hebcal.Zmanim(location, hDate, true);

        zmanimList.push({
            date: date,
            hebrewDate: hDate.toString(),
            zmanim: {
                alotHaShachar: zmanim.alotHaShachar(),
                misheyakir: zmanim.misheyakir(),
                sunrise: zmanim.sunrise(),
                sofZmanShma: zmanim.sofZmanShma(),
                sofZmanTfilla: zmanim.sofZmanTfilla(),
                chatzot: zmanim.chatzot(),
                minchaGedola: zmanim.minchaGedola(),
                minchaKetana: zmanim.minchaKetana(),
                plagHaMincha: zmanim.plagHaMincha(),
                sunset: zmanim.sunset(),
                tzeit: zmanim.tzeit()
            }
        });
    }
    return zmanimList;
}

function displayZmanim(zmanimList) {
    const container = document.getElementById('result');
    let html = `<h2>Zmanim for the Next 7 Days</h2>`;

    zmanimList.forEach((day, index) => {
        const dateStr = day.date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric'
        });

        html += `
            <div class="day-zmanim ${index === 0 ? 'today' : ''}">
                <h3>${index === 0 ? 'Today - ' : ''}${dateStr}</h3>
                <div class="hebrew-date">${day.hebrewDate}</div>
                <div class="zmanim-container">
                    <div>Alot HaShachar: ${formatTime(day.zmanim.alotHaShachar)}</div>
                    <div>Misheyakir: ${formatTime(day.zmanim.misheyakir)}</div>
                    <div>Sunrise: ${formatTime(day.zmanim.sunrise)}</div>
                    <div>Sof Zman Shma: ${formatTime(day.zmanim.sofZmanShma)}</div>
                    <div>Sof Zman Tfilla: ${formatTime(day.zmanim.sofZmanTfilla)}</div>
                    <div>Chatzot: ${formatTime(day.zmanim.chatzot)}</div>
                    <div>Mincha Gedola: ${formatTime(day.zmanim.minchaGedola)}</div>
                    <div>Mincha Ketana: ${formatTime(day.zmanim.minchaKetana)}</div>
                    <div>Plag HaMincha: ${formatTime(day.zmanim.plagHaMincha)}</div>
                    <div>Sunset: ${formatTime(day.zmanim.sunset)}</div>
                    <div>Tzeit HaKochavim: ${formatTime(day.zmanim.tzeit)}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function calculateHebrewDate() {
    try {
        const lat = document.getElementById('latitude').value;
        const lon = document.getElementById('longitude').value;
        const citySelect = document.getElementById('citySelect');
        const selectedCity = citySelect.value;

        if (!lat || !lon) {
            alert("Please enter latitude and longitude");
            return;
        }

        // Get timezone from selected city or use local timezone
        const timezone = selectedCity ? 
            MAJOR_CITIES[selectedCity].timezone : 
            Intl.DateTimeFormat().resolvedOptions().timeZone;

        // Create location object
        const location = new hebcal.GeoLocation(
            selectedCity || "Custom Location",
            parseFloat(lat),
            parseFloat(lon),
            0,
            timezone
        );

        // Get and display week of zmanim
        const weekZmanim = getWeekZmanim(location);
        displayZmanim(weekZmanim);

        // Add holiday events
        const hebcalLocation = new hebcal.Location(
            parseFloat(lat),
            parseFloat(lon),
            false,
            timezone,
            selectedCity || "Custom Location",
            selectedCity ? MAJOR_CITIES[selectedCity].country : ""
        );

        const events = getHolidayEvents(hebcalLocation);
        displayEvents(events);

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = 
            `<div>Error calculating: ${error.message}</div>`;
        document.getElementById('debug').innerHTML = 
            `Debug info: ${error.stack}`;
    }
}

function getHolidayEvents(location) {
    const now = new Date();
    const oneMonthAhead = new Date();
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

    const events = hebcal.HebrewCalendar.calendar({
        start: now,
        end: oneMonthAhead,
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

    return events.map(ev => ({
        title: ev.render('en'),
        date: ev.getDate().greg(),
        category: ev.getCategories()[0],
        emoji: ev.getEmoji?.() || '',
        flags: ev.getFlags()
    }));
}

function displayEvents(events) {
    const container = document.getElementById('events-container');
    if (!container) {
        console.error('Events container not found');
        return;
    }

    let html = `<h2>Upcoming Jewish Holidays and Events</h2>`;

    events.forEach(event => {
        const dateStr = event.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        html += `
            <div class="event-item ${event.category}">
                ${event.emoji ? `<span class="event-emoji">${event.emoji}</span>` : ''}
                <span class="event-title">${event.title}</span>
                <span class="event-date">${dateStr}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

function addCalendarLinks() {
    const container = document.createElement('div');
    container.className = 'calendar-links';
    container.innerHTML = `
        <h3>Subscribe to Calendars</h3>
        <div class="calendar-grid">
            ${Object.keys(MAJOR_CITIES).map(city => `
                <div class="calendar-item">
                    <h4>${city}</h4>
                    <a href="calendars/${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics" 
                       class="calendar-link">
                       Subscribe to ${city} Calendar
                    </a>
                </div>
            `).join('')}
        </div>
    `;

    document.querySelector('.container').appendChild(container);
}
