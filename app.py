from flask import Flask, render_template, send_file, jsonify
from datetime import datetime
import pytz
from cities import CITIES
from pathlib import Path

app = Flask(__name__)

@app.route('/')
def index():
    # Since index.html is in root directory
    return send_file('index.html')

@app.route('/calendars')
def calendar_page():
    # Get current time for "last updated" display
    last_update = datetime.now().strftime('%Y-%m-%d %H:%M')
    return render_template('calendars.html', cities=CITIES, last_update=last_update)

@app.route('/static/calendars/<path:filename>')
def serve_calendar(filename):
    """Serve calendar files"""
    return send_file(f'static/calendars/{filename}')

@app.route('/health')
def health_check():
    """Simple health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    # Ensure the calendars directory exists
    Path("static/calendars").mkdir(parents=True, exist_ok=True)
    app.run(debug=True)
