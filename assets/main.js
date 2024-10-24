function findMe() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            document.getElementById('latitude').value = position.coords.latitude.toFixed(3);
            document.getElementById('longitude').value = position.coords.longitude.toFixed(3);
        }, error => {
            alert("Error getting location: " + error.message);
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function calculateHebrewDate() {
    const lat = document.getElementById('latitude').value;
    const lon = document.getElementById('longitude').value;

    if (!lat || !lon) {
        alert("Please enter latitude and longitude");
        return;
    }

    // Create location object using @hebcal/core
    const location = new Hebcal.Location({
        lat: parseFloat(lat),
        long: parseFloat(lon),
        il: false // not in Israel
    });

    // Get current date
    const today = new Date();
    const hDate = new Hebcal.HDate();

    // Get zmanim (times) for the location
    const times = Hebcal.Zmanim.getZmanimJson(location, today);

    // Format the result
    const hebrewDateStr = hDate.renderGematriya();
    const location_str = `${parseFloat(lat).toFixed(3)}°, ${parseFloat(lon).toFixed(3)}°`;

    document.getElementById('result').innerHTML = 
        `<div>Hebrew Date: ${hebrewDateStr}</div>` +
        `<div>Location: ${location_str}</div>` +
        `<div>Sunrise: ${times.sunrise}</div>` +
        `<div>Sunset: ${times.sunset}</div>`;
}
