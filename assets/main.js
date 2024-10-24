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

function calculateHebrewDate() {
    try {
        const lat = document.getElementById('latitude').value;
        const lon = document.getElementById('longitude').value;

        if (!lat || !lon) {
            alert("Please enter latitude and longitude");
            return;
        }

        // Create location object
        const location = {
            lat: parseFloat(lat),
            long: parseFloat(lon),
            il: false
        };

        // Get current date
        const now = new Date();

        // Create Hebrew date
        const events = Hebcal.HebrewCalendar.getHolidaysForDate(now);
        const hDate = new Hebcal.HDate(now);

        // Get zmanim (times) for the location
        const times = Hebcal.Zmanim.getSunriseSunset(location, now);

        // Format the result
        const hebrewDateStr = hDate.toString();
        const location_str = `${parseFloat(lat).toFixed(3)}°, ${parseFloat(lon).toFixed(3)}°`;

        let holidayStr = '';
        if (events && events.length > 0) {
            holidayStr = '<div>Holidays: ' + events.map(ev => ev.render()).join(', ') + '</div>';
        }

        document.getElementById('result').innerHTML = 
            `<div>Hebrew Date: ${hebrewDateStr}</div>` +
            `<div>Location: ${location_str}</div>` +
            `<div>Sunrise: ${times.sunrise ? times.sunrise.toLocaleTimeString() : 'N/A'}</div>` +
            `<div>Sunset: ${times.sunset ? times.sunset.toLocaleTimeString() : 'N/A'}</div>` +
            holidayStr;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = 
            `<div>Error calculating Hebrew date: ${error.message}</div>`;
        document.getElementById('debug').innerHTML = 
            `Debug info: ${error.stack}`;
    }
}
