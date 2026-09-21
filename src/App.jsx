import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [searchCity, setSearchCity] = useState("Kolkata");

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Put your OpenWeatherMap API key here
  const API_KEY = "ec64e08309f6bb5af331422ff838347c";

  useEffect(() => {
    fetchWeather(searchCity);
  }, [searchCity]);

  const fetchWeather = async (cityName) => {
    try {
      setLoading(true);
      setError("");
      setWeather(null);

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();

      setWeather(data);
    } catch (err) {
      setError("Unable to find the city. Please enter a valid city name.");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();

    if (city.trim() === "") {
      setError("Please enter a city name.");
      return;
    }

    setSearchCity(city.trim());
    setCity("");
  };

  // Convert Unix timestamp into readable time
  const formatTime = (timestamp, timezone) => {
    const localTime = new Date((timestamp + timezone) * 1000);

    return localTime.toUTCString().slice(17, 22);
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <h1>🌤 Weather Dashboard</h1>
        <p>Check current weather information for any city</p>
      </header>

      {/* Search Section */}
      <section className="search-section">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <button type="submit">
            Search
          </button>
        </form>
      </section>

      {/* Loading */}
      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="error">
          <span>⚠️</span>
          <p>{error}</p>
        </div>
      )}

      {/* Weather Data */}
      {weather && !loading && !error && (
        <main className="weather-container">

          {/* Location */}
          <div className="location">
            <h2>
              {weather.name}, {weather.sys.country}
            </h2>

            <p>
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          {/* Main Weather */}
          <div className="main-weather">

            <div className="temperature-section">

              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt={weather.weather[0].description}
                className="weather-icon"
              />

              <div>
                <h3>{Math.round(weather.main.temp)}°C</h3>

                <p className="weather-description">
                  {weather.weather[0].description}
                </p>
              </div>

            </div>

            <div className="feels-like">
              Feels like {Math.round(weather.main.feels_like)}°C
            </div>

          </div>

          {/* Weather Information Cards */}
          <div className="weather-cards">

            {/* Humidity */}
            <div className="weather-card">
              <div className="card-icon">💧</div>

              <div>
                <h4>Humidity</h4>
                <p>{weather.main.humidity}%</p>
              </div>
            </div>

            {/* Wind */}
            <div className="weather-card">
              <div className="card-icon">💨</div>

              <div>
                <h4>Wind Speed</h4>
                <p>{weather.wind.speed} m/s</p>
              </div>
            </div>

            {/* Sunrise */}
            <div className="weather-card">
              <div className="card-icon">🌅</div>

              <div>
                <h4>Sunrise</h4>
                <p>
                  {formatTime(
                    weather.sys.sunrise,
                    weather.timezone
                  )}
                </p>
              </div>
            </div>

            {/* Sunset */}
            <div className="weather-card">
              <div className="card-icon">🌇</div>

              <div>
                <h4>Sunset</h4>
                <p>
                  {formatTime(
                    weather.sys.sunset,
                    weather.timezone
                  )}
                </p>
              </div>
            </div>

          </div>

          {/* Additional Information */}
          <div className="additional-info">

            <div>
              <span>Pressure</span>
              <strong>{weather.main.pressure} hPa</strong>
            </div>

            <div>
              <span>Visibility</span>
              <strong>
                {(weather.visibility / 1000).toFixed(1)} km
              </strong>
            </div>

            <div>
              <span>Min Temperature</span>
              <strong>
                {Math.round(weather.main.temp_min)}°C
              </strong>
            </div>

            <div>
              <span>Max Temperature</span>
              <strong>
                {Math.round(weather.main.temp_max)}°C
              </strong>
            </div>

          </div>

        </main>
      )}

      {/* Footer */}
      <footer>
        <p>Weather Dashboard | React JS + OpenWeatherMap API</p>
      </footer>

    </div>
  );
}

export default App;