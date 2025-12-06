// API Configuration
// Isi API key di sini untuk mengaktifkan fitur

export const API_CONFIG = {
  // Weather API (contoh: OpenWeatherMap, WeatherAPI.com)
  WEATHER_API_KEY: '', // Isi dengan API key cuaca Anda
  WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5/weather',

  // Maps API (Google Maps atau Leaflet)
  MAPS_API_KEY: '', // Isi dengan API key maps Anda
  
  // AI API (contoh: OpenAI, Gemini)
  AI_API_KEY: '', // Isi dengan API key AI Anda
  AI_API_URL: 'https://api.openai.com/v1/chat/completions',
};

// Helper untuk cek apakah API key sudah diisi
export const isWeatherApiConfigured = () => Boolean(API_CONFIG.WEATHER_API_KEY);
export const isMapsApiConfigured = () => Boolean(API_CONFIG.MAPS_API_KEY);
export const isAiApiConfigured = () => Boolean(API_CONFIG.AI_API_KEY);
