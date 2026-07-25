import React, { useState } from 'react';
import { Calendar, ChevronDown, ChevronUp, CloudRain, Wind, Sun, Sunrise, Sunset, ShieldAlert } from 'lucide-react';
import { DailyPoint, UnitSystem } from '../types';
import { getWmoInfo, formatTemp, formatSpeed, formatPrecip } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface DailyForecastViewProps {
  daily: DailyPoint[];
  unit: UnitSystem;
}

export const DailyForecastView: React.FC<DailyForecastViewProps> = ({ daily, unit }) => {
  const [expandedDate, setExpandedDate] = useState<string | null>(null);

  // Calculate week min and max to render proportional temp range bar
  const weekMin = Math.min(...daily.map((d) => d.tempMin));
  const weekMax = Math.max(...daily.map((d) => d.tempMax));
  const weekRange = Math.max(1, weekMax - weekMin);

  const toggleExpand = (date: string) => {
    setExpandedDate((prev) => (prev === date ? null : date));
  };

  return (
    <div id="daily-forecast-container" className="bg-[#111827] border border-[#1E293B] rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#1E293B] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-blue-400" />
            <h3 className="text-xl font-serif text-white tracking-wide">7-Day Forecast</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">Weekly Outlook & Range Visualizer</p>
        </div>
      </div>

      {/* Daily Cards List */}
      <div className="space-y-3">
        {daily.map((item, idx) => {
          const wmo = getWmoInfo(item.weatherCode);
          const dateObj = new Date(item.date);
          const isToday = idx === 0;
          const dayName = isToday
            ? 'Today'
            : dateObj.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

          const isExpanded = expandedDate === item.date;

          // Temp range bar math
          const leftPercent = ((item.tempMin - weekMin) / weekRange) * 100;
          const barWidth = Math.max(5, ((item.tempMax - item.tempMin) / weekRange) * 100);

          return (
            <div
              key={item.date}
              className="rounded-2xl bg-[#1E293B] border border-[#334155] overflow-hidden hover:border-blue-500/50 transition"
            >
              {/* Row Content */}
              <div
                onClick={() => toggleExpand(item.date)}
                className="p-4 sm:px-6 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none"
              >
                {/* Day & Condition */}
                <div className="flex items-center gap-4 min-w-[180px]">
                  <WeatherIcon iconName={wmo.iconName} className="w-7 h-7 text-amber-300 shrink-0" />
                  <div>
                    <span className="font-bold text-sm text-white block">{dayName}</span>
                    <span className="text-xs text-slate-400">{wmo.label}</span>
                  </div>
                </div>

                {/* Rain Probability Badge */}
                <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 min-w-[80px]">
                  {item.precipitationProbabilityMax > 0 ? (
                    <>
                      <CloudRain className="w-3.5 h-3.5 shrink-0" />
                      <span>{item.precipitationProbabilityMax}%</span>
                    </>
                  ) : (
                    <span className="text-slate-500 text-[11px]">0% Rain</span>
                  )}
                </div>

                {/* Temp Visual Range Bar */}
                <div className="flex-1 flex items-center gap-3 min-w-[180px]">
                  <span className="text-xs font-bold text-blue-300 w-10 text-right">
                    {formatTemp(item.tempMin, unit)}
                  </span>
                  <div className="flex-1 h-2 bg-[#0F172A] rounded-full relative overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-amber-400 to-orange-500 rounded-full"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${barWidth}%`,
                        position: 'absolute',
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-amber-300 w-10">
                    {formatTemp(item.tempMax, unit)}
                  </span>
                </div>

                {/* Expand Toggle Chevron */}
                <button
                  type="button"
                  className="p-1 rounded-lg text-slate-400 hover:text-white shrink-0 self-end sm:self-center"
                >
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div className="p-4 sm:px-6 bg-[#0F172A] border-t border-[#334155] grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block mb-1">Precipitation Sum</span>
                    <span className="font-bold text-slate-200">{formatPrecip(item.precipitationSum, unit)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Max Wind Gusts</span>
                    <span className="font-bold text-slate-200">{formatSpeed(item.windGustsMax, unit)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Max UV Index</span>
                    <span className="font-bold text-amber-400">{item.uvIndexMax.toFixed(1)}</span>
                  </div>

                  <div>
                    <span className="text-slate-400 block mb-1">Sun Cycle</span>
                    <span className="font-bold text-slate-200 flex items-center gap-2">
                      <Sunrise className="w-3.5 h-3.5 text-amber-300" />
                      {new Date(item.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      <Sunset className="w-3.5 h-3.5 text-orange-400" />
                      {new Date(item.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
