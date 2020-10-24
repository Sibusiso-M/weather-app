//https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=#yourapi#

//APP CONSTANTS AND VARS
const KELVIN = 273;
//API KEY
const key = "6cc608b621854d7853634306a159db44";

const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const tempDescriptionElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");
const tempMinElement = document.querySelector(".temperature-min p");
const tempMaxElement = document.querySelector(".temperature-max p");
//APP data
const weather = {};

weather.temperature = {
    unit: "celsius"
};
weather.temperature = {
    unit: "celsius",
    value: 0,
    min : 0,
    max: 0
};




if ('geolocation' in navigator) {
    //Get user current position if available
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't support Geolocation</p>";
}

//SET USER'S POSITION

function setPosition(position) {
    let lat = position.coords.latitude;
    let long = position.coords.longitude;

    getWeather(lat, long);
}

function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p>${error.message}</p>`;
}

//SHOW ERROR IS ANY WITH GEOLOCATION SERVICE


function displayWeather() {
    iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML = `${weather.temperature.value}&deg; <span>C</span>`;
    tempDescriptionElement.innerHTML = weather.description;
    locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    tempMinElement.innerHTML = `${weather.temperature.max}&deg;`;
    tempMaxElement.innerHTML = `${weather.temperature.max}&deg;`;
};



function celsiusToFahrenheit(temperature) {
    return (temperature * 9 / 5) + 32;
}

tempElement.addEventListener("click", function () {

    if (weather.temperature.value === undefined) return;
    if (weather.temperature.min === undefined) return; 
    if (weather.temperature.max === undefined) return; 

    if (weather.temperature.unit === "celsius") {
        let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
        let fahrenheit_min = celsiusToFahrenheit(weather.temperature.min);
        let fahrenheit_max = celsiusToFahrenheit(weather.temperature.max)

        fahrenheit = Math.floor(fahrenheit);
        fahrenheit_min = Math.floor(fahrenheit_min);
        fahrenheit_max = Math.floor(fahrenheit_max);

        tempElement.innerHTML = `${fahrenheit}&deg;<span>F</span>`;
        tempMinElement.innerHTML = `${fahrenheit_min}&deg;`;
        tempMaxElement.innerHTML = `${fahrenheit_max}&deg;`;
        weather.temperature.unit = "fahrenheit";
    } else {
        let celsius = weather.temperature.value;
        let temp_min = weather.temperature.min;
        let temp_max = weather.temperature.max;
        tempElement.innerHTML = `${celsius}&deg;<span>C</span>`;
        tempMinElement.innerHTML = `${temp_min}&deg;`;
        tempMaxElement.innerHTML = `${temp_max}&deg;`;
        weather.temperature.unit = "celsius";
    }
})

function getWeather(lat, long) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${long}&APPID=${key}`;

    console.log(api);

    fetch(api).then(function (response) {
        //parse json
        let data = response.json();
        return data;
    })
    .then(function (data) {
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.temperature.min = Math.floor(data.main.temp_min - KELVIN);
        weather.temperature.max = Math.floor(data.main.temp_max - KELVIN);

        weather.description = data.weather[0].description;
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;

    })
    .then(function () {
        //update inner html
        displayWeather();
    })

}
