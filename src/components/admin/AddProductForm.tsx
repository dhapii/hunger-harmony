import { useState, useRef } from 'react';
import { Upload, Plus, X, ImagePlus, Camera } from 'lucide-react';
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          setImages((prev) => [...prev, result]);
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: 'Format tidak didukung',
          description: 'Pilih file gambar (JPG, PNG, dll)',
          variant: 'destructive',
        });
      }
    });

    // Reset input so same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Tambah Produk Baru
        </CardTitle>
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
                  <SelectItem value="makanan">🍽️ Makanan</SelectItem>
                  <SelectItem value="minuman">🥤 Minuman</SelectItem>
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
                  <SelectItem value="panas">☀️ Panas</SelectItem>
                  <SelectItem value="sejuk">🌤️ Sejuk</SelectItem>
                  <SelectItem value="dingin">❄️ Dingin</SelectItem>
                  <SelectItem value="semua">🌈 Semua Cuaca</SelectItem>
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

          {/* Images Upload */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <ImagePlus className="h-4 w-4" />
              Foto Produk
            </Label>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            <div className="flex flex-wrap gap-3">
              {/* Preview uploaded images */}
              {images.map((src, idx) => (
                <div 
                  key={idx} 
                  className="relative w-24 h-24 rounded-xl overflow-hidden border-2 border-border group"
                >
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 p-1.5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-background/80 px-1.5 py-0.5 rounded text-xs">
                    {idx + 1}
                  </div>
                </div>
              ))}
              
              {/* Add photo button */}
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-24 h-24 rounded-xl border-2 border-dashed border-primary/50 flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-all"
              >
                <Camera className="h-6 w-6 text-primary" />
                <span className="text-xs text-muted-foreground">Pilih Foto</span>
              </button>
            </div>

            <p className="text-xs text-muted-foreground">
              📱 Klik tombol di atas untuk memilih foto dari laptop atau HP. Bisa pilih beberapa foto sekaligus.
            </p>
          </div>

          {/* Delivery Links */}
          <div className="space-y-4">
            <Label>Link Platform Delivery</Label>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gofood" className="text-sm text-muted-foreground flex items-center gap-1">
                  🟢 GoFood URL
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
                <Label htmlFor="grabfood" className="text-sm text-muted-foreground flex items-center gap-1">
                  🟢 GrabFood URL
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
                <Label htmlFor="shopeefood" className="text-sm text-muted-foreground flex items-center gap-1">
                  🟠 ShopeeFood URL
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

          <Button type="submit" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
