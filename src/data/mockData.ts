import { User, Shop, Product, ProductImage, DeliveryLink, ProductWithDetails } from '@/types';

export const mockUsers: User[] = [
  { id: '1', email: 'superadmin@hungers.com', role: 'superadmin', createdAt: new Date().toISOString() },
  { id: '2', email: 'admin@warungbusiti.com', role: 'admin', createdAt: new Date().toISOString() },
  { id: '3', email: 'admin@cendoldawet.com', role: 'admin', createdAt: new Date().toISOString() },
];

export const mockShops: Shop[] = [
  {
    id: 'shop1',
    ownerId: '2',
    shopName: 'Warung Bu Siti',
    openTime: '07:00',
    closeTime: '21:00',
    latitude: -6.2088,
    longitude: 106.8456,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'shop2',
    ownerId: '3',
    shopName: 'Cendol Dawet Ayu',
    openTime: '09:00',
    closeTime: '21:00',
    latitude: -6.2100,
    longitude: 106.8500,
    createdAt: new Date().toISOString(),
  },
];

export const mockProducts: Product[] = [
  {
    id: 'prod1',
    shopId: 'shop1',
    name: 'Soto Ayam',
    type: 'makanan',
    price: 25000,
    description: 'Soto ayam khas Jawa dengan kuah kuning gurih',
    weatherSuitability: 'sejuk',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod2',
    shopId: 'shop1',
    name: 'Bakso Malang',
    type: 'makanan',
    price: 30000,
    description: 'Bakso dengan tahu, siomay, dan mie',
    weatherSuitability: 'dingin',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod3',
    shopId: 'shop2',
    name: 'Es Cendol',
    type: 'minuman',
    price: 15000,
    description: 'Es cendol dengan santan dan gula merah',
    weatherSuitability: 'panas',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod4',
    shopId: 'shop2',
    name: 'Es Teh Manis',
    type: 'minuman',
    price: 8000,
    description: 'Teh manis dingin segar',
    weatherSuitability: 'panas',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod5',
    shopId: 'shop1',
    name: 'Mie Ayam',
    type: 'makanan',
    price: 20000,
    description: 'Mie ayam dengan topping pangsit',
    weatherSuitability: 'sejuk',
    createdAt: new Date().toISOString(),
  },
];

export const mockProductImages: ProductImage[] = [
  { id: 'img1', productId: 'prod1', imageUrl: 'https://images.unsplash.com/photo-1569058242567-93de6f36f8eb?w=400' },
  { id: 'img2', productId: 'prod1', imageUrl: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400' },
  { id: 'img3', productId: 'prod2', imageUrl: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400' },
  { id: 'img4', productId: 'prod3', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  { id: 'img5', productId: 'prod4', imageUrl: 'https://images.unsplash.com/photo-1499638673689-79a0b5115d87?w=400' },
  { id: 'img6', productId: 'prod5', imageUrl: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400' },
];

export const mockDeliveryLinks: DeliveryLink[] = [
  { id: 'del1', productId: 'prod1', gofoodUrl: 'https://gofood.co.id', grabfoodUrl: 'https://grab.com/food' },
  { id: 'del2', productId: 'prod2', gofoodUrl: 'https://gofood.co.id', grabfoodUrl: 'https://grab.com/food', shopeefoodUrl: 'https://shopee.co.id/food' },
  { id: 'del3', productId: 'prod3', gofoodUrl: 'https://gofood.co.id' },
  { id: 'del4', productId: 'prod4', grabfoodUrl: 'https://grab.com/food', shopeefoodUrl: 'https://shopee.co.id/food' },
  { id: 'del5', productId: 'prod5', gofoodUrl: 'https://gofood.co.id', grabfoodUrl: 'https://grab.com/food' },
];

export function getProductsWithDetails(): ProductWithDetails[] {
  return mockProducts.map((product) => {
    const shop = mockShops.find((s) => s.id === product.shopId)!;
    const images = mockProductImages.filter((img) => img.productId === product.id);
    const deliveryLinks = mockDeliveryLinks.find((d) => d.productId === product.id) || {
      id: '',
      productId: product.id,
    };

    return {
      ...product,
      shop,
      images,
      deliveryLinks,
    };
  });
}
