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
        const location = new hebcal.GeoLocation(
            "Custom Location",
            parseFloat(lat),
            parseFloat(lon),
            0, // elevation
            "UTC" // timezone
        );

        // Get current date
        const now = new Date();
        const hDate = new hebcal.HDate(now);

        // Create NOAA Calculator
        const noaa = new hebcal.NOAACalculator(location, hDate);

        // Get zmanim
        const sunrise = noaa.getSunrise();
        const sunset = noaa.getSunset();
        const alotHaShachar = noaa.alotHaShachar();
        const misheyakir = noaa.misheyakir();
        const sofZmanShma = noaa.sofZmanShma();
        const sofZmanTfilla = noaa.sofZmanTfilla();
        const chatzot = noaa.chatzot();
        const minchaGedola = noaa.minchaGedola();
        const minchaKetana = noaa.minchaKetana();
        const plagHaMincha = noaa.plagHaMincha();
        const tzeit = noaa.tzeit();

        // Format the results
        const hebrewDateStr = hDate.toString();
        const location_str = `${parseFloat(lat).toFixed(3)}°, ${parseFloat(lon).toFixed(3)}°`;

        document.getElementById('result').innerHTML = 
            `<div>Hebrew Date: ${hebrewDateStr}</div>` +
            `<div>Location: ${location_str}</div>` +
            `<div class="zmanim-container">
                <div>Alot HaShachar: ${formatTime(alotHaShachar)}</div>
                <div>Misheyakir: ${formatTime(misheyakir)}</div>
                <div>Sunrise: ${formatTime(sunrise)}</div>
                <div>Sof Zman Shma: ${formatTime(sofZmanShma)}</div>
                <div>Sof Zman Tfilla: ${formatTime(sofZmanTfilla)}</div>
                <div>Chatzot: ${formatTime(chatzot)}</div>
                <div>Mincha Gedola: ${formatTime(minchaGedola)}</div>
                <div>Mincha Ketana: ${formatTime(minchaKetana)}</div>
                <div>Plag HaMincha: ${formatTime(plagHaMincha)}</div>
                <div>Sunset: ${formatTime(sunset)}</div>
                <div>Tzeit HaKochavim: ${formatTime(tzeit)}</div>
            </div>`;

    } catch (error) {
        console.error('Error:', error);
        document.getElementById('result').innerHTML = 
            `<div>Error calculating Hebrew date: ${error.message}</div>`;
        document.getElementById('debug').innerHTML = 
            `Debug info: ${error.stack}`;
    }
}

function formatTime(date) {
    return date ? date.toLocaleTimeString() : 'N/A';
}
