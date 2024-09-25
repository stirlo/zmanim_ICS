# Zmanim ICS

This project converts the Chabad.org Zmanim RSS feed to an ICS (iCalendar) format. It automatically updates the ICS file every 6 hours using GitHub Actions.

## Usage

To use this ICS feed, subscribe to the following URL in your calendar application:

https://stirlo.github.io/zmanim_ICS/chabad_zmanim.ics

## How it works

1. A Python script fetches the RSS feed from Chabad.org.
2. The script converts the RSS entries to ICS format.
3. GitHub Actions run this script every 6 hours and update the ICS file in this repository.
4. The ICS file is served via GitHub Pages.

## Contributing

Feel free to open issues or submit pull requests if you have any suggestions or improvements.