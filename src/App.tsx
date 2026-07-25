import React, { useState, useEffect } from 'react';
import { Loader2, CloudSun, MapPin, Sparkles, RefreshCw } from 'lucide-react';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { PlanningIntelligence } from './components/PlanningIntelligence';
import { HourlyForecastView } from './components/HourlyForecastView';
import { DailyForecastView } from './components/DailyForecastView';
import { ErrorAlert } from './components/ErrorAlert';
import { WeatherForecastResponse, UnitSystem } from './types';
import { fetchWeatherForLocation } from './services/weatherService';

export default function App() {
  const [unit, setUnit] = useState<UnitSystem>(() => {
    try {
      const saved = localStorage.getItem('weather_unit');
      return (saved as UnitSystem) || 'metric';
    } catch {
      return 'metric';
    }
  });

  const [weather, setWeather] = useState<WeatherForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Default initial load location: New York (or user saved last city)
  useEffect(() => {
    const initLocation = () => {
      try {
        const lastCity = localStorage.getItem('weather_last_location');
        if (lastCity) {
          const parsed = JSON.parse(lastCity);
          loadWeather(parsed.lat, parsed.lon, parsed.name, parsed.country, parsed.admin1);
          return;
        }
      } catch (e) {
        console.error(e);
      }
      // Fallback default: New York City
      loadWeather(40.7128, -74.006, 'New York', 'United States');
    };

    initLocation();
  }, []);

  // Save unit change
  const handleToggleUnit = () => {
    const nextUnit = unit === 'metric' ? 'imperial' : 'metric';
    setUnit(nextUnit);
    try {
      localStorage.setItem('weather_unit', nextUnit);
    } catch (e) {
      console.error(e);
    }
  };

  // Fetch weather data
  const loadWeather = async (
    lat: number,
    lon: number,
    name: string,
    country?: string,
    admin1?: string
  ) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await fetchWeatherForLocation(lat, lon, name, country, admin1);
      setWeather(data);

      // Save last location
      try {
        localStorage.setItem(
          'weather_last_location',
          JSON.stringify({ lat, lon, name, country, admin1 })
        );
      } catch (e) {
        console.error(e);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to fetch weather data for this location.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle GPS location click
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage('Geolocation is not supported by your browser.');
      return;
    }

    setIsLoadingLocation(true);
    setErrorMessage(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocode or fetch weather directly
          await loadWeather(latitude, longitude, 'Your Current Location');
        } catch (e) {
          setErrorMessage('Could not load weather for your current position.');
        } finally {
          setIsLoadingLocation(false);
        }
      },
      (error) => {
        setIsLoadingLocation(false);
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage('Location access was denied. Please search for a city manually.');
        } else {
          setErrorMessage('Failed to retrieve current location.');
        }
      },
      { timeout: 10000 }
    );
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#E2E8F0] font-sans antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Header & Search Navigation */}
      <Header
        unit={unit}
        onToggleUnit={handleToggleUnit}
        onSelectCity={(loc) => loadWeather(loc.lat, loc.lon, loc.name, loc.country, loc.admin1)}
        onUseCurrentLocation={handleUseCurrentLocation}
        isLoadingLocation={isLoadingLocation}
        selectedCityName={weather?.locationName}
      />

      {/* Main Content Area */}
      <main id="app-main-content" className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 space-y-8">
        {/* Error Alert Display */}
        {errorMessage && (
          <ErrorAlert
            message={errorMessage}
            onDismiss={() => setErrorMessage(null)}
            onRetry={() => {
              if (weather) {
                loadWeather(weather.latitude, weather.longitude, weather.locationName, weather.country, weather.admin1);
              } else {
                loadWeather(40.7128, -74.006, 'New York', 'United States');
              }
            }}
          />
        )}

        {/* Loading Spinner State */}
        {isLoading && !weather && (
          <div id="loading-state" className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center">
            <div className="relative">
              <CloudSun className="w-16 h-16 text-blue-400 animate-bounce" />
              <Loader2 className="w-8 h-8 text-amber-400 animate-spin absolute -bottom-2 -right-2" />
            </div>
            <h3 className="text-lg font-serif font-bold text-slate-200">Retrieving Live Weather Intelligence...</h3>
            <p className="text-xs text-slate-400 max-w-sm">Connecting to Open-Meteo APIs for real-time current conditions & 7-day forecast.</p>
          </div>
        )}

        {/* Loaded Weather Dashboard */}
        {weather && (
          <div className="space-y-8 animate-fade-in">
            {/* Current Weather Card */}
            <CurrentWeatherCard weather={weather} unit={unit} />

            {/* Planning & AI Intelligence Recommendations */}
            <PlanningIntelligence weather={weather} unit={unit} />

            {/* Hourly Forecast & Recharts Analytics */}
            <HourlyForecastView hourly={weather.hourly} unit={unit} />

            {/* 7-Day Forecast */}
            <DailyForecastView daily={weather.daily} unit={unit} />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer id="app-footer" className="mt-16 border-t border-[#1E293B] bg-[#0A0C10] py-6 text-center text-[11px] font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-2">
            <span className="text-blue-400 font-bold">SOURCE: OPEN-METEO API</span>
            <span>•</span>
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noreferrer"
              className="text-slate-400 hover:text-slate-200 underline"
            >
              Open-Meteo Public API
            </a>
            <span>& Gemini 3.6 Flash</span>
          </p>
          <p>© {new Date().getFullYear()} Nimbus Weather Intelligence. All metrics live.</p>
        </div>
      </footer>
    </div>
  );
}
