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
            Intl.DateTimeFormat().resolvedOptions().timeZone
        );

        const hDate = new hebcal.HDate();
        const zmanim = new hebcal.Zmanim(location, now);

        // Get all zmanim for the day
        const zmanimList = {
            'Alot HaShachar (Dawn)': zmanim.alotHaShachar(),
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
            if (time) {
                zmanimHtml += `<p><strong>${name}:</strong> ${time.toLocaleTimeString()}</p>`;
            }
        }
        zmanimHtml += '</div>';

        // Get holiday information
        const events = hebcal.HebrewCalendar.getHolidaysOnDate(hDate);
        let holidayHtml = '';
        if (events.length > 0) {
            holidayHtml = '<div class="holiday-container"><h3>Holidays & Special Days</h3>';
            events.forEach(ev => {
                const emoji = ev.emoji || '';
                holidayHtml += `
                    <div class="event-item ${ev.getCategories().join(' ').toLowerCase()}">
                        <span class="event-emoji">${emoji}</span>
                        <span class="event-title">${ev.render('en')}</span>
                    </div>`;
            });
            holidayHtml += '</div>';
        }

        // Check if it's Friday (for candle lighting) or Saturday (for havdalah)
        const candleLighting = hebcal.HebrewCalendar.getCandleLighting(location, hDate);
        let candleHtml = '';
        if (candleLighting.length > 0) {
            candleHtml = '<div class="candle-container"><h3>Shabbat/Holiday Times</h3>';
            candleLighting.forEach(ev => {
                const emoji = ev.emoji || (ev.desc.includes('Havdalah') ? '✨' : '🕯');
                candleHtml += `
                    <div class="event-item candles">
                        <span class="event-emoji">${emoji}</span>
                        <span class="event-title">${ev.render('en')}</span>
                        <span class="event-date">${ev.eventTime.toLocaleTimeString()}</span>
                    </div>`;
            });
            candleHtml += '</div>';
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
