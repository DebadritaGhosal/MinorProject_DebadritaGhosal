Weather Dashboard - A responsive and interactive Weather Dashboard built using HTML, CSS, and JavaScript that provides real-time weather information and 5-day forecasts. The application integrates the OpenWeather API to fetch weather data and offers features such as city search, location-based weather updates, temperature unit conversion, and a persistent light/dark theme.

Features - 
Real-Time Weather Updates: Fetches current weather conditions using the OpenWeather API.
5-Day Weather Forecast: Displays upcoming weather conditions to help users plan ahead.
City Search: Allows users to search for weather information by entering a city name.
Geolocation: Automatically retrieves weather information based on the user's current location.
Temperature Unit Conversion: Supports switching between Celsius and Fahrenheit.
Light/Dark Mode: Provides theme switching with persistent user preferences.
Responsive UI: Adapts the interface to different screen sizes and devices.
Error Handling: Handles invalid city searches, API errors, and location-related issues.

Tech Stack -
HTML5 – Structures the dashboard interface.
CSS3 – Handles styling, layout, and responsive design.
JavaScript – Implements application logic and dynamic UI updates.
OpenWeather API – Provides real-time weather data and forecasts.
Browser Geolocation API – Retrieves the user's geographical coordinates.
Fetch API / Axios – Handles asynchronous HTTP requests and API integration.

How It Works -
City Search: Users enter a city name to retrieve its weather information.
Location Detection: The Browser Geolocation API obtains the user's coordinates when location access is granted.
API Integration: Fetch API/Axios sends asynchronous requests to the OpenWeather API.
Data Processing: JavaScript processes the API response and dynamically updates current weather conditions and forecast information.
Unit Conversion: Users can switch between Celsius and Fahrenheit.

Theme Preferences: Users can toggle between light and dark modes, with their preference retained across sessions.
