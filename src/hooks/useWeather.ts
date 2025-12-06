import { useState, useEffect } from 'react';
import { WeatherData } from '@/types';
import { provinceCoordinates } from '@/data/provinces';
import { API_CONFIG, isWeatherApiConfigured } from '@/lib/apiConfig';

// Mock weather data - digunakan jika API key belum diisi
const mockWeatherByProvince: Record<string, WeatherData> = {
  jakarta: { temperature: 32, humidity: 75, condition: 'Cerah Berawan', conditionId: 'sunny' },
  jabar: { temperature: 28, humidity: 80, condition: 'Berawan', conditionId: 'cloudy' },
  jateng: { temperature: 26, humidity: 85, condition: 'Hujan Ringan', conditionId: 'rainy' },
  yogya: { temperature: 25, humidity: 82, condition: 'Sejuk', conditionId: 'cool' },
  jatim: { temperature: 30, humidity: 70, condition: 'Cerah', conditionId: 'sunny' },
  bali: { temperature: 29, humidity: 78, condition: 'Cerah Berawan', conditionId: 'sunny' },
};

// Mapping kondisi cuaca dari API ke bahasa Indonesia
const conditionMapping: Record<string, { condition: string; conditionId: string }> = {
  Clear: { condition: 'Cerah', conditionId: 'sunny' },
  Clouds: { condition: 'Berawan', conditionId: 'cloudy' },
  Rain: { condition: 'Hujan', conditionId: 'rainy' },
  Drizzle: { condition: 'Gerimis', conditionId: 'rainy' },
  Thunderstorm: { condition: 'Badai Petir', conditionId: 'rainy' },
  Snow: { condition: 'Dingin', conditionId: 'cool' },
  Mist: { condition: 'Berkabut', conditionId: 'cloudy' },
  Fog: { condition: 'Berkabut', conditionId: 'cloudy' },
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
        // Jika API key sudah diisi, gunakan API asli
        if (isWeatherApiConfigured()) {
          const coords = provinceCoordinates[provinceId];
          if (coords) {
            const response = await fetch(
              `${API_CONFIG.WEATHER_API_URL}?lat=${coords.lat}&lon=${coords.lon}&appid=${API_CONFIG.WEATHER_API_KEY}&units=metric`
            );
            
            if (response.ok) {
              const data = await response.json();
              const mainCondition = data.weather[0]?.main || 'Clear';
              const mapped = conditionMapping[mainCondition] || { condition: 'Cerah', conditionId: 'sunny' };
              
              setWeather({
                temperature: Math.round(data.main.temp),
                humidity: data.main.humidity,
                condition: mapped.condition,
                conditionId: mapped.conditionId,
              });
              return;
            }
          }
        }

        // Fallback ke mock data jika API tidak tersedia
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockData = mockWeatherByProvince[provinceId];
        
        if (mockData) {
          setWeather(mockData);
        } else {
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
        // Fallback ke mock data jika error
        const mockData = mockWeatherByProvince[provinceId];
        if (mockData) setWeather(mockData);
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
