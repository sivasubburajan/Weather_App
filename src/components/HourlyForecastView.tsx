import React, { useState } from 'react';
import { Clock, Thermometer, CloudRain, Wind, Sun, BarChart2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { HourlyPoint, UnitSystem } from '../types';
import { getWmoInfo, formatTemp, formatTempRaw, formatSpeed, formatPrecip } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastViewProps {
  hourly: HourlyPoint[];
  unit: UnitSystem;
}

export const HourlyForecastView: React.FC<HourlyForecastViewProps> = ({ hourly, unit }) => {
  const [chartMetric, setChartMetric] = useState<'temp' | 'rain' | 'wind' | 'uv'>('temp');

  // Prepare next 24 hours of data
  const hourly24 = hourly.slice(0, 24);

  // Chart data formatting
  const chartData = hourly24.map((pt) => {
    const timeLabel = new Date(pt.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return {
      time: timeLabel,
      temp: formatTempRaw(pt.temperature, unit),
      feelsLike: formatTempRaw(pt.apparentTemperature, unit),
      rainProb: pt.precipitationProbability,
      precipMm: pt.precipitation,
      windSpeed: Math.round(pt.windSpeed),
      uvIndex: pt.uvIndex,
    };
  });

  return (
    <div id="hourly-forecast-container" className="bg-[#111827] border border-[#1E293B] rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6">
      {/* Title & Chart Metric Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-serif text-white tracking-wide">24-Hour Forecast & Analytics</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Hourly weather breakdown and visual trend metrics</p>
        </div>

        {/* Chart Selector Tabs */}
        <div className="flex flex-wrap gap-1 p-1 bg-[#1E293B] rounded-full border border-[#334155]">
          <button
            type="button"
            onClick={() => setChartMetric('temp')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition flex items-center gap-1.5 ${
              chartMetric === 'temp'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Thermometer className="w-3.5 h-3.5" /> Temp Trend
          </button>

          <button
            type="button"
            onClick={() => setChartMetric('rain')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition flex items-center gap-1.5 ${
              chartMetric === 'rain'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" /> Rain %
          </button>

          <button
            type="button"
            onClick={() => setChartMetric('wind')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition flex items-center gap-1.5 ${
              chartMetric === 'wind'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" /> Wind
          </button>

          <button
            type="button"
            onClick={() => setChartMetric('uv')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition flex items-center gap-1.5 ${
              chartMetric === 'uv'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="w-3.5 h-3.5" /> UV Index
          </button>
        </div>
      </div>

      {/* Recharts Analytics Canvas */}
      <div id="hourly-chart-canvas" className="h-64 w-full bg-[#0F172A] p-4 rounded-2xl border border-[#1E293B]">
        <ResponsiveContainer width="100%" height="100%">
          {chartMetric === 'temp' ? (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit={unit === 'imperial' ? '°F' : '°C'} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="temp" name="Temperature" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#tempGradient)" />
              <Line type="monotone" dataKey="feelsLike" name="Feels Like" stroke="#a855f7" strokeWidth={2} strokeDasharray="4 4" dot={false} />
            </AreaChart>
          ) : chartMetric === 'rain' ? (
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit="%" domain={[0, 100]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
              />
              <Bar dataKey="rainProb" name="Rain Probability (%)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          ) : chartMetric === 'wind' ? (
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} unit={unit === 'imperial' ? ' mph' : ' km/h'} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
              />
              <Line type="monotone" dataKey="windSpeed" name="Wind Speed" stroke="#2dd4bf" strokeWidth={2.5} dot={{ r: 3, fill: '#2dd4bf' }} />
            </LineChart>
          ) : (
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="uvGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
              <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} tickLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} domain={[0, 12]} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
              />
              <Area type="step" dataKey="uvIndex" name="UV Index" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#uvGradient)" />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* 24-Hour Horizontal Scroll Cards */}
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">
          Hourly Cards Carousel
        </div>
        <div id="hourly-cards-carousel" className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#334155]">
          {hourly24.map((item, idx) => {
            const wmo = getWmoInfo(item.weatherCode);
            const timeStr = idx === 0 ? 'Now' : new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            return (
              <div
                key={item.time}
                className="flex-shrink-0 w-24 p-3.5 rounded-2xl bg-[#1E293B] border border-[#334155] hover:border-blue-500/50 transition flex flex-col items-center justify-between text-center gap-2 group"
              >
                <span className="text-xs font-bold text-slate-300 group-hover:text-blue-400 transition">{timeStr}</span>
                <WeatherIcon iconName={wmo.iconName} className="w-6 h-6 text-amber-300 my-1 group-hover:scale-110 transition" />
                <span className="text-sm font-extrabold text-white">{formatTemp(item.temperature, unit)}</span>
                
                {item.precipitationProbability > 0 && (
                  <span className="text-[10px] font-semibold text-blue-400 flex items-center gap-0.5">
                    <CloudRain className="w-3 h-3" /> {item.precipitationProbability}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
