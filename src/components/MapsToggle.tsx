import { useState } from 'react';
import { MapPin, Navigation, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Shop } from '@/types';
import { API_CONFIG, isMapsApiConfigured } from '@/lib/apiConfig';

interface MapsToggleProps {
  shop: Shop;
}

export function MapsToggle({ shop }: MapsToggleProps) {
  const [showMap, setShowMap] = useState(false);

  const openGoogleMaps = () => {
    // Opens Google Maps with directions from current location to shop
    const url = `https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`;
    window.open(url, '_blank');
  };

  // Gunakan Google Maps jika API key tersedia, fallback ke OpenStreetMap
  const mapSrc = isMapsApiConfigured()
    ? `https://www.google.com/maps/embed/v1/place?key=${API_CONFIG.MAPS_API_KEY}&q=${shop.latitude},${shop.longitude}&zoom=15`
    : `https://www.openstreetmap.org/export/embed.html?bbox=${shop.longitude - 0.01},${shop.latitude - 0.01},${shop.longitude + 0.01},${shop.latitude + 0.01}&layer=mapnik&marker=${shop.latitude},${shop.longitude}`;

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowMap(!showMap)}
        className="border-border/50 hover:bg-secondary"
      >
        <MapPin className="mr-2 h-4 w-4" />
        {showMap ? 'Sembunyikan Peta' : 'Lihat Lokasi'}
      </Button>

      {showMap && (
        <div className="animate-fade-in rounded-lg overflow-hidden border border-border/50">
          <div className="relative h-[200px] bg-muted">
            <iframe
              src={mapSrc}
              className="w-full h-full border-0"
              title="Shop Location"
              loading="lazy"
            />
            
            <div className="absolute top-2 right-2 flex gap-2">
              <Button
                size="sm"
                onClick={openGoogleMaps}
                className="bg-accent hover:bg-accent/90"
              >
                <Navigation className="mr-1 h-4 w-4" />
                Petunjuk Arah
              </Button>
              <Button
                size="icon"
                variant="secondary"
                onClick={() => setShowMap(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {!isMapsApiConfigured() && (
              <div className="absolute bottom-2 left-2 text-xs bg-background/80 px-2 py-1 rounded">
                💡 Isi MAPS_API_KEY di apiConfig.ts
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
