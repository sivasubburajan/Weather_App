export type UnitSystem = 'metric' | 'imperial';

export interface CityLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  country?: string;
  admin1?: string; // State / Region
  timezone?: string;
  population?: number;
}

export interface WmoCodeDetails {
  code: number;
  label: string;
  description: string;
  iconName: string; // Lucide icon identifier
  category: 'clear' | 'cloudy' | 'fog' | 'drizzle' | 'rain' | 'snow' | 'storm';
  bgGradientDay: string;
  bgGradientNight: string;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  isDay: boolean;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  uvIndex: number;
}

export interface HourlyPoint {
  time: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  precipitationProbability: number;
  precipitation: number;
  weatherCode: number;
  pressureMsl: number;
  cloudCover: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number; // meters
}

export interface DailyPoint {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  rainSum: number;
  showersSum: number;
  snowfallSum: number;
  precipitationHours: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
}

export interface WeatherForecastResponse {
  latitude: number;
  longitude: number;
  elevation: number;
  timezone: string;
  timezoneAbbreviation: string;
  locationName: string;
  country?: string;
  admin1?: string;
  current: CurrentWeatherData;
  hourly: HourlyPoint[];
  daily: DailyPoint[];
}

export interface ActivityScores {
  sports: { score: number; verdict: string; tips: string };
  picnic: { score: number; verdict: string; tips: string };
  sightseeing: { score: number; verdict: string; tips: string };
  driving: { score: number; verdict: string; tips: string };
  drying: { score: number; verdict: string; tips: string };
}

export interface OutfitRecommendation {
  summary: string;
  layers: string[];
  outerwear: string;
  footwear: string;
  accessories: string[];
  headsup?: string;
}

export interface AiBriefingResponse {
  summary: string;
  highlights: string[];
  outdoorAdvice: string;
  clothingTip: string;
  travelWarning?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
