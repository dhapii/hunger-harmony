import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Store, Settings, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { ProductsTable } from '@/components/admin/ProductsTable';
import { ShopSettings } from '@/components/admin/ShopSettings';
import { AddProductForm } from '@/components/admin/AddProductForm';
import { Header } from '@/components/Header';
import { useWeather } from '@/hooks/useWeather';
import { supabase } from '@/integrations/supabase/client';

export default function AdminDashboard() {
  const { user, userRole, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [province, setProvince] = useState('jakarta');
  const { weather, loading: weatherLoading } = useWeather(province);
  const [stats, setStats] = useState({ totalProducts: 0, totalShops: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || (userRole !== 'admin' && userRole !== 'superadmin'))) {
      navigate('/auth');
    }
  }, [user, userRole, authLoading, navigate]);

  useEffect(() => {
    if (user && (userRole === 'admin' || userRole === 'superadmin')) {
      fetchStats();
    }
  }, [user, userRole]);

  const fetchStats = async () => {
    if (!user) return;

    // Get shops owned by this user
    const { data: shops } = await supabase
      .from('shops')
      .select('id')
      .eq('owner_id', user.id);

    const shopIds = shops?.map(s => s.id) || [];

    // Get products count
    let productCount = 0;
    if (shopIds.length > 0) {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .in('shop_id', shopIds);
      productCount = count || 0;
    }

    setStats({
      totalProducts: productCount,
      totalShops: shops?.length || 0
    });
    setLoading(false);
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen page-transition">
      <Header
        province={province}
        onProvinceChange={setProvince}
        weather={weather}
        weatherLoading={weatherLoading}
      />

      <main className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8 text-primary" />
              Dashboard Admin
            </h1>
            <p className="text-muted-foreground">Kelola produk dan pengaturan warung Anda</p>
          </div>
          <Button onClick={() => navigate('/')}>
            Lihat Website
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalProducts}
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Toko Saya</CardTitle>
              <Store className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalShops}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="products">Daftar Produk</TabsTrigger>
            <TabsTrigger value="add">Tambah Produk</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan Warung</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="animate-fade-in">
            <ProductsTable />
          </TabsContent>

          <TabsContent value="add" className="animate-fade-in">
            <AddProductForm />
          </TabsContent>

          <TabsContent value="settings" className="animate-fade-in">
            <ShopSettings />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
