# Hunger's Harmony - API Documentation

## Overview
Dokumentasi lengkap untuk semua API yang digunakan oleh website Hunger's Harmony.

---

## Table of Contents
1. [Weather API](#1-weather-api)
2. [Maps API](#2-maps-api)
3. [AI API](#3-ai-api)
4. [Internal API (Supabase)](#4-internal-api-supabase)

---

## 1. Weather API

### Provider: OpenWeatherMap
Website: https://openweathermap.org/api

### Setup
1. Buat akun di https://openweathermap.org/
2. Dapatkan API key dari dashboard
3. Masukkan ke `src/lib/apiConfig.ts`:
```typescript
WEATHER_API_KEY: 'your_api_key_here'
```

### Endpoint yang Digunakan

#### Get Current Weather
```
GET https://api.openweathermap.org/data/2.5/weather
```

**Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| q | string | Yes | City name (e.g., "Jakarta,ID") |
| appid | string | Yes | Your API key |
| units | string | No | "metric" for Celsius |
| lang | string | No | "id" for Indonesian |

**Example Request:**
```typescript
const response = await fetch(
  `https://api.openweathermap.org/data/2.5/weather?q=Jakarta,ID&appid=${API_KEY}&units=metric&lang=id`
);
```

**Example Response:**
```json
{
  "coord": { "lon": 106.8456, "lat": -6.2088 },
  "weather": [
    {
      "id": 801,
      "main": "Clouds",
      "description": "awan tipis",
      "icon": "02d"
    }
  ],
  "main": {
    "temp": 32.5,
    "feels_like": 38.2,
    "humidity": 70
  },
  "name": "Jakarta"
}
```

### Weather Condition IDs
| ID Range | Category | Rekomendasi Makanan |
|----------|----------|---------------------|
| 200-299 | Thunderstorm | Makanan hangat |
| 300-399 | Drizzle | Makanan hangat |
| 500-599 | Rain | Makanan hangat |
| 600-699 | Snow | Makanan hangat |
| 700-799 | Atmosphere | Semua |
| 800 | Clear | Minuman dingin |
| 801-804 | Clouds | Semua |

### Rate Limits
- Free tier: 60 calls/minute, 1,000,000 calls/month
- Paid tier: Sesuai plan

---

## 2. Maps API

### Option A: Google Maps Platform
Website: https://developers.google.com/maps

### Setup
1. Buka https://console.cloud.google.com/
2. Buat project baru
3. Enable APIs:
   - Maps JavaScript API
   - Directions API
   - Geocoding API
4. Buat API key
5. Masukkan ke `src/lib/apiConfig.ts`:
```typescript
MAPS_API_KEY: 'your_google_maps_api_key'
```

### Endpoints yang Digunakan

#### Open Directions (No API needed)
```typescript
// Buka Google Maps dengan rute
const openRoute = (lat: number, lng: number) => {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  window.open(url, '_blank');
};
```

#### Embed Map (API Key needed)
```typescript
// Embed map di halaman
const embedUrl = `https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${lat},${lng}`;
```

### Option B: OpenStreetMap + Leaflet (Gratis)
Tidak memerlukan API key.

```typescript
// Buka OpenStreetMap
const openOSMRoute = (lat: number, lng: number) => {
  const url = `https://www.openstreetmap.org/directions?from=&to=${lat},${lng}`;
  window.open(url, '_blank');
};
```

### Pricing (Google Maps)
- $200 credit/bulan (gratis)
- Directions: $5 per 1000 requests
- Maps JavaScript API: $7 per 1000 loads

---

## 3. AI API

### Provider: OpenAI
Website: https://platform.openai.com/

### Setup
1. Buat akun di https://platform.openai.com/
2. Dapatkan API key
3. Masukkan ke `src/lib/apiConfig.ts`:
```typescript
AI_API_KEY: 'your_openai_api_key'
```

### Endpoint yang Digunakan

#### Chat Completions
```
POST https://api.openai.com/v1/chat/completions
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

**Request Body:**
```json
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "system",
      "content": "Kamu adalah asisten rekomendasi makanan Indonesia. Berikan rekomendasi berdasarkan cuaca, mood, dan preferensi pengguna."
    },
    {
      "role": "user",
      "content": "Rekomendasikan makanan untuk cuaca panas"
    }
  ],
  "temperature": 0.7,
  "max_tokens": 500
}
```

**Example Response:**
```json
{
  "id": "chatcmpl-xxx",
  "choices": [
    {
      "message": {
        "role": "assistant",
        "content": "Untuk cuaca panas, saya merekomendasikan:\n\n1. **Es Cendol** - Minuman segar dengan santan dan gula merah\n2. **Es Teh Manis** - Klasik dan menyegarkan\n3. **Soto Ayam** - Kuah hangat tapi tidak berat\n4. **Gado-gado** - Sayuran segar dengan bumbu kacang"
      }
    }
  ],
  "usage": {
    "prompt_tokens": 50,
    "completion_tokens": 100,
    "total_tokens": 150
  }
}
```

### Prompt Templates

#### Rekomendasi Berdasarkan Cuaca
```typescript
const weatherPrompt = (weather: string, temp: number) => `
Berdasarkan cuaca ${weather} dengan suhu ${temp}°C, 
rekomendasikan 3-5 makanan/minuman Indonesia yang cocok.
Format: nama makanan, alasan singkat.
`;
```

#### Rekomendasi Berdasarkan Mood
```typescript
const moodPrompt = (mood: string) => `
User sedang merasa ${mood}. 
Rekomendasikan 3-5 makanan/minuman Indonesia yang bisa membuat mood mereka lebih baik.
Format: nama makanan, alasan psikologis singkat.
`;
```

### Pricing
- GPT-3.5 Turbo: $0.002 per 1K tokens
- GPT-4: $0.03 per 1K tokens (input), $0.06 (output)

### Alternative Providers

#### Google Gemini
```typescript
AI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent'
```

#### Anthropic Claude
```typescript
AI_API_URL: 'https://api.anthropic.com/v1/messages'
```

---

## 4. Internal API (Supabase)

### Authentication

#### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
});
```

#### Sign Out
```typescript
const { error } = await supabase.auth.signOut();
```

### Products API

#### Get All Products
```typescript
const { data, error } = await supabase
  .from('products')
  .select(`
    *,
    shop:shops(*),
    images:product_images(*),
    delivery_links(*)
  `)
  .eq('is_available', true);
```

#### Get Products by Weather
```typescript
const { data, error } = await supabase
  .from('products')
  .select('*, shop:shops(*), images:product_images(*)')
  .eq('weather_suitability', 'panas');
```

#### Create Product (Admin only)
```typescript
const { data, error } = await supabase
  .from('products')
  .insert({
    shop_id: 'shop-uuid',
    name: 'Es Teh Manis',
    type: 'minuman',
    price: 8000,
    description: 'Teh manis dingin segar',
    weather_suitability: 'panas'
  })
  .select();
```

### Shops API

#### Get All Shops
```typescript
const { data, error } = await supabase
  .from('shops')
  .select('*')
  .eq('is_active', true);
```

#### Get Shop with Products
```typescript
const { data, error } = await supabase
  .from('shops')
  .select(`
    *,
    products(
      *,
      images:product_images(*),
      delivery_links(*)
    )
  `)
  .eq('id', 'shop-uuid')
  .single();
```

### Admin Requests API

#### Submit Request
```typescript
const { data, error } = await supabase
  .from('admin_requests')
  .insert({
    user_id: 'user-uuid',
    user_email: 'user@example.com',
    shop_name: 'Warung Baru',
    location_lat: -6.2088,
    location_lng: 106.8456
  })
  .select();
```

#### Get Pending Requests (Superadmin only)
```typescript
const { data, error } = await supabase
  .from('admin_requests')
  .select('*')
  .eq('status', 'pending')
  .order('created_at', { ascending: false });
```

#### Approve/Reject Request (Superadmin only)
```typescript
const { data, error } = await supabase
  .from('admin_requests')
  .update({ 
    status: 'approved', // or 'rejected'
    reviewed_by: 'superadmin-uuid',
    reviewed_at: new Date().toISOString()
  })
  .eq('id', 'request-uuid');
```

### File Upload

#### Upload Product Image
```typescript
const { data, error } = await supabase.storage
  .from('product-images')
  .upload(`${userId}/${fileName}`, file);

// Get public URL
const { data: urlData } = supabase.storage
  .from('product-images')
  .getPublicUrl(`${userId}/${fileName}`);
```

---

## Error Handling

### Standard Error Response
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
}

const handleError = (error: ApiError) => {
  switch (error.code) {
    case 'PGRST116':
      return 'Data tidak ditemukan';
    case '23505':
      return 'Data sudah ada';
    case '42501':
      return 'Tidak memiliki akses';
    default:
      return error.message;
  }
};
```

---

## Rate Limiting Best Practices

1. **Caching**: Cache weather data selama 10-15 menit
2. **Debouncing**: Tunggu user selesai mengetik sebelum memanggil AI
3. **Lazy Loading**: Muat data hanya saat diperlukan
4. **Error Retry**: Implementasi exponential backoff

```typescript
const fetchWithRetry = async (fn: () => Promise<any>, retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(r => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
};
```
