import { useState, useEffect } from 'react';
import { WeatherData } from '@/types';
import { provinceCoordinates } from '@/data/provinces';

// Mock weather data - In production, replace with actual API call
const mockWeatherByProvince: Record<string, WeatherData> = {
  jakarta: { temperature: 32, humidity: 75, condition: 'Cerah Berawan', conditionId: 'sunny' },
  jabar: { temperature: 28, humidity: 80, condition: 'Berawan', conditionId: 'cloudy' },
  jateng: { temperature: 26, humidity: 85, condition: 'Hujan Ringan', conditionId: 'rainy' },
  yogya: { temperature: 25, humidity: 82, condition: 'Sejuk', conditionId: 'cool' },
  jatim: { temperature: 30, humidity: 70, condition: 'Cerah', conditionId: 'sunny' },
  bali: { temperature: 29, humidity: 78, condition: 'Cerah Berawan', conditionId: 'sunny' },
};

export function useWeather(provinceId: string) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);

      try {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Use mock data or generate random weather for provinces without mock data
        const mockData = mockWeatherByProvince[provinceId];
        
        if (mockData) {
          setWeather(mockData);
        } else {
          // Generate random weather for provinces without specific mock data
          const conditions = [
            { condition: 'Cerah', conditionId: 'sunny', tempRange: [30, 35] },
            { condition: 'Berawan', conditionId: 'cloudy', tempRange: [26, 30] },
            { condition: 'Hujan Ringan', conditionId: 'rainy', tempRange: [22, 26] },
            { condition: 'Sejuk', conditionId: 'cool', tempRange: [20, 25] },
          ];
          
          const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
          const temp = Math.floor(
            Math.random() * (randomCondition.tempRange[1] - randomCondition.tempRange[0]) + 
            randomCondition.tempRange[0]
          );
          
          setWeather({
            temperature: temp,
            humidity: Math.floor(Math.random() * 30 + 60),
            condition: randomCondition.condition,
            conditionId: randomCondition.conditionId,
          });
        }
      } catch (err) {
        setError('Gagal mengambil data cuaca');
      } finally {
        setLoading(false);
      }
    };

    if (provinceId) {
      fetchWeather();
    }
  }, [provinceId]);

  return { weather, loading, error };
}

export function getWeatherSuitability(temperature: number): 'panas' | 'sejuk' | 'dingin' {
  if (temperature >= 30) return 'panas';
  if (temperature >= 25) return 'sejuk';
  return 'dingin';
}
