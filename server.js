const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use('/calendars', express.static(path.join(__dirname, 'calendars')));

// Add CORS headers for calendar files
app.use('/calendars', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Content-Type', 'text/calendar');
    next();
});

// Main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Calendar subscription info endpoint
app.get('/calendar-info', (req, res) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const calendarUrls = Object.keys(MAJOR_CITIES).reduce((acc, city) => {
        acc[city] = `${baseUrl}/calendars/${city.toLowerCase().replace(/[^a-z0-9]/g, '-')}.ics`;
        return acc;
    }, {});
    res.json(calendarUrls);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
