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
        // Create location using the newer API
        const location = new hebcal.Location(
            parseFloat(lat),
            parseFloat(lon),
            false, // useElevation
            'UTC', // timezone string
            'Custom Location', // name
            'XX', // country code
            0 // elevation
        );

        // Create HDate instance
        const hDate = new hebcal.HDate();

        // Create Zmanim instance with the newer API
        const zmanim = new hebcal.Zmanim(location, hDate.greg());

        // Get zmanim times using the newer method names
        const zmanimTimes = {
            'Sunrise': zmanim.sunrise,
            'Sunset': zmanim.sunset,
            'Chatzot': zmanim.chatzot,
            'Mincha Gedola': zmanim.minchaGedola,
            'Plag HaMincha': zmanim.plagHaMincha
        };

        let zmanimHtml = '';
        for (const [name, time] of Object.entries(zmanimTimes)) {
            if (time instanceof Date) {
                zmanimHtml += `<p><strong>${name}:</strong> ${time.toLocaleTimeString()}</p>`;
            }
        }

        resultDiv.innerHTML = `
            <h3>Results for ${now.toLocaleDateString()}</h3>
            <p><strong>Hebrew Date:</strong> ${hDate.toString()}</p>
            <p><strong>Location:</strong> ${lat}°, ${lon}°</p>
            <h3>Zmanim</h3>
            ${zmanimHtml}
        `;
        resultDiv.classList.remove('hidden');
    } catch (error) {
        console.error('Error:', error);
        showError('Error calculating Hebrew date. Please try again.');
    } finally {
        hideLoading(button);
    }
}
