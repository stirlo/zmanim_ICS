document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    document.getElementById('findMeBtn').addEventListener('click', findMe);
    document.getElementById('calculateBtn').addEventListener('click', calculateHebrewDate);

    // Log version for debugging
    console.log('Hebcal version:', hebcal?.VERSION);
});

function showLoading(button) {
    button.classList.add('loading');
    button.querySelector('.loading-spinner').classList.remove('hidden');
}

function hideLoading(button) {
    button.classList.remove('loading');
    button.querySelector('.loading-spinner').classList.add('hidden');
}

function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => {
        errorDiv.classList.add('hidden');
    }, 5000);
}

function findMe() {
    const button = document.querySelector('.location-button');
    showLoading(button);

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                document.getElementById('latitude').value = position.coords.latitude.toFixed(3);
                document.getElementById('longitude').value = position.coords.longitude.toFixed(3);
                hideLoading(button);
            },
            error => {
                hideLoading(button);
                showError("Error getting location: " + error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    } else {
        hideLoading(button);
        showError("Geolocation is not supported by this browser.");
    }
}

function formatTime(date) {
    if (!date) return 'N/A';
    try {
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    } catch (e) {
        console.error('Error formatting time:', e);
        return 'N/A';
    }
}

function calculateHebrewDate() {
    const lat = document.getElementById('latitude').value;
    const lon = document.getElementById('longitude').value;
    const button = document.querySelector('.calculate-button');
    const resultDiv = document.getElementById('result');

    if (!lat || !lon) {
        showError("Please enter both latitude and longitude");
        return;
    }

    if (lat < -90 || lat > 90) {
        showError("Latitude must be between -90 and 90 degrees");
        return;
    }

    if (lon < -180 || lon > 180) {
        showError("Longitude must be between -180 and 180 degrees");
        return;
    }

    showLoading(button);
    resultDiv.classList.add('hidden');

    try {
        const now = new Date();
        const location = new hebcal.Location(
            parseFloat(lat),
            parseFloat(lon),
            false,
            Intl.DateTimeFormat().resolvedOptions().timeZone,
            'Custom Location'
        );

        const hDate = new hebcal.HDate();
        const zmanim = new hebcal.Zmanim(location, now);

        // Get all zmanim for the day
        const zmanimList = {
            'Alot HaShachar (Dawn)': zmanim.alot(),
            'Misheyakir': zmanim.misheyakir(),
            'Sunrise': zmanim.sunrise(),
            'Sof Zman Shma GRA': zmanim.sofZmanShma(),
            'Sof Zman Tfilla GRA': zmanim.sofZmanTfilla(),
            'Chatzot': zmanim.chatzot(),
            'Mincha Gedola': zmanim.minchaGedola(),
            'Mincha Ketana': zmanim.minchaKetana(),
            'Plag HaMincha': zmanim.plagHaMincha(),
            'Sunset': zmanim.sunset(),
            'Tzeit HaKochavim': zmanim.tzeit()
        };

        let zmanimHtml = '<div class="zmanim-container">';
        for (const [name, time] of Object.entries(zmanimList)) {
            zmanimHtml += `<p><strong>${name}:</strong> ${formatTime(time)}</p>`;
        }
        zmanimHtml += '</div>';

        // Get holiday information
        const events = hebcal.HebrewCalendar.getHolidaysOnDate(hDate);
        let holidayHtml = '';
        if (events && events.length > 0) {
            holidayHtml = '<div class="holiday-container"><h3>Holidays & Special Days</h3>';
            events.forEach(ev => {
                try {
                    const emoji = ev.emoji || '';
                    const categories = Array.isArray(ev.getCategories()) ? 
                        ev.getCategories().join(' ').toLowerCase() : '';
                    holidayHtml += `
                        <div class="event-item ${categories}">
                            <span class="event-emoji">${emoji}</span>
                            <span class="event-title">${ev.render('en')}</span>
                        </div>`;
                } catch (e) {
                    console.error('Error processing holiday:', e);
                }
            });
            holidayHtml += '</div>';
        }

        // Check for candle lighting
        let candleHtml = '';
        try {
            const candleLighting = hebcal.HebrewCalendar.getCandleLighting(location, hDate);
            if (candleLighting && candleLighting.length > 0) {
                candleHtml = '<div class="candle-container"><h3>Shabbat/Holiday Times</h3>';
                candleLighting.forEach(ev => {
                    try {
                        const emoji = ev.emoji || (ev.desc.includes('Havdalah') ? '✨' : '🕯');
                        candleHtml += `
                            <div class="event-item candles">
                                <span class="event-emoji">${emoji}</span>
                                <span class="event-title">${ev.render('en')}</span>
                                <span class="event-date">${formatTime(ev.eventTime)}</span>
                            </div>`;
                    } catch (e) {
                        console.error('Error processing candle lighting event:', e);
                    }
                });
                candleHtml += '</div>';
            }
        } catch (e) {
            console.error('Error processing candle lighting:', e);
        }

        resultDiv.innerHTML = `
            <h3>Results for ${now.toLocaleDateString()}</h3>
            <p><strong>Hebrew Date:</strong> ${hDate.toString()}</p>
            <p><strong>Location:</strong> ${lat}°, ${lon}°</p>
            <h3>Zmanim</h3>
            ${zmanimHtml}
            ${holidayHtml}
            ${candleHtml}
        `;
        resultDiv.classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        showError('Error calculating Hebrew date. Please try again.');
    } finally {
        hideLoading(button);
    }
}
