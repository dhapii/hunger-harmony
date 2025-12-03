import { useState, useMemo } from 'react';
import { Utensils, Coffee } from 'lucide-react';
import { Header } from '@/components/Header';
import { RecommendationFilters } from '@/components/RecommendationFilters';
import { ProductCard } from '@/components/ProductCard';
import { useWeather, getWeatherSuitability } from '@/hooks/useWeather';
import { useProducts } from '@/hooks/useProducts';
import { Skeleton } from '@/components/ui/skeleton';

export default function Index() {
  const [province, setProvince] = useState('jakarta');
  const [filters, setFilters] = useState({
    byWeather: true,
    byMood: true,
    byPrompt: true,
  });
  const [mood, setMood] = useState('');
  const [prompt, setPrompt] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'weather'>('all');

  const { weather, loading: weatherLoading } = useWeather(province);
  const { products, loading: productsLoading } = useProducts();

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by weather if enabled and weather data available
    if (filters.byWeather && weather && activeFilter === 'weather') {
      const suitability = getWeatherSuitability(weather.temperature);
      result = result.filter(
        (p) => p.weatherSuitability === suitability || p.weatherSuitability === 'semua'
      );
    }

    return result;
  }, [products, filters.byWeather, weather, activeFilter]);

  const makanan = filteredProducts.filter((p) => p.type === 'makanan');
  const minuman = filteredProducts.filter((p) => p.type === 'minuman');

  const handleGetRecommendations = () => {
    setActiveFilter('weather');
  };

  return (
    <div className="min-h-screen">
      <Header
        province={province}
        onProvinceChange={setProvince}
        weather={weather}
        weatherLoading={weatherLoading}
      />

      <main className="container mx-auto px-4 py-6 space-y-8">
        {/* Filters */}
        <RecommendationFilters
          filters={filters}
          onFiltersChange={setFilters}
          mood={mood}
          onMoodChange={setMood}
          prompt={prompt}
          onPromptChange={setPrompt}
          onGetRecommendations={handleGetRecommendations}
        />

        {/* Products Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Makanan Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Utensils className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-primary">Makanan</h2>
            </div>
            
            {productsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-[400px] rounded-lg" />
                ))}
              </div>
            ) : makanan.length > 0 ? (
              <div className="space-y-4">
                {makanan.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Tidak ada makanan yang sesuai
              </p>
            )}
          </section>

          {/* Minuman Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Coffee className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-primary">Minuman</h2>
            </div>

            {productsLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <Skeleton key={i} className="h-[400px] rounded-lg" />
                ))}
              </div>
            ) : minuman.length > 0 ? (
              <div className="space-y-4">
                {minuman.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Tidak ada minuman yang sesuai
              </p>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
