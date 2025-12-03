import { useState } from 'react';
import { Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';

export function ShopSettings() {
  const [settings, setSettings] = useState({
    shopName: 'Warung Bu Siti',
    openTime: '07:00',
    closeTime: '21:00',
    latitude: '-6.2088',
    longitude: '106.8456',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // In production, save to database
    toast({
      title: 'Pengaturan disimpan',
      description: 'Pengaturan warung berhasil diperbarui',
    });
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Pengaturan Warung</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="shopName">Nama Warung</Label>
            <Input
              id="shopName"
              value={settings.shopName}
              onChange={(e) => setSettings({ ...settings, shopName: e.target.value })}
              required
              className="bg-input border-border"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="openTime">Jam Buka</Label>
              <Input
                id="openTime"
                type="time"
                value={settings.openTime}
                onChange={(e) => setSettings({ ...settings, openTime: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="closeTime">Jam Tutup</Label>
              <Input
                id="closeTime"
                type="time"
                value={settings.closeTime}
                onChange={(e) => setSettings({ ...settings, closeTime: e.target.value })}
                required
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label>Lokasi Warung</Label>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude" className="text-sm text-muted-foreground">
                  Latitude
                </Label>
                <Input
                  id="latitude"
                  value={settings.latitude}
                  onChange={(e) => setSettings({ ...settings, latitude: e.target.value })}
                  placeholder="-6.2088"
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="longitude" className="text-sm text-muted-foreground">
                  Longitude
                </Label>
                <Input
                  id="longitude"
                  value={settings.longitude}
                  onChange={(e) => setSettings({ ...settings, longitude: e.target.value })}
                  placeholder="106.8456"
                  className="bg-input border-border"
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Tip: Dapatkan koordinat dari Google Maps dengan klik kanan lokasi warung Anda
            </p>
          </div>

          <Button type="submit" className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Simpan Pengaturan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
