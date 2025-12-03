import { useState, useEffect } from 'react';
import { ProductWithDetails, WeatherSuitability, ProductType } from '@/types';
import { getProductsWithDetails, mockProducts, mockShops, mockProductImages, mockDeliveryLinks } from '@/data/mockData';

const PRODUCTS_KEY = 'hungers_harmony_products';
const SHOPS_KEY = 'hungers_harmony_shops';

export function useProducts() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    
    // Check localStorage for custom data
    const storedProducts = localStorage.getItem(PRODUCTS_KEY);
    const storedShops = localStorage.getItem(SHOPS_KEY);

    if (storedProducts && storedShops) {
      try {
        const products = JSON.parse(storedProducts);
        const shops = JSON.parse(storedShops);
        
        // Combine with mock images and links for now
        const combined = products.map((product: any) => {
          const shop = shops.find((s: any) => s.id === product.shopId);
          const images = mockProductImages.filter((img) => img.productId === product.id);
          const deliveryLinks = mockDeliveryLinks.find((d) => d.productId === product.id) || {
            id: '',
            productId: product.id,
            ...product.deliveryLinks,
          };

          return {
            ...product,
            shop: shop || mockShops[0],
            images: product.images || images,
            deliveryLinks: product.deliveryLinks || deliveryLinks,
          };
        });

        setProducts(combined);
      } catch {
        setProducts(getProductsWithDetails());
      }
    } else {
      setProducts(getProductsWithDetails());
    }

    setLoading(false);
  };

  const filterByWeather = (suitability: WeatherSuitability) => {
    return products.filter(
      (p) => p.weatherSuitability === suitability || p.weatherSuitability === 'semua'
    );
  };

  const filterByType = (type: ProductType) => {
    return products.filter((p) => p.type === type);
  };

  const filterByShop = (shopId: string) => {
    return products.filter((p) => p.shopId === shopId);
  };

  return {
    products,
    loading,
    filterByWeather,
    filterByType,
    filterByShop,
    reload: loadProducts,
  };
}
