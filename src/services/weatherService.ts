import { CityLocation, WeatherForecastResponse } from '../types';

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) {
    return [];
  }

  try {
    const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query.trim())}&count=10&language=en&format=json`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }

    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }

    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      latitude: item.latitude,
      longitude: item.longitude,
      elevation: item.elevation,
      country_code: item.country_code,
      country: item.country,
      admin1: item.admin1,
      timezone: item.timezone,
      population: item.population,
    }));
  } catch (error) {
    console.error('Error searching cities:', error);
    throw error;
  }
}

export async function fetchWeatherForLocation(
  lat: number,
  lon: number,
  locationName: string,
  country?: string,
  admin1?: string
): Promise<WeatherForecastResponse> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'is_day',
        'precipitation',
        'rain',
        'showers',
        'snowfall',
        'weather_code',
        'cloud_cover',
        'pressure_msl',
        'surface_pressure',
        'wind_speed_10m',
        'wind_direction_10m',
        'wind_gusts_10m',
        'uv_index',
      ].join(','),
      hourly: [
        'temperature_2m',
        'relative_humidity_2m',
        'apparent_temperature',
        'precipitation_probability',
        'precipitation',
        'weather_code',
        'pressure_msl',
        'cloud_cover',
        'wind_speed_10m',
        'uv_index',
        'visibility',
      ].join(','),
      daily: [
        'weather_code',
        'temperature_2m_max',
        'temperature_2m_min',
        'apparent_temperature_max',
        'apparent_temperature_min',
        'sunrise',
        'sunset',
        'uv_index_max',
        'precipitation_sum',
        'rain_sum',
        'showers_sum',
        'snowfall_sum',
        'precipitation_hours',
        'precipitation_probability_max',
        'wind_speed_10m_max',
        'wind_gusts_10m_max',
        'wind_direction_10m_dominant',
      ].join(','),
      timezone: 'auto',
    });

    const url = `${FORECAST_BASE_URL}?${params.toString()}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather fetch failed with status ${response.status}`);
    }

    const data = await response.json();

    // Map current
    const current = {
      time: data.current.time,
      temperature: data.current.temperature_2m,
      apparentTemperature: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      isDay: Boolean(data.current.is_day),
      precipitation: data.current.precipitation,
      rain: data.current.rain,
      showers: data.current.showers,
      snowfall: data.current.snowfall,
      weatherCode: data.current.weather_code,
      cloudCover: data.current.cloud_cover,
      pressureMsl: data.current.pressure_msl,
      surfacePressure: data.current.surface_pressure,
      windSpeed: data.current.wind_speed_10m,
      windDirection: data.current.wind_direction_10m,
      windGusts: data.current.wind_gusts_10m,
      uvIndex: data.current.uv_index,
    };

    // Map hourly (first 48 hours for immediate performance)
    const hourlyLength = Math.min(data.hourly.time.length, 48);
    const hourly = [];
    for (let i = 0; i < hourlyLength; i++) {
      hourly.push({
        time: data.hourly.time[i],
        temperature: data.hourly.temperature_2m[i],
        apparentTemperature: data.hourly.apparent_temperature[i],
        humidity: data.hourly.relative_humidity_2m[i],
        precipitationProbability: data.hourly.precipitation_probability[i] ?? 0,
        precipitation: data.hourly.precipitation[i] ?? 0,
        weatherCode: data.hourly.weather_code[i],
        pressureMsl: data.hourly.pressure_msl[i],
        cloudCover: data.hourly.cloud_cover[i],
        windSpeed: data.hourly.wind_speed_10m[i],
        uvIndex: data.hourly.uv_index[i] ?? 0,
        visibility: data.hourly.visibility?.[i] ?? 10000,
      });
    }

    // Map daily (7 days)
    const dailyLength = Math.min(data.daily.time.length, 7);
    const daily = [];
    for (let i = 0; i < dailyLength; i++) {
      daily.push({
        date: data.daily.time[i],
        weatherCode: data.daily.weather_code[i],
        tempMax: data.daily.temperature_2m_max[i],
        tempMin: data.daily.temperature_2m_min[i],
        apparentTempMax: data.daily.apparent_temperature_max[i],
        apparentTempMin: data.daily.apparent_temperature_min[i],
        sunrise: data.daily.sunrise[i],
        sunset: data.daily.sunset[i],
        uvIndexMax: data.daily.uv_index_max[i] ?? 0,
        precipitationSum: data.daily.precipitation_sum[i] ?? 0,
        rainSum: data.daily.rain_sum[i] ?? 0,
        showersSum: data.daily.showers_sum[i] ?? 0,
        snowfallSum: data.daily.snowfall_sum[i] ?? 0,
        precipitationHours: data.daily.precipitation_hours[i] ?? 0,
        precipitationProbabilityMax: data.daily.precipitation_probability_max[i] ?? 0,
        windSpeedMax: data.daily.wind_speed_10m_max[i],
        windGustsMax: data.daily.wind_gusts_10m_max[i],
        windDirectionDominant: data.daily.wind_direction_10m_dominant[i],
      });
    }

    return {
      latitude: data.latitude,
      longitude: data.longitude,
      elevation: data.elevation,
      timezone: data.timezone,
      timezoneAbbreviation: data.timezone_abbreviation,
      locationName,
      country,
      admin1,
      current,
      hourly,
      daily,
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw new Error('Could not retrieve weather forecast for this location. Please try again.');
  }
}
