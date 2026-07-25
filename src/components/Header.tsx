import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Sparkles, X, Clock, Compass } from 'lucide-react';
import { CityLocation, UnitSystem } from '../types';
import { searchCities } from '../services/weatherService';

interface HeaderProps {
  unit: UnitSystem;
  onToggleUnit: () => void;
  onSelectCity: (location: { lat: number; lon: number; name: string; country?: string; admin1?: string }) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
  selectedCityName?: string;
}

const POPULAR_CITIES = [
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { name: 'New York', country: 'United States', lat: 40.7128, lon: -74.006 },
  { name: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { name: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lon: 55.2708 },
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { name: 'San Francisco', country: 'United States', lat: 37.7749, lon: -122.4194 },
];

export const Header: React.FC<HeaderProps> = ({
  unit,
  onToggleUnit,
  onSelectCity,
  onUseCurrentLocation,
  isLoadingLocation,
  selectedCityName,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<CityLocation[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('weather_recent_searches');
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Save city to recent
  const saveToRecent = (city: CityLocation) => {
    try {
      const filtered = recentSearches.filter((item) => item.id !== city.id);
      const updated = [city, ...filtered].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('weather_recent_searches', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(async () => {
      try {
        const data = await searchCities(query);
        setResults(data);
      } catch (err) {
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleCityClick = (city: CityLocation) => {
    onSelectCity({
      lat: city.latitude,
      lon: city.longitude,
      name: city.name,
      country: city.country,
      admin1: city.admin1,
    });
    saveToRecent(city);
    setQuery('');
    setIsDropdownOpen(false);
  };

  const handlePopularClick = (popular: typeof POPULAR_CITIES[0]) => {
    onSelectCity({
      lat: popular.lat,
      lon: popular.lon,
      name: popular.name,
      country: popular.country,
    });
    setQuery('');
    setIsDropdownOpen(false);
  };

  return (
    <header id="app-header" className="sticky top-0 z-40 bg-[#0F172A] border-b border-[#1E293B] text-[#E2E8F0] px-4 py-3 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Logo & Title */}
        <div id="brand-container" className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3">
            <div id="logo-badge" className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
              <Compass id="icon-compass" className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-serif italic font-semibold tracking-wide text-blue-100">
                Nimbus Intelligence
              </h1>
              <p className="text-[11px] text-slate-400 font-sans tracking-tight">Real-Time Weather Intelligence</p>
            </div>
          </div>

          {/* Unit Toggle on Mobile */}
          <div className="flex items-center md:hidden gap-2">
            <button
              id="mobile-unit-toggle"
              type="button"
              onClick={onToggleUnit}
              className="px-3 py-1.5 text-xs font-semibold rounded-full bg-[#1E293B] hover:bg-[#334155] text-slate-200 border border-[#334155] transition"
            >
              Unit: {unit === 'metric' ? '°C' : '°F'}
            </button>
          </div>
        </div>

        {/* Search Bar & Location Tools */}
        <div id="search-section" className="relative w-full md:max-w-md mx-auto" ref={dropdownRef}>
          <div className="flex items-center gap-2">
            <div id="search-input-wrapper" className="relative flex-1">
              <Search id="icon-search" className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="city-search-input"
                type="text"
                placeholder="Search city (e.g. London, Tokyo, New York)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setIsDropdownOpen(true);
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full pl-10 pr-9 py-2 text-sm rounded-full bg-[#1E293B] text-slate-200 placeholder-slate-400 border border-[#334155] focus:outline-none focus:ring-1 focus:ring-blue-500 transition"
              />
              {query && (
                <button
                  id="btn-clear-search"
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200"
                >
                  <X id="icon-clear-x" className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Current Location Button */}
            <button
              id="btn-current-location"
              type="button"
              onClick={onUseCurrentLocation}
              disabled={isLoadingLocation}
              title="Use current GPS location"
              className="p-2.5 rounded-full bg-[#1E293B] hover:bg-[#334155] text-slate-200 border border-[#334155] hover:border-blue-500/50 transition flex items-center justify-center shrink-0 disabled:opacity-50"
            >
              <Navigation
                id="icon-navigation"
                className={`w-4 h-4 text-blue-400 ${isLoadingLocation ? 'animate-spin' : ''}`}
              />
            </button>

            {/* Unit Toggle on Desktop */}
            <button
              id="desktop-unit-toggle"
              type="button"
              onClick={onToggleUnit}
              className="hidden md:flex px-3.5 py-2 text-xs font-semibold rounded-full bg-[#1E293B] hover:bg-[#334155] text-slate-200 border border-[#334155] transition items-center gap-1 shrink-0"
            >
              <span className={unit === 'metric' ? 'text-blue-400 font-bold' : 'text-slate-400'}>°C</span>
              <span className="text-slate-600">|</span>
              <span className={unit === 'imperial' ? 'text-blue-400 font-bold' : 'text-slate-400'}>°F</span>
            </button>
          </div>

          {/* Live Search Results Dropdown */}
          {isDropdownOpen && (
            <div
              id="search-dropdown"
              className="absolute left-0 right-0 top-full mt-2 bg-[#0F172A] border border-[#1E293B] rounded-2xl shadow-2xl overflow-hidden z-50 divide-y divide-[#1E293B] max-h-80 overflow-y-auto backdrop-blur-md"
            >
              {isSearching && (
                <div id="search-loading-state" className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Sparkles id="icon-searching-sparkles" className="w-4 h-4 text-blue-400 animate-spin" />
                  Searching global cities...
                </div>
              )}

              {!isSearching && results.length > 0 && (
                <div id="search-results-list" className="py-1">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Matching Locations
                  </div>
                  {results.map((city) => (
                    <button
                      key={city.id}
                      id={`search-item-${city.id}`}
                      type="button"
                      onClick={() => handleCityClick(city)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-[#1E293B] transition flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin id={`icon-pin-${city.id}`} className="w-4 h-4 text-blue-400 shrink-0 group-hover:scale-110 transition" />
                        <div>
                          <span className="font-medium text-slate-100">{city.name}</span>
                          <span className="text-xs text-slate-400 ml-1.5">
                            {[city.admin1, city.country].filter(Boolean).join(', ')}
                          </span>
                        </div>
                      </div>
                      {city.population && (
                        <span className="text-[11px] text-slate-500 font-mono">
                          {(city.population / 1000).toFixed(0)}k pop
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {!isSearching && query.trim().length >= 2 && results.length === 0 && (
                <div id="search-no-results" className="p-4 text-center text-xs text-amber-400">
                  No city matched "{query}". Please check spelling or try a broader search.
                </div>
              )}

              {/* Recent Searches */}
              {recentSearches.length > 0 && !query && (
                <div id="recent-searches-list" className="py-2">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Clock id="icon-recent-clock" className="w-3 h-3" /> Recent Searches
                  </div>
                  {recentSearches.map((city) => (
                    <button
                      key={`recent-${city.id}`}
                      id={`recent-item-${city.id}`}
                      type="button"
                      onClick={() => handleCityClick(city)}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-[#1E293B] text-slate-300 flex items-center gap-2"
                    >
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{city.name}</span>
                      <span className="text-slate-500 text-[11px]">{city.country}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Picks */}
              {!query && (
                <div id="quick-picks-section" className="p-3 bg-[#0A0C10]">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                    Popular Destinations
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {POPULAR_CITIES.map((popular) => (
                      <button
                        key={`popular-${popular.name}`}
                        id={`popular-btn-${popular.name.toLowerCase().replace(/\s+/g, '-')}`}
                        type="button"
                        onClick={() => handlePopularClick(popular)}
                        className="px-2.5 py-1 text-xs rounded-full bg-[#1E293B] hover:bg-blue-600 hover:text-white border border-[#334155] text-slate-300 transition"
                      >
                        {popular.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Header Right Time Badge */}
        <div className="hidden md:block text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
            {new Date().toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          <p className="text-xs font-semibold font-mono text-blue-200">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </header>
  );
};
