const apiKey = "218c011e7af98daaca5e548957b7c6df";

// Define types for the weather and forecast data


interface WeatherData {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: [
    {
      icon: string;
      description: string;
    }
  ];
  wind: {
    speed: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  coord: {
    lat: number;
    lon: number;
  };
}



interface ForecastData {
  list: Array<{
    dt: number;
    main: {
      temp: number;
    };
    weather: [
      {
        icon: string;
        description: string;
      }
    ];
  }>;
}



// Fetch current weather and 5-day forecast
const fetchWeather = async (city: string): Promise<void> => {

  try {

    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );

    if (!weatherResponse.ok) {
      throw new Error("City not found");
    }

    const weatherData: WeatherData = await weatherResponse.json();

    // Fetch 5-day forecast
    const { coord } = weatherData; // Get latitude and longitude
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coord.lat}&lon=${coord.lon}&appid=${apiKey}&units=metric`
    );

    if (!forecastResponse.ok) {
      throw new Error("Forecast data not found");
    }

    const forecastData: ForecastData = await forecastResponse.json();
    displayWeather(weatherData, forecastData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    displayError(errorMessage);
  }
};



// Display current weather and 5-day forecast
const displayWeather = (weatherData: WeatherData, forecastData: ForecastData): void => {
  const weatherDisplay = document.getElementById("weather-display");
  if (weatherDisplay) {
    const { name, main, weather, wind, sys } = weatherData;
    const forecastList = forecastData.list.filter((_, index) => index % 8 === 0); // Get daily forecast

    weatherDisplay.innerHTML = `
      <div class="weather-card">
        <h2>${name}</h2>
        <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}" />
        <p>${weather[0].description}</p>
        <p><strong>Temperature:</strong> ${main.temp}°C</p>
        <p><strong>Condition:</strong> ${weather[0].description}</p>
        <p><strong>Humidity:</strong> ${main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
        <p><strong>Sunrise:</strong> ${new Date(sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p><strong>Sunset:</strong> ${new Date(sys.sunset * 1000).toLocaleTimeString()}</p>
      </div>
      
      <div class="forecast">
        <h3><center>5-Day Forecast</center></h3>
        <div class="forecast-list">
          ${forecastList
            .map((forecast) => {
              const { dt, main, weather } = forecast;
              return `
                <div class="forecast-item">
                  <p><strong>${new Date(dt * 1000).toLocaleDateString()}</strong></p>
                  <img src="http://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="${weather[0].description}" />
                  <p>${weather[0].description}</p>
                  <p><strong>Temp:</strong> ${main.temp}°C</p>
                </div>
              `;
            })
            .join("")}
        </div>
      </div>
    `;
  }
};



// Display error message
const displayError = (message: string): void => {
  const weatherDisplay = document.getElementById("weather-display");
  if (weatherDisplay) {
    weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
  }
};



// Fetch city suggestions based on user input
const fetchCitySuggestions = async (input: string): Promise<void> => {
  try {
    const suggestionResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/find?q=${input}&appid=${apiKey}&units=metric`
    );
    if (suggestionResponse.ok) {
      const suggestionData = await suggestionResponse.json();
      displayCitySuggestions(suggestionData.list);
    }
  } catch (error) {
    displayError("Error fetching city suggestions");
  }
};



// Display the city suggestions in the dropdown
const displayCitySuggestions = (cities: Array<{ name: string; sys: { country: string } }>): void => {
  const suggestionContainer = document.getElementById("city-suggestions");
  if (suggestionContainer) {
    suggestionContainer.innerHTML = cities
      .map(
        (city) => `
      <div class="suggestion-item" data-city="${city.name},${city.sys.country}">
        ${city.name}, ${city.sys.country}
      </div>`
      )
      .join("");



    // Add event listener for selecting a city
    const suggestionItems = document.querySelectorAll(".suggestion-item");
    suggestionItems.forEach((item) =>
      item.addEventListener("click", () => {
        const selectedCity = item.getAttribute("data-city");
        if (selectedCity) {
          (document.getElementById("city-input") as HTMLInputElement).value = selectedCity;
          fetchWeather(selectedCity);
          suggestionContainer.innerHTML = ""; 
          suggestionContainer.style.display = "none"; 
        }
      })
    );
  }
};




// Event listener for the search button
document.getElementById("search-btn")?.addEventListener("click", () => {
  const cityInput = document.getElementById("city-input") as HTMLInputElement;
  const city = cityInput?.value.trim();
  if (city) {
    fetchWeather(city); 
  }
}
);



// Event listener for city input to fetch suggestions
document.getElementById("city-input")?.addEventListener("input", (event) => {
  const cityInput = (event.target as HTMLInputElement).value.trim();
  if (cityInput.length >= 3) {
    fetchCitySuggestions(cityInput); 
    document.getElementById("city-suggestions")!.style.display = "block";
  } else {
    document.getElementById("city-suggestions")!.style.display = "none"; 
  }
});

// Dark mode toggle
const toggleDarkMode = (): void => {
  const theme = document.body.getAttribute("data-theme");
  document.body.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
  localStorage.setItem("theme", theme === "dark" ? "light" : "dark");
};



document.addEventListener("DOMContentLoaded", () => {
  const storedTheme = localStorage.getItem("theme") || "light";
  document.body.setAttribute("data-theme", storedTheme);
}
);



document.getElementById("dark-mode-toggle")?.addEventListener("click", toggleDarkMode);


