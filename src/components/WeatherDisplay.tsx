import { Cloud, Sun, CloudRain, Snowflake, Droplets } from 'lucide-react';
import { WeatherData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface WeatherDisplayProps {
  weather: WeatherData | null;
  loading: boolean;
}

function getWeatherIcon(conditionId: string) {
  switch (conditionId) {
    case 'sunny':
      return <Sun className="h-5 w-5 text-yellow-400" />;
    case 'cloudy':
      return <Cloud className="h-5 w-5 text-gray-400" />;
    case 'rainy':
      return <CloudRain className="h-5 w-5 text-blue-400" />;
    case 'cool':
      return <Snowflake className="h-5 w-5 text-cyan-400" />;
    default:
      return <Sun className="h-5 w-5 text-yellow-400" />;
  }
}

export function WeatherDisplay({ weather, loading }: WeatherDisplayProps) {
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  if (!weather) return null;

  return (
    <div className="flex items-center gap-3 text-sm">
      {getWeatherIcon(weather.conditionId)}
      <span className="font-medium">{weather.temperature}°C</span>
      <div className="flex items-center gap-1 text-muted-foreground">
        <Droplets className="h-4 w-4" />
        <span>{weather.humidity}%</span>
      </div>
    </div>
  );
}
