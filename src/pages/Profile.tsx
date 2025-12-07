import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, MapPin, Loader2, CheckCircle, User, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { useWeather } from '@/hooks/useWeather';
import { supabase } from '@/integrations/supabase/client';

export default function Profile() {
  const { user, profile, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [province, setProvince] = useState('jakarta');
  const { weather, loading: weatherLoading } = useWeather(province);

  const [showOpenStore, setShowOpenStore] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [shopName, setShopName] = useState('');
  const [shopDescription, setShopDescription] = useState('');
  const [shopAddress, setShopAddress] = useState('');
  const [shopPhone, setShopPhone] = useState('');
  const [locationLat, setLocationLat] = useState('');
  const [locationLng, setLocationLng] = useState('');
  const [pendingRequest, setPendingRequest] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    const checkPendingRequest = async () => {
      const { data } = await supabase
        .from('shop_requests')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('status', 'pending')
        .maybeSingle();
      
      setPendingRequest(!!data);
      setLoading(false);
    };

    checkPendingRequest();
  }, [user, navigate]);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationLat(position.coords.latitude.toString());
          setLocationLng(position.coords.longitude.toString());
          toast({
            title: 'Lokasi berhasil didapat',
            description: 'Koordinat telah diisi otomatis',
          });
        },
        () => {
          toast({
            title: 'Gagal mendapat lokasi',
            description: 'Silakan isi manual atau coba lagi',
            variant: 'destructive',
          });
        }
      );
    }
  };

  const handleSubmitRequest = async () => {
    if (!user || !shopName || !shopAddress) {
      toast({
        title: 'Data tidak lengkap',
        description: 'Isi nama toko dan alamat',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    const { error } = await supabase.from('shop_requests').insert({
      user_id: user.id,
      shop_name: shopName,
      description: shopDescription,
      address: shopAddress,
      phone: shopPhone,
      province: province,
      city: '',
      status: 'pending'
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: 'Gagal mengirim request',
        description: error.message,
        variant: 'destructive',
      });
    } else {
      setPendingRequest(true);
      setShowOpenStore(false);
      toast({
        title: 'Request terkirim!',
        description: 'Tunggu persetujuan dari superadmin',
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen page-transition">
      <Header
        province={province}
        onProvinceChange={setProvince}
        weather={weather}
        weatherLoading={weatherLoading}
      />

      <main className="container mx-auto px-4 py-8 max-w-2xl space-y-6">
        {/* Profile Info */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profil Saya
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.full_name || 'Belum diisi'}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{profile?.phone || 'Belum diisi'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Open Store Section - Only show for regular users */}
        {userRole === 'user' && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Store className="h-5 w-5 text-accent" />
                Buka Tokomu
              </CardTitle>
              <CardDescription>
                Ingin berjualan di Hunger's Harmony? Daftar sebagai admin toko!
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              ) : pendingRequest ? (
                <div className="flex items-center gap-3 p-4 bg-accent/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium">Request sedang diproses</p>
                    <p className="text-sm text-muted-foreground">
                      Tunggu persetujuan dari superadmin
                    </p>
                  </div>
                </div>
              ) : !showOpenStore ? (
                <Button onClick={() => setShowOpenStore(true)} className="w-full gap-2">
                  <Store className="h-4 w-4" />
                  Mulai Buka Toko
                </Button>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="shopName">Nama Toko *</Label>
                    <Input
                      id="shopName"
                      placeholder="Contoh: Warung Makan Sederhana"
                      value={shopName}
                      onChange={(e) => setShopName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopDescription">Deskripsi Toko</Label>
                    <Textarea
                      id="shopDescription"
                      placeholder="Ceritakan tentang tokomu..."
                      value={shopDescription}
                      onChange={(e) => setShopDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopAddress">Alamat Toko *</Label>
                    <Input
                      id="shopAddress"
                      placeholder="Jl. Contoh No. 123"
                      value={shopAddress}
                      onChange={(e) => setShopAddress(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="shopPhone">No. Telepon</Label>
                    <Input
                      id="shopPhone"
                      placeholder="08123456789"
                      value={shopPhone}
                      onChange={(e) => setShopPhone(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lokasi Toko (opsional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleGetLocation}
                      className="w-full gap-2"
                    >
                      <MapPin className="h-4 w-4" />
                      Ambil Lokasi Otomatis
                    </Button>
                  </div>

                  {(locationLat || locationLng) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lat">Latitude</Label>
                        <Input
                          id="lat"
                          placeholder="-6.2088"
                          value={locationLat}
                          onChange={(e) => setLocationLat(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lng">Longitude</Label>
                        <Input
                          id="lng"
                          placeholder="106.8456"
                          value={locationLng}
                          onChange={(e) => setLocationLng(e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setShowOpenStore(false)}
                      className="flex-1"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleSubmitRequest}
                      disabled={submitting}
                      className="flex-1 gap-2"
                    >
                      {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                      Kirim Request
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
