function findMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            document.getElementById('latitude').value = position.coords.latitude.toFixed(3);
            document.getElementById('longitude').value = position.coords.longitude.toFixed(3);
            calculateHebrewDate(); // Auto-calculate after finding location
        }, error => {
            alert("Error getting location: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
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
                <div class="hebrew-date">Hebrew Date: ${day.hebrewDate}</div>
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

function getHolidayEvents(location) {
    const now = new Date();
    const year = now.getFullYear();

    // Calculate one month ahead
    const oneMonthAhead = new Date();
    oneMonthAhead.setMonth(oneMonthAhead.getMonth() + 1);

    const options = {
        year: year,
        isHebrewYear: false,
        candlelighting: true,
        location: location,
        sedrot: true,
        noMinorFast: true,
        start: now,
        end: oneMonthAhead,
        mask: hebcal.flags.ROSH_CHODESH |
              hebcal.flags.MAJOR_FAST |
              hebcal.flags.MINOR_HOLIDAY |
              hebcal.flags.MAJOR_HOLIDAY |
              hebcal.flags.MODERN_HOLIDAY |
              hebcal.flags.SPECIAL_SHABBAT |
              hebcal.flags.ROSH_CHODESH |
              hebcal.flags.SHABBAT_MEVARCHIM |
              hebcal.flags.PARSHA_HASHAVUA
    };

    const events = hebcal.HebrewCalendar.calendar(options);

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

function calculateHebrewDate() {
    try {
        const lat = document.getElementById('latitude').value;
        const lon = document.getElementById('longitude').value;

        if (!lat || !lon) {
            alert("Please enter latitude and longitude");
            return;
        }

        // Create location object
        const location = new hebcal.GeoLocation(
            "Custom Location",
            parseFloat(lat),
            parseFloat(lon),
            0,
            "UTC"
        );

        // Get and display week of zmanim
        const weekZmanim = getWeekZmanim(location);
        displayZmanim(weekZmanim);

        // Add holiday events
        const hebcalLocation = new hebcal.Location(
            parseFloat(lat),
            parseFloat(lon),
            false,
            Intl.DateTimeFormat().resolvedOptions().timeZone,
            "Custom Location",
            ""
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

function formatTime(date) {
    if (!date) return 'N/A';
    return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true});
}
