import React from 'react';
import {
  Sun,
  SunMedium,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudHail,
  Snowflake,
  CloudLightning,
  Wind,
  Thermometer,
} from 'lucide-react';

interface WeatherIconProps {
  iconName: string;
  className?: string;
}

export const WeatherIcon: React.FC<WeatherIconProps> = ({ iconName, className = 'w-6 h-6' }) => {
  switch (iconName) {
    case 'Sun':
      return <Sun id="icon-sun" className={className} />;
    case 'SunMedium':
      return <SunMedium id="icon-sun-medium" className={className} />;
    case 'CloudSun':
      return <CloudSun id="icon-cloud-sun" className={className} />;
    case 'Cloud':
      return <Cloud id="icon-cloud" className={className} />;
    case 'CloudFog':
      return <CloudFog id="icon-cloud-fog" className={className} />;
    case 'CloudDrizzle':
      return <CloudDrizzle id="icon-cloud-drizzle" className={className} />;
    case 'CloudRain':
      return <CloudRain id="icon-cloud-rain" className={className} />;
    case 'CloudRainWind':
      return <CloudRainWind id="icon-cloud-rain-wind" className={className} />;
    case 'CloudHail':
      return <CloudHail id="icon-cloud-hail" className={className} />;
    case 'Snowflake':
      return <Snowflake id="icon-snowflake" className={className} />;
    case 'CloudLightning':
      return <CloudLightning id="icon-cloud-lightning" className={className} />;
    default:
      return <Cloud id="icon-cloud-default" className={className} />;
  }
};
