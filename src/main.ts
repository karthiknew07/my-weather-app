const apiKey = "218c011e7af98daaca5e548957b7c6df";

const fetchWeather = async (city: string) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("City not found");
    }
    const data = await response.json();
    displayWeather(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    displayError(errorMessage);
  }
};


const displayWeather = (data: any) => {
  const weatherDisplay = document.getElementById("weather-display");
  if (weatherDisplay) {
    const { name, main, weather, wind, sys } = data;
    weatherDisplay.innerHTML = `
      <div class="weather-card">
        <h2>${name}</h2>
        <p><strong>Temperature:</strong> ${main.temp}°C</p>
        <p><strong>Condition:</strong> ${weather[0].description}</p>
        <p><strong>Humidity:</strong> ${main.humidity}%</p>
        <p><strong>Wind Speed:</strong> ${wind.speed} m/s</p>
        <p><strong>Sunrise:</strong> ${new Date(sys.sunrise * 1000).toLocaleTimeString()}</p>
        <p><strong>Sunset:</strong> ${new Date(sys.sunset * 1000).toLocaleTimeString()}</p>
      </div>
    `;
  }
};

const displayError = (message: string) => {
  const weatherDisplay = document.getElementById("weather-display");
  if (weatherDisplay) {
    weatherDisplay.innerHTML = `<p class="error">${message}</p>`;
  }
};

document.getElementById("search-btn")?.addEventListener("click", () => {
  const cityInput = document.getElementById("city-input") as HTMLInputElement;
  if (cityInput?.value) {
    fetchWeather(cityInput.value.trim());
  }
});

// Dark mode toggle
const toggleDarkMode = () => {
  const theme = document.body.getAttribute("data-theme");
  document.body.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
};

document.getElementById("dark-mode-toggle")?.addEventListener("click", toggleDarkMode);