/**
 * ============================================
 * HUNGER'S HARMONY - API CONFIGURATION
 * ============================================
 * 
 * File ini berisi konfigurasi API untuk website Hunger's Harmony.
 * Isi API key di bawah ini untuk mengaktifkan fitur-fitur berikut:
 * 
 * 1. Weather API - untuk menampilkan cuaca real-time
 * 2. Maps API - untuk navigasi ke lokasi toko
 * 3. AI API - untuk rekomendasi makanan berbasis AI
 */

export const API_CONFIG = {
  // ============================================
  // WEATHER API
  // ============================================
  // Provider: OpenWeatherMap (https://openweathermap.org/api)
  // 
  // Cara mendapatkan API Key:
  // 1. Daftar di https://openweathermap.org/
  // 2. Masuk ke dashboard
  // 3. Buat API key baru di menu "API Keys"
  // 4. Copy API key dan paste di bawah ini
  //
  // Endpoint yang digunakan: Current Weather Data
  // Rate limit: 60 calls/minute (free tier)
  // 
  WEATHER_API_KEY: '', // <-- ISI API KEY WEATHER DI SINI
  WEATHER_API_URL: 'https://api.openweathermap.org/data/2.5/weather',

  // ============================================
  // MAPS API
  // ============================================
  // Provider: Google Maps Platform (https://developers.google.com/maps)
  // 
  // Cara mendapatkan API Key:
  // 1. Buka https://console.cloud.google.com/
  // 2. Buat project baru atau pilih project yang ada
  // 3. Enable "Maps JavaScript API" dan "Directions API"
  // 4. Buat credentials > API Key
  // 5. Copy API key dan paste di bawah ini
  //
  // Alternatif: Leaflet + OpenStreetMap (gratis, tanpa API key)
  // Jika MAPS_API_KEY kosong, website akan menggunakan OpenStreetMap
  //
  MAPS_API_KEY: '', // <-- ISI API KEY GOOGLE MAPS DI SINI
  
  // ============================================
  // AI API (Untuk Rekomendasi Makanan)
  // ============================================
  // Provider: OpenAI (https://platform.openai.com/)
  // Alternatif: Google Gemini, Anthropic Claude
  // 
  // Cara mendapatkan API Key OpenAI:
  // 1. Daftar di https://platform.openai.com/
  // 2. Masuk ke menu API Keys
  // 3. Buat API key baru
  // 4. Copy API key dan paste di bawah ini
  //
  // Model yang direkomendasikan: gpt-3.5-turbo
  // Rate limit: Sesuai plan OpenAI Anda
  //
  AI_API_KEY: '', // <-- ISI API KEY AI DI SINI
  AI_API_URL: 'https://api.openai.com/v1/chat/completions',
  AI_MODEL: 'gpt-3.5-turbo',
};

/**
 * ============================================
 * HELPER FUNCTIONS
 * ============================================
 * Fungsi-fungsi untuk mengecek apakah API sudah dikonfigurasi
 */

// Cek apakah Weather API sudah dikonfigurasi
export const isWeatherApiConfigured = (): boolean => {
  return Boolean(API_CONFIG.WEATHER_API_KEY && API_CONFIG.WEATHER_API_KEY.length > 0);
};

// Cek apakah Maps API sudah dikonfigurasi
export const isMapsApiConfigured = (): boolean => {
  return Boolean(API_CONFIG.MAPS_API_KEY && API_CONFIG.MAPS_API_KEY.length > 0);
};

// Cek apakah AI API sudah dikonfigurasi
export const isAiApiConfigured = (): boolean => {
  return Boolean(API_CONFIG.AI_API_KEY && API_CONFIG.AI_API_KEY.length > 0);
};

/**
 * ============================================
 * API USAGE EXAMPLES
 * ============================================
 */

/*
// Contoh penggunaan Weather API:
const fetchWeather = async (city: string) => {
  if (!isWeatherApiConfigured()) {
    console.log('Weather API belum dikonfigurasi');
    return null;
  }
  
  const response = await fetch(
    `${API_CONFIG.WEATHER_API_URL}?q=${city},ID&appid=${API_CONFIG.WEATHER_API_KEY}&units=metric&lang=id`
  );
  return response.json();
};

// Contoh penggunaan Maps API (Google Maps):
const openGoogleMapsRoute = (lat: number, lng: number) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, '_blank');
};

// Contoh penggunaan AI API:
const getAIRecommendation = async (prompt: string) => {
  if (!isAiApiConfigured()) {
    console.log('AI API belum dikonfigurasi');
    return null;
  }
  
  const response = await fetch(API_CONFIG.AI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model: API_CONFIG.AI_MODEL,
      messages: [
        { role: 'system', content: 'Kamu adalah asisten rekomendasi makanan.' },
        { role: 'user', content: prompt }
      ],
    }),
  });
  return response.json();
};
*/
