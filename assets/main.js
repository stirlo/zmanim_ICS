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
    const container = document.getElementById('location-container');
    const selectorDiv = document.createElement('div');
    selectorDiv.className = 'input-group';

    const html = `
        <label>Select City: </label>
        <select id="citySelect" onchange="handleCityChange()">
            <option value="">Custom Location</option>
            ${Object.keys(MAJOR_CITIES).map(city => 
                `<option value="${city}">${city}</option>`
            ).join('')}
        </select>
    `;

    selectorDiv.innerHTML = html;
    container.appendChild(selectorDiv);
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
        const locationButton = document.querySelector('button');
        locationButton.disabled = true;
        locationButton.innerHTML = '<span class="loading-spinner"></span> Finding location...';

        navigator.geolocation.getCurrentPosition(
            position => {
                document.getElementById('latitude').value = position.coords.latitude.toFixed(3);
                document.getElementById('longitude').value = position.coords.longitude.toFixed(3);
                document.getElementById('citySelect').value = ''; // Reset city selector to custom
                calculateHebrewDate();

                locationButton.disabled = false;
                locationButton.textContent = 'Find Me';
            },
            error => {
                alert(`Error getting location: ${error.message}`);
                locationButton.disabled = false;
                locationButton.textContent = 'Find Me';
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
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

function calculateHebrewDate() {
    try {
        const lat = document.getElementById('latitude').value;
        const lon = document.getElementById('longitude').value;
        const citySelect = document.getElementById('citySelect');
        const selectedCity = citySelect.value;

        if (!lat || !lon) {
            showError("Please enter latitude and longitude");
            return;
        }

        const timezone = selectedCity ? 
            MAJOR_CITIES[selectedCity].timezone : 
            Intl.DateTimeFormat().resolvedOptions().timeZone;

        const location = new hebcal.Location(
            selectedCity || "Custom Location",
            parseFloat(lat),
            parseFloat(lon),
            0,
            timezone,
            selectedCity ? MAJOR_CITIES[selectedCity].country : ""
        );

        showLoading();

        // Get and display zmanim
        const weekZmanim = getWeekZmanim(location);
        displayZmanim(weekZmanim);

        // Get and display events
        const events = getHolidayEvents(location);
        displayEvents(events);

        hideLoading();

    } catch (error) {
        console.error('Error:', error);
        showError(`Error calculating: ${error.message}`);
    }
}

function showLoading() {
    document.getElementById('result').innerHTML = '<div class="loading-spinner"></div>';
    document.getElementById('events-container').innerHTML = '';
}

function hideLoading() {
    const loadingSpinner = document.querySelector('.loading-spinner');
    if (loadingSpinner) {
        loadingSpinner.remove();
    }
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    document.getElementById('result').appendChild(errorDiv);
}

function getWeekZmanim(location) {
    const zmanimList = [];
    const now = new Date();

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
                    <div>Alot HaShachar (Dawn): ${formatTime(day.zmanim.alotHaShachar)}</div>
                    <div>Misheyakir: ${formatTime(day.zmanim.misheyakir)}</div>
                    <div>Sunrise: ${formatTime(day.zmanim.sunrise)}</div>
                    <div>Sof Zman Shma: ${formatTime(day.zmanim.sofZmanShma)}</div>
                    <div>Sof Zman Tfilla: ${formatTime(day.zmanim.sofZmanTfilla)}</div>
                    <div>Chatzot (Midday): ${formatTime(day.zmanim.chatzot)}</div>
                    <div>Mincha Gedola: ${formatTime(day.zmanim.minchaGedola)}</div>
                    <div>Mincha Ketana: ${formatTime(day.zmanim.minchaKetana)}</div>
                    <div>Plag HaMincha: ${formatTime(day.zmanim.plagHaMincha)}</div>
                    <div>Sunset: ${formatTime(day.zmanim.sunset)}</div>
                    <div>Tzeit HaKochavim (Nightfall): ${formatTime(day.zmanim.tzeit)}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function getHolidayEvents(location) {
    const now = new Date();
    const threeMonthsAhead = new Date();
    threeMonthsAhead.setMonth(threeMonthsAhead.getMonth() + 3);

    const events = hebcal.HebrewCalendar.calendar({
        start: now,
        end: threeMonthsAhead,
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
        flags: ev.getFlags(),
        desc: ev.desc('en')
    }));
}

function displayEvents(events) {
    const container = document.getElementById('events-container');
    let html = `<h2>Upcoming Jewish Holidays and Events</h2>`;

    events.forEach(event => {
        const dateStr = event.date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        const categoryClass = getCategoryClass(event.category);

        html += `
            <div class="event-item ${categoryClass}" title="${event.desc || ''}">
                ${event.emoji ? `<span class="event-emoji">${event.emoji}</span>` : ''}
                <span class="event-title">${event.title}</span>
                <span class="event-date">${dateStr}</span>
            </div>
        `;
    });

    container.innerHTML = html;
}

function getCategoryClass(category) {
    switch(category?.toLowerCase()) {
        case 'holiday':
        case 'major holiday':
            return 'holiday major';
        case 'minor holiday':
            return 'holiday minor';
        case 'candles':
            return 'candles';
        case 'parashat':
            return 'parashat';
        default:
            return '';
    }
}

function createSubscriptionGuide() {
    const container = document.createElement('div');
    container.className = 'subscription-guide';

    container.innerHTML = `
        <div class="subscription-container">
            <h3>Calendar Subscription Guide</h3>
            <div class="subscription-tabs">
                <button class="tab-button active" onclick="showTab('google')">Google Calendar</button>
                <button class="tab-button" onclick="showTab('apple')">Apple Calendar</button>
                <button class="tab-button" onclick="showTab('outlook')">Outlook</button>
            </div>

            <div class="tab-content" id="google-guide">
                <h4>Subscribe in Google Calendar:</h4>
                <ol>
                    <li>Copy the calendar URL for your city below</li>
                    <li>In Google Calendar, click the + next to "Other calendars"</li>
                    <li>Select "From URL"</li>
                    <li>Paste the URL and click "Add calendar"</li>
                </ol>
            </div>

            <div class="tab-content hidden" id="apple-guide">
                <h4>Subscribe in Apple Calendar:</h4>
                <ol>
                    <li>Click the calendar link for your city below</li>
                    <li>Select "Allow" when prompted</li>
                    <li>Choose "Subscribe" in Apple Calendar</li>
                    <li>Adjust refresh and alert settings as needed</li>
                </ol>
            </div>

            <div class="tab-content hidden" id="outlook-guide">
                <h4>Subscribe in Outlook:</h4>
                <ol>
                    <li>Copy the calendar URL for your city</li>
                    <li>In Outlook, go to "Add Calendar" > "From Internet"</li>
                    <li>Paste the URL and click "OK"</li>
                    <li>Name your calendar and click "OK"</li>
                </ol>
            </div>

            <div class="calendar-links-grid">
                ${Object.keys(MAJOR_CITIES).map(city => `
                    <div class="calendar-subscription-item">
                        <h4>${city}</h4>
                        <div class="calendar-actions">
                            <input type="text" 
                                   readonly 
                                   value="${window.location.origin}/calendars/${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics"
                                   class="calendar-url">
                            <button onclick="copyCalendarUrl(this)" class="copy-button">
                                Copy URL
                            </button>
                            <a href="webcal://${window.location.host}/calendars/${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics"
                               class="subscribe-button">
                               Quick Subscribe
                            </a>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelector('.container').appendChild(container);
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.add('hidden'));
    document.querySelectorAll('.tab-button').forEach(button => button.classList.remove('active'));
    document.getElementById(`${tabName}-guide`).classList.remove('hidden');
    document.querySelector(`button[onclick="showTab('${tabName}')"]`).classList.add('active');
}

function copyCalendarUrl(button) {
    const urlInput = button.previousElementSibling;
    urlInput.select();
    document.execCommand('copy');

    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    createCitySelector();
    createSubscriptionGuide();
});
