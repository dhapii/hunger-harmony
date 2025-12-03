import { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { ProductType, WeatherSuitability } from '@/types';

export function AddProductForm() {
  const [formData, setFormData] = useState({
    name: '',
    type: 'makanan' as ProductType,
    price: '',
    description: '',
    weatherSuitability: 'semua' as WeatherSuitability,
    gofoodUrl: '',
    grabfoodUrl: '',
    shopeefoodUrl: '',
  });
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In production, this would save to database
    toast({
      title: 'Produk ditambahkan',
      description: `${formData.name} berhasil ditambahkan`,
    });

    // Reset form
    setFormData({
      name: '',
      type: 'makanan',
      price: '',
      description: '',
      weatherSuitability: 'semua',
      gofoodUrl: '',
      grabfoodUrl: '',
      shopeefoodUrl: '',
    });
    setImages([]);
  };

  const addImageUrl = () => {
    const url = prompt('Masukkan URL gambar:');
    if (url) {
      setImages((prev) => [...prev, url]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Tambah Produk Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Produk</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipe</Label>
              <Select
                value={formData.type}
                onValueChange={(value: ProductType) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="makanan">Makanan</SelectItem>
                  <SelectItem value="minuman">Minuman</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weather">Cocok untuk Cuaca</Label>
              <Select
                value={formData.weatherSuitability}
                onValueChange={(value: WeatherSuitability) =>
                  setFormData({ ...formData, weatherSuitability: value })
                }
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="panas">Panas</SelectItem>
                  <SelectItem value="sejuk">Sejuk</SelectItem>
                  <SelectItem value="dingin">Dingin</SelectItem>
                  <SelectItem value="semua">Semua Cuaca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-input border-border"
              rows={3}
            />
          </div>

          {/* Images */}
          <div className="space-y-2">
            <Label>Foto Produk</Label>
            <div className="flex flex-wrap gap-2">
              {images.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 rounded-lg overflow-hidden">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1 bg-background/80 rounded-full"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addImageUrl}
                className="w-20 h-20 rounded-lg border-2 border-dashed border-border flex items-center justify-center hover:border-primary transition-colors"
              >
                <Plus className="h-6 w-6 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Delivery Links */}
          <div className="space-y-4">
            <Label>Link Platform Delivery</Label>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gofood" className="text-sm text-muted-foreground">
                  GoFood URL
                </Label>
                <Input
                  id="gofood"
                  value={formData.gofoodUrl}
                  onChange={(e) => setFormData({ ...formData, gofoodUrl: e.target.value })}
                  placeholder="https://gofood.co.id/..."
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grabfood" className="text-sm text-muted-foreground">
                  GrabFood URL
                </Label>
                <Input
                  id="grabfood"
                  value={formData.grabfoodUrl}
                  onChange={(e) => setFormData({ ...formData, grabfoodUrl: e.target.value })}
                  placeholder="https://grab.com/food/..."
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopeefood" className="text-sm text-muted-foreground">
                  ShopeeFood URL
                </Label>
                <Input
                  id="shopeefood"
                  value={formData.shopeefoodUrl}
                  onChange={(e) => setFormData({ ...formData, shopeefoodUrl: e.target.value })}
                  placeholder="https://shopee.co.id/food/..."
                  className="bg-input border-border"
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Produk
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
