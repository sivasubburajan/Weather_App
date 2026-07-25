import {
  WmoCodeDetails,
  UnitSystem,
  CurrentWeatherData,
  DailyPoint,
  ActivityScores,
  OutfitRecommendation,
} from '../types';

export const WMO_CODES: Record<number, WmoCodeDetails> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Completely clear skies with bright sunshine',
    iconName: 'Sun',
    category: 'clear',
    bgGradientDay: 'from-amber-400 via-sky-400 to-blue-600',
    bgGradientNight: 'from-slate-900 via-indigo-950 to-slate-900',
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Mostly sunny with occasional soft clouds',
    iconName: 'SunMedium',
    category: 'clear',
    bgGradientDay: 'from-sky-400 via-blue-500 to-indigo-600',
    bgGradientNight: 'from-slate-900 via-slate-800 to-indigo-950',
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Scattered clouds with periodic sun breaks',
    iconName: 'CloudSun',
    category: 'cloudy',
    bgGradientDay: 'from-sky-300 via-blue-400 to-slate-600',
    bgGradientNight: 'from-slate-900 via-slate-800 to-indigo-900',
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Thick gray cloud cover across the sky',
    iconName: 'Cloud',
    category: 'cloudy',
    bgGradientDay: 'from-slate-400 via-slate-500 to-zinc-600',
    bgGradientNight: 'from-zinc-900 via-slate-900 to-zinc-950',
  },
  45: {
    code: 45,
    label: 'Foggy',
    description: 'Dense fog reducing visibility',
    iconName: 'CloudFog',
    category: 'fog',
    bgGradientDay: 'from-slate-300 via-zinc-400 to-slate-500',
    bgGradientNight: 'from-zinc-900 via-slate-900 to-slate-950',
  },
  48: {
    code: 48,
    label: 'Depositing Rime Fog',
    description: 'Freezing fog depositing frost on surfaces',
    iconName: 'CloudFog',
    category: 'fog',
    bgGradientDay: 'from-teal-200 via-slate-400 to-slate-600',
    bgGradientNight: 'from-slate-950 via-teal-950 to-slate-900',
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Gentle fine mist drops',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgGradientDay: 'from-sky-400 via-slate-500 to-blue-700',
    bgGradientNight: 'from-slate-900 via-slate-800 to-blue-950',
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Steady light mist and drizzle',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgGradientDay: 'from-sky-500 via-slate-600 to-blue-800',
    bgGradientNight: 'from-slate-900 via-slate-850 to-blue-950',
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Heavy damp drizzle filling the air',
    iconName: 'CloudDrizzle',
    category: 'drizzle',
    bgGradientDay: 'from-blue-400 via-slate-600 to-slate-800',
    bgGradientNight: 'from-slate-900 via-blue-950 to-slate-950',
  },
  56: {
    code: 56,
    label: 'Freezing Drizzle',
    description: 'Chilly drizzle freezing upon impact',
    iconName: 'CloudHail',
    category: 'drizzle',
    bgGradientDay: 'from-cyan-400 via-slate-500 to-blue-800',
    bgGradientNight: 'from-slate-950 via-cyan-950 to-slate-900',
  },
  57: {
    code: 57,
    label: 'Dense Freezing Drizzle',
    description: 'Heavy freezing drizzle causing icy glazes',
    iconName: 'CloudHail',
    category: 'drizzle',
    bgGradientDay: 'from-teal-400 via-slate-600 to-blue-900',
    bgGradientNight: 'from-slate-950 via-teal-950 to-slate-950',
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Light continuous rainfall',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-sky-500 via-blue-600 to-slate-800',
    bgGradientNight: 'from-slate-900 via-indigo-950 to-slate-950',
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Steady rain showers',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-blue-500 via-slate-700 to-slate-900',
    bgGradientNight: 'from-slate-950 via-blue-950 to-slate-950',
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Heavy pouring rainfall',
    iconName: 'CloudRainWind',
    category: 'rain',
    bgGradientDay: 'from-blue-600 via-slate-800 to-gray-900',
    bgGradientNight: 'from-slate-950 via-slate-900 to-black',
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    description: 'Freezing rain creating icy road hazards',
    iconName: 'CloudHail',
    category: 'rain',
    bgGradientDay: 'from-cyan-500 via-blue-700 to-slate-900',
    bgGradientNight: 'from-slate-950 via-cyan-950 to-slate-950',
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Severe freezing rain forming thick ice layers',
    iconName: 'CloudHail',
    category: 'rain',
    bgGradientDay: 'from-teal-500 via-slate-800 to-slate-950',
    bgGradientNight: 'from-slate-950 via-teal-950 to-black',
  },
  71: {
    code: 71,
    label: 'Slight Snow',
    description: 'Soft light snow flurries',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-sky-200 via-indigo-300 to-slate-500',
    bgGradientNight: 'from-slate-900 via-slate-800 to-indigo-950',
  },
  73: {
    code: 73,
    label: 'Moderate Snow',
    description: 'Steady snowfall accumulating softly',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-cyan-300 via-sky-500 to-indigo-700',
    bgGradientNight: 'from-slate-950 via-indigo-950 to-slate-900',
  },
  75: {
    code: 75,
    label: 'Heavy Snowfall',
    description: 'Intense snow accumulation with low visibility',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-slate-300 via-indigo-600 to-slate-900',
    bgGradientNight: 'from-slate-950 via-slate-900 to-indigo-950',
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Tiny ice particles falling from cloud cover',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-sky-300 via-slate-500 to-slate-700',
    bgGradientNight: 'from-slate-950 via-slate-900 to-zinc-950',
  },
  80: {
    code: 80,
    label: 'Slight Rain Showers',
    description: 'Passing brief rain showers',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-sky-400 via-blue-500 to-slate-700',
    bgGradientNight: 'from-slate-900 via-blue-950 to-slate-950',
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    description: 'Frequent rain bursts with partial breaks',
    iconName: 'CloudRain',
    category: 'rain',
    bgGradientDay: 'from-blue-400 via-indigo-600 to-slate-800',
    bgGradientNight: 'from-slate-950 via-blue-950 to-slate-900',
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Sudden torrents of heavy rain',
    iconName: 'CloudRainWind',
    category: 'rain',
    bgGradientDay: 'from-blue-600 via-slate-800 to-zinc-950',
    bgGradientNight: 'from-black via-slate-950 to-blue-950',
  },
  85: {
    code: 85,
    label: 'Slight Snow Showers',
    description: 'Brief passing snow flurries',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-sky-300 via-indigo-400 to-slate-600',
    bgGradientNight: 'from-slate-950 via-slate-900 to-indigo-950',
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Strong snow gusts and bursts',
    iconName: 'Snowflake',
    category: 'snow',
    bgGradientDay: 'from-slate-400 via-indigo-700 to-slate-950',
    bgGradientNight: 'from-black via-indigo-950 to-slate-950',
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Lightning strikes and heavy thunder claps',
    iconName: 'CloudLightning',
    category: 'storm',
    bgGradientDay: 'from-purple-600 via-slate-800 to-zinc-950',
    bgGradientNight: 'from-slate-950 via-purple-950 to-black',
  },
  96: {
    code: 96,
    label: 'Thunderstorm & Slight Hail',
    description: 'Storm with small hail pellets',
    iconName: 'CloudLightning',
    category: 'storm',
    bgGradientDay: 'from-violet-700 via-slate-900 to-black',
    bgGradientNight: 'from-black via-purple-950 to-zinc-950',
  },
  99: {
    code: 99,
    label: 'Severe Thunderstorm & Hail',
    description: 'Severe thunderstorm with destructive hail bursts',
    iconName: 'CloudLightning',
    category: 'storm',
    bgGradientDay: 'from-indigo-800 via-zinc-900 to-black',
    bgGradientNight: 'from-black via-violet-950 to-slate-950',
  },
};

