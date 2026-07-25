import React from 'react';
import {
  Droplets,
  Wind,
  Sun,
  Eye,
  Gauge,
  Cloud,
  Sunset,
  Sunrise,
  ArrowUpRight,
  TrendingUp,
  ShieldAlert,
  Compass,
} from 'lucide-react';
import { WeatherForecastResponse, UnitSystem } from '../types';
import {
  getWmoInfo,
  formatTemp,
  formatSpeed,
  formatPrecip,
  degreesToCardinal,
  getUvCategory,
} from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  weather: WeatherForecastResponse;
  unit: UnitSystem;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, unit }) => {
  const current = weather.current;
  const todayDaily = weather.daily[0];
  const wmo = getWmoInfo(current.weatherCode);
  const uvCategory = getUvCategory(current.uvIndex);
  const windDirName = degreesToCardinal(current.windDirection);

  // Format local date and time
  const formattedTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' });

  // Calculate daylight percentage
  let daylightPercent = 50;
  if (todayDaily?.sunrise && todayDaily?.sunset) {
    const now = new Date().getTime();
    const rise = new Date(todayDaily.sunrise).getTime();
    const set = new Date(todayDaily.sunset).getTime();
    if (now < rise) daylightPercent = 0;
    else if (now > set) daylightPercent = 100;
    else daylightPercent = Math.min(100, Math.max(0, ((now - rise) / (set - rise)) * 100));
  }

  return (
    <div
      id="current-weather-card"
      className="relative overflow-hidden rounded-3xl bg-[#111827] text-white shadow-2xl p-6 sm:p-8 border border-[#1E293B] transition-all duration-500"
    >
      {/* Decorative ambient subtle blue glow */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header: Location & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 id="weather-location-title" className="text-3xl font-serif text-white tracking-wide">
              {weather.locationName}
            </h2>
            {weather.country && (
              <span id="weather-country-badge" className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider border border-blue-500/20">
                {weather.country}
              </span>
            )}
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
              Live
            </span>
          </div>
          <p id="weather-datetime-label" className="text-xs text-slate-400 font-medium mt-1.5 flex items-center gap-2">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>Local Time: {formattedTime}</span>
          </p>
        </div>

        {/* Condition Badge */}
        <div id="weather-condition-badge" className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-[#1E293B]/80 border border-[#334155] shadow-lg shrink-0">
          <WeatherIcon iconName={wmo.iconName} className="w-5 h-5 text-blue-400" />
          <span className="text-sm font-semibold tracking-wide text-slate-200">{wmo.label}</span>
        </div>
      </div>

      {/* Main Temperature & UV Gauge Display */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-8 items-center">
        {/* Left: Temp */}
        <div className="flex flex-col">
          <div className="flex items-baseline gap-4">
            <span id="current-temp-display" className="text-7xl font-serif font-light text-white tracking-tight">
              {formatTemp(current.temperature, unit)}
            </span>
            <div className="flex flex-col text-sm text-slate-300 font-medium">
              <span className="text-base font-semibold text-slate-100">{wmo.label}</span>
              <span className="text-xs text-slate-400">Feels like {formatTemp(current.apparentTemperature, unit)}</span>
              {todayDaily && (
                <div className="flex items-center gap-2 mt-1.5 text-xs font-mono">
                  <span className="text-emerald-400 font-semibold">
                    H: {formatTemp(todayDaily.tempMax, unit)}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-blue-400 font-semibold">
                    L: {formatTemp(todayDaily.tempMin, unit)}
                  </span>
                </div>
              )}
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2 italic">
            "{wmo.description}"
          </p>
        </div>

        {/* Right: UV Index Gauge Card */}
        <div id="uv-gauge-box" className="p-4 rounded-2xl bg-[#0F172A] border border-[#1E293B] flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200">
            <span className="flex items-center gap-1.5 font-mono uppercase text-[10px] text-slate-400">
              <Sun className="w-4 h-4 text-amber-400" /> UV Index
            </span>
            <span className={`px-2 py-0.5 rounded-md font-bold text-xs uppercase ${uvCategory.bgClass} ${uvCategory.colorClass}`}>
              {current.uvIndex.toFixed(1)} - {uvCategory.label}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#1E293B] rounded-full overflow-hidden relative my-1">
            <div
              className="h-full bg-gradient-to-r from-blue-400 via-amber-400 to-orange-500 transition-all duration-500 rounded-full"
              style={{ width: `${Math.min(100, (current.uvIndex / 12) * 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {uvCategory.advice}
          </p>
        </div>
      </div>

      {/* Weather Metrics Grid */}
      <div id="weather-metrics-grid" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Humidity */}
        <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-blue-500/30 transition">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity
          </div>
          <div className="text-base font-mono font-semibold text-slate-100">{current.humidity}%</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Dew point relative</p>
        </div>

        {/* Wind */}
        <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-blue-500/30 transition">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1">
            <Wind className="w-3.5 h-3.5 text-blue-400" /> Wind Speed
          </div>
          <div className="text-base font-mono font-semibold text-slate-100">{formatSpeed(current.windSpeed, unit)}</div>
          <p className="text-[10px] text-slate-500 mt-0.5 flex items-center gap-1">
            <Compass className="w-3 h-3" /> {windDirName} ({current.windDirection}°)
          </p>
        </div>

        {/* Rain / Precip */}
        <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-blue-500/30 transition">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1">
            <Droplets className="w-3.5 h-3.5 text-blue-400" /> Precipitation
          </div>
          <div className="text-base font-mono font-semibold text-slate-100">{formatPrecip(current.precipitation, unit)}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Current accumulation</p>
        </div>

        {/* Pressure */}
        <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-blue-500/30 transition">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1">
            <Gauge className="w-3.5 h-3.5 text-blue-400" /> Air Pressure
          </div>
          <div className="text-base font-mono font-semibold text-slate-100">{Math.round(current.pressureMsl)} hPa</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Sea level standard</p>
        </div>

        {/* Cloud Cover */}
        <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-blue-500/30 transition">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1">
            <Cloud className="w-3.5 h-3.5 text-blue-400" /> Cloud Cover
          </div>
          <div className="text-base font-mono font-semibold text-slate-100">{current.cloudCover}%</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Sky coverage ratio</p>
        </div>

        {/* Wind Gusts */}
        <div className="p-3.5 rounded-2xl bg-[#0F172A] border border-[#1E293B] hover:border-blue-500/30 transition">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-amber-400" /> Wind Gusts
          </div>
          <div className="text-base font-mono font-semibold text-slate-100">{formatSpeed(current.windGusts, unit)}</div>
          <p className="text-[10px] text-slate-500 mt-0.5">Peak wind burst</p>
        </div>
      </div>

      {/* Sunrise & Sunset Cycle */}
      {todayDaily?.sunrise && todayDaily?.sunset && (
        <div id="sun-cycle-bar" className="mt-6 pt-4 border-t border-[#1E293B] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Sunrise className="w-4 h-4 text-amber-400" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Sunrise</span>
                <span className="font-semibold text-slate-200">{new Date(todayDaily.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Sunset className="w-4 h-4 text-orange-400" />
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-mono">Sunset</span>
                <span className="font-semibold text-slate-200">{new Date(todayDaily.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          </div>

          {/* Daylight Bar */}
          <div className="w-full sm:w-64 flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>Daylight Cycle</span>
              <span>{Math.round(daylightPercent)}%</span>
            </div>
            <div className="w-full h-1.5 bg-[#1E293B] rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${daylightPercent}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
