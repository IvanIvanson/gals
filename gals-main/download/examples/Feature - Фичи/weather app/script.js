window.onload = function(){
    const getWeatherButton = document.getElementById("get-weather-btn");
const cityNameInput = document.getElementById("city-name-input");
const weatherDescriptionContainer = document.getElementById("weather-description");
const weatherIconContainer = document.getElementById("weather-icon");
const temperatureContainer = document.getElementById("temperature");
const windSpeedContainer = document.getElementById("wind-speed");

const apiKey = "12049415279add787dcaff4ee78ae8ab";


async function getCurrentWeather(city) {
    try {
        const url = new URL("https://api.openweathermap.org/data/2.5/weather");
        url.search = new URLSearchParams(
            {
                q: city,
                appid: apiKey,
                units: "metric",
            }
        ).toString();
        const response = await fetch(url);
        if (response.ok) {
            return await response.json();
        }
        throw new Error(`Request failed with status ${response.status}: ${response.statusText}`);
    } catch (error) {
        console.error(error);
    }
}

function extractWeatherData(response) {
    const temperature = response.main.temp;
    const weatherDescription = response.weather[0].description;
    const weatherIcon = response.weather[0].icon;
    const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherIcon}.png`;
    const windSpeed = response.wind.speed;
    return {
        temperature,
        weatherDescription,
        weatherIconUrl,
        windSpeed,
    }
}

function displayWeather(weatherData) {
    const { temperature, weatherDescription, weatherIconUrl, windSpeed } = weatherData;
    weatherDescriptionContainer.textContent = "Weather: " + weatherDescription;
    weatherIconContainer.src = weatherIconUrl;
    temperatureContainer.textContent = "Temperature: " + temperature;
    windSpeedContainer.textContent = "Wind speed: " + windSpeed;
}

getWeatherButton.addEventListener("click", async (ev) => {
    ev.preventDefault();
    const city = cityNameInput.value;
    if (!city) return alert("Please enter a city name");
    const response = await getCurrentWeather(city);
    const weatherData = extractWeatherData(response);
    displayWeather(weatherData);
    cityNameInput.value = "";
});

}