export function getWmoInfo(code: number): WmoCodeDetails {
  if (WMO_CODES[code]) {
    return WMO_CODES[code];
  }
  return {
    code,
    label: 'Variable Conditions',
    description: 'Weather patterns shifting',
    iconName: 'Cloud',
    category: 'cloudy',
    bgGradientDay: 'from-sky-400 via-blue-500 to-slate-700',
    bgGradientNight: 'from-slate-900 via-slate-800 to-slate-950',
  };
}

export function formatTemp(celsius: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    const fahrenheit = Math.round((celsius * 9) / 5 + 32);
    return `${fahrenheit}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

export function formatTempRaw(celsius: number, unit: UnitSystem): number {
  if (unit === 'imperial') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatSpeed(kmh: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    const mph = Math.round(kmh * 0.621371);
    return `${mph} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatPrecip(mm: number, unit: UnitSystem): string {
  if (unit === 'imperial') {
    const inches = (mm * 0.0393701).toFixed(2);
    return `${inches} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

export function degreesToCardinal(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

export function getUvCategory(uv: number): { label: string; colorClass: string; bgClass: string; advice: string } {
  if (uv <= 2) {
    return {
      label: 'Low',
      colorClass: 'text-emerald-500',
      bgClass: 'bg-emerald-500/10 border-emerald-500/20',
      advice: 'No sun protection required. Safe outdoors.',
    };
  }
  if (uv <= 5) {
    return {
      label: 'Moderate',
      colorClass: 'text-yellow-500',
      bgClass: 'bg-yellow-500/10 border-yellow-500/20',
      advice: 'Wear sunglasses & SPF 30+ if outdoors over 30 mins.',
    };
  }
  if (uv <= 7) {
    return {
      label: 'High',
      colorClass: 'text-orange-500',
      bgClass: 'bg-orange-500/10 border-orange-500/20',
      advice: 'Hat, SPF 50+, and shade recommended between 10am-4pm.',
    };
  }
  if (uv <= 10) {
    return {
      label: 'Very High',
      colorClass: 'text-red-500',
      bgClass: 'bg-red-500/10 border-red-500/20',
      advice: 'Unprotected skin will burn quickly. Minimize direct sun exposure.',
    };
  }
  return {
    label: 'Extreme',
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-500/10 border-purple-500/20',
    advice: 'Extreme UV radiation! Stay indoors or seek full shade during peak daylight.',
  };
}

export function calculateActivityScores(current: CurrentWeatherData, todayDaily?: DailyPoint): ActivityScores {
  const temp = current.temperature;
  const precip = current.precipitation;
  const wind = current.windSpeed;
  const uv = current.uvIndex;
  const code = current.weatherCode;

  // Sports Score
  let sportsScore = 100;
  if (temp < 5 || temp > 32) sportsScore -= 30;
  else if (temp < 12 || temp > 28) sportsScore -= 10;

  if (precip > 5) sportsScore -= 50;
  else if (precip > 0.5) sportsScore -= 25;

  if (wind > 35) sportsScore -= 35;
  else if (wind > 20) sportsScore -= 15;

  if (code >= 95) sportsScore = 0; // Thunderstorm
  sportsScore = Math.max(0, Math.min(100, Math.round(sportsScore)));

  // Picnic / Outdoor Dining Score
  let picnicScore = 100;
  if (temp < 16 || temp > 30) picnicScore -= 35;
  if (precip > 0.1) picnicScore -= 60;
  if (wind > 25) picnicScore -= 30;
  if (uv > 8) picnicScore -= 15;
  if (code >= 51) picnicScore -= 40;
  picnicScore = Math.max(0, Math.min(100, Math.round(picnicScore)));

  // Sightseeing
  let sightseeingScore = 100;
  if (precip > 3) sightseeingScore -= 40;
  if (temp < 0 || temp > 35) sightseeingScore -= 25;
  if (current.cloudCover > 90) sightseeingScore -= 10;
  if (code >= 45 && code <= 48) sightseeingScore -= 45; // Fog
  sightseeingScore = Math.max(0, Math.min(100, Math.round(sightseeingScore)));

  // Driving Safety
  let drivingScore = 100;
  if (code >= 95) drivingScore -= 60; // Storm
  else if (code >= 65 || code === 82) drivingScore -= 40; // Heavy rain
  else if (code >= 71) drivingScore -= 45; // Snow
  else if (code >= 45 && code <= 48) drivingScore -= 50; // Fog

  if (wind > 50) drivingScore -= 30;
  drivingScore = Math.max(0, Math.min(100, Math.round(drivingScore)));

  // Laundry / Clothes Drying
  let dryingScore = 100;
  if (precip > 0.1) dryingScore = 0;
  else {
    if (current.humidity > 80) dryingScore -= 30;
    if (current.humidity > 65) dryingScore -= 15;
    if (wind > 15) dryingScore += 10; // Wind helps drying
    if (temp < 10) dryingScore -= 30;
    if (current.cloudCover > 80) dryingScore -= 20;
  }
  dryingScore = Math.max(0, Math.min(100, Math.round(dryingScore)));

  return {
    sports: {
      score: sportsScore,
      verdict: sportsScore >= 80 ? 'Ideal Conditions' : sportsScore >= 50 ? 'Moderate' : 'Poor Conditions',
      tips: sportsScore >= 80 ? 'Great weather for a jog or outdoor workout!' : sportsScore >= 50 ? 'Wear breathable layers; keep an eye on weather shifts.' : 'Consider an indoor gym session or treadmill exercise.',
    },
    picnic: {
      score: picnicScore,
      verdict: picnicScore >= 80 ? 'Perfect Picnic Day' : picnicScore >= 50 ? 'Fair Outdoor Dining' : 'Unfavorable',
      tips: picnicScore >= 80 ? 'Pack your blanket & basket, sunny and comfortable!' : picnicScore >= 50 ? 'Seek a covered patio or sheltered spot.' : 'Indoor dining is recommended due to rain/wind.',
    },
    sightseeing: {
      score: sightseeingScore,
      verdict: sightseeingScore >= 80 ? 'Great Visibility' : sightseeingScore >= 50 ? 'Fair Tour Day' : 'Challenging',
      tips: sightseeingScore >= 80 ? 'Clear skies for landmarks & photography.' : sightseeingScore >= 50 ? 'Keep a lightweight jacket or umbrella handy.' : 'Focus on museum or indoor venue tours.',
    },
    driving: {
      score: drivingScore,
      verdict: drivingScore >= 85 ? 'Optimal Roads' : drivingScore >= 60 ? 'Exercise Caution' : 'Hazardous Conditions',
      tips: drivingScore >= 85 ? 'Dry roads and clear visibility.' : drivingScore >= 60 ? 'Maintain extra braking distance.' : 'Slow down, turn on fog/low beams, and avoid heavy braking.',
    },
    drying: {
      score: dryingScore,
      verdict: dryingScore >= 75 ? 'Rapid Drying' : dryingScore >= 40 ? 'Slow Drying' : 'Do Not Hang Outside',
      tips: dryingScore >= 75 ? 'Clothes will dry fast outdoors.' : dryingScore >= 40 ? 'Will take several hours due to humidity/cloud cover.' : 'High risk of rain or damp air. Dry indoors.',
    },
  };
}

export function generateOutfitRecommendation(current: CurrentWeatherData): OutfitRecommendation {
  const temp = current.temperature;
  const precip = current.precipitation;
  const wind = current.windSpeed;
  const uv = current.uvIndex;
  const code = current.weatherCode;

  const layers: string[] = [];
  const accessories: string[] = [];
  let outerwear = 'None needed';
  let footwear = 'Standard sneakers or casual shoes';
  let summary = 'Comfortable weather attire.';
  let headsup: string | undefined = undefined;

  if (temp < 0) {
    summary = 'Freezing cold outside! Bundle up with heavy thermal insulation.';
    layers.push('Thermal base layer top & bottoms');
    layers.push('Fleece sweater or wool pullover');
    outerwear = 'Heavy down parka or thick insulated winter coat';
    footwear = 'Insulated waterproof winter boots';
    accessories.push('Thermal gloves or mittens', 'Wool beanie / knit hat', 'Warm scarf');
  } else if (temp < 10) {
    summary = 'Crisp and chilly. Layer up to stay warm.';
    layers.push('Long-sleeve shirt or t-shirt base');
    layers.push('Warm sweater or hoodie');
    outerwear = 'Medium jacket, wool coat, or trench';
    footwear = 'Closed shoes or boots';
    accessories.push('Light scarf', 'Beanie if windy');
  } else if (temp < 18) {
    summary = 'Mild & cool weather. A light layer is recommended.';
    layers.push('Comfortable t-shirt or long-sleeve tee');
    outerwear = 'Light jacket, denim jacket, or cardigan';
    footwear = 'Sneakers, loafers, or ankle boots';
  } else if (temp < 27) {
    summary = 'Pleasantly warm! Light breathable clothing is best.';
    layers.push('Cotton t-shirt, polo, or linen blouse');
    outerwear = 'None required';
    footwear = 'Breathable sneakers, canvas shoes, or loafers';
  } else {
    summary = 'Hot weather! Wear minimal, loose-fitting, breathable fabrics.';
    layers.push('Light tank top, linen shirt, or airy tee');
    outerwear = 'None needed';
    footwear = 'Sandals, mesh sneakers, or flip-flops';
    accessories.push('Hydration water bottle');
  }

  // Rain / Wet adjustments
  if (precip > 0.5 || code >= 51) {
    accessories.push('Compact wind-proof umbrella');
    if (outerwear === 'None needed' || outerwear === 'None required') {
      outerwear = 'Waterproof raincoat or shell jacket';
    } else {
      outerwear += ' (waterproof shell)';
    }
    footwear = 'Water-resistant or waterproof footwear';
    headsup = 'Rain expected! Keep an umbrella handy and watch out for slick puddles.';
  }

  // UV adjustments
  if (uv >= 6 && current.isDay) {
    accessories.push('UV400 Sunglasses', 'Wide-brim hat', 'Broad-spectrum SPF 30+ sunscreen');
  }

  // Wind adjustments
  if (wind > 30) {
    headsup = headsup ? headsup + ' Also gusty winds outside!' : 'Strong winds! Secure loose accessories and wear a windbreaker.';
  }

  return {
    summary,
    layers,
    outerwear,
    footwear,
    accessories,
    headsup,
  };
}
