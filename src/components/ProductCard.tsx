import { Clock } from 'lucide-react';
import { ProductWithDetails } from '@/types';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageCarousel } from './ImageCarousel';
import { DeliveryLinks } from './DeliveryLinks';
import { MapsToggle } from './MapsToggle';

interface ProductCardProps {
  product: ProductWithDetails;
}

function isShopOpen(openTime: string, closeTime: string): boolean {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  
  const [openHour, openMin] = openTime.split(':').map(Number);
  const [closeHour, closeMin] = closeTime.split(':').map(Number);
  
  const openMinutes = openHour * 60 + openMin;
  const closeMinutes = closeHour * 60 + closeMin;
  
  return currentMinutes >= openMinutes && currentMinutes <= closeMinutes;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export function ProductCard({ product }: ProductCardProps) {
  const { shop, images, deliveryLinks } = product;
  const isOpen = isShopOpen(shop.openTime, shop.closeTime);

  return (
    <Card className="glass-card p-4 space-y-4 animate-fade-in">
      {/* Shop Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-foreground">{shop.shopName}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{shop.openTime} - {shop.closeTime}</span>
          </div>
        </div>
        <Badge 
          variant={isOpen ? 'default' : 'secondary'}
          className={isOpen ? 'bg-accent text-accent-foreground' : ''}
        >
          {isOpen ? 'Buka' : 'Tutup'}
        </Badge>
      </div>

      {/* Product Name */}
      <h2 className="text-xl font-bold text-foreground">{product.name}</h2>

      {/* Image Carousel */}
      <ImageCarousel images={images} />

      {/* Price */}
      <p className="text-lg font-semibold text-accent">{formatPrice(product.price)}</p>

      {/* Description */}
      {product.description && (
        <p className="text-sm text-muted-foreground">{product.description}</p>
      )}

      {/* Delivery Links */}
      <DeliveryLinks links={deliveryLinks} />

      {/* Maps Toggle */}
      <MapsToggle shop={shop} />
    </Card>
  );
}
