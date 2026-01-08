const apiKey = import.meta.env.VITE_WEATHER_API_KEY;
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const currentWeatherSection = document.getElementById('current-weather-section');
const forecastCards = document.getElementById('forecast-cards');
const errorMessage = document.getElementById('error-message');
const unitRadios = document.querySelectorAll('input[name="unit"]');
const themeToggle = document.getElementById('theme-toggle');
const historySection = document.getElementById('history-section');

let currentUnit = 'metric';
let lastCitySearched = '';

// THEME TOGGLE (Light/Dark)
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});
window.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.add('light-theme');
    }
    // Show default city on load
    fetchWeatherData('London');
});

// UNITS TOGGLE
unitRadios.forEach(radio => {
    radio.addEventListener('change', function() {
        currentUnit = this.value;
        if (lastCitySearched) fetchWeatherData(lastCitySearched);
    });
});

// SEARCH BUTTON
searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) fetchWeatherData(city);
});
cityInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchBtn.click();
});
locationBtn.addEventListener('click', getGeolocationWeather);

// FETCH WEATHER DATA BY CITY
async function fetchWeatherData(city) {
    try {
        lastCitySearched = city;
        const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${currentUnit}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=${currentUnit}`;
        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentWeatherUrl),
            fetch(forecastUrl)
        ]);
        if (!currentResponse.ok || !forecastResponse.ok) throw new Error('City not found.');
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();
        displayCurrentWeather(currentData);
        displayForecast(forecastData);
        errorMessage.classList.add('hidden');
    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
        currentWeatherSection.innerHTML = '';
        forecastCards.innerHTML = '';
        historySection.innerHTML = '';
    }
}

// FETCH WEATHER DATA BY LOCATION
function getGeolocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            try {
                const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
                const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${currentUnit}`;
                const [currentResponse, forecastResponse] = await Promise.all([
                    fetch(currentWeatherUrl), fetch(forecastUrl)
                ]);
                if (!currentResponse.ok || !forecastResponse.ok) throw new Error('Could not fetch weather data for your location.');
                const currentData = await currentResponse.json();
                const forecastData = await forecastResponse.json();
                displayCurrentWeather(currentData);
                displayForecast(forecastData);
                errorMessage.classList.add('hidden');
                lastCitySearched = currentData.name;
            
            } catch (error) {
                errorMessage.textContent = 'Could not fetch weather data for your location.';
                errorMessage.classList.remove('hidden');
                historySection.innerHTML = '';
            }
        }, () => {
            errorMessage.textContent = 'Geolocation access denied. Please enter a city.';
            errorMessage.classList.remove('hidden');
            historySection.innerHTML = '';
        });
    } else {
        errorMessage.textContent = 'Geolocation is not supported by this browser.';
        errorMessage.classList.remove('hidden');
        historySection.innerHTML = '';
    }
}

// DISPLAY CURRENT WEATHER + SUNRISE/SUNSET
function displayCurrentWeather(data) {
    const { name, main, weather, wind, sys, coord } = data;
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    currentWeatherSection.innerHTML = `
        <h2>${name}${sys && sys.country ? ', ' + sys.country : ''}</h2>
        <div>
            <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}">
            <p><strong>${weather[0].main}</strong> - ${weather[0].description}</p>
            <p>Temperature: ${main.temp} ${tempUnit}</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} ${currentUnit === 'metric' ? 'm/s' : 'mph'}</p>
            <p>Sunrise: ${sunrise}</p>
            <p>Sunset: ${sunset}</p>
        </div>
    `;
}

// DISPLAY FORECAST
function displayForecast(data) {
    forecastCards.innerHTML = '';
    const daily = {};
    data.list.forEach(item => {
        const date = item.dt_txt.split(' ')[0];
        if (!daily[date] && item.dt_txt.includes('12:00:00')) daily[date] = item;
    });
    let count = 0;
    const tempUnit = currentUnit === 'metric' ? '°C' : '°F';
    for (let date in daily) {
        if (count >= 5) break;
        const item = daily[date];
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <h3>${new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</h3>
            <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}">
            <p><strong>${item.weather[0].main}</strong></p>
            <p>Temp: ${item.main.temp} ${tempUnit}</p>
            <p>Humidity: ${item.main.humidity}%</p>
        `;
        forecastCards.appendChild(card);
        count++;
    }
}