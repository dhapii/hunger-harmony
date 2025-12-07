import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Users, Store, Package, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Header } from '@/components/Header';
import { useWeather } from '@/hooks/useWeather';
import { supabase } from '@/integrations/supabase/client';

interface ShopRequest {
  id: string;
  user_id: string;
  shop_name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  province: string | null;
  status: string;
  created_at: string;
  user_name?: string;
}

interface AdminInfo {
  id: string;
  user_id: string;
  role: string;
  user_name?: string;
  shop_name?: string;
  shop_address?: string;
}

export default function SuperadminDashboard() {
  const { user, userRole, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [province, setProvince] = useState('jakarta');
  const { weather, loading: weatherLoading } = useWeather(province);
  
  const [requests, setRequests] = useState<ShopRequest[]>([]);
  const [admins, setAdmins] = useState<AdminInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [stats, setStats] = useState({ totalAdmins: 0, totalShops: 0, pendingRequests: 0, totalProducts: 0 });

  useEffect(() => {
    if (!authLoading && (!user || userRole !== 'superadmin')) {
      navigate('/auth');
    }
  }, [user, userRole, authLoading, navigate]);

  useEffect(() => {
    if (user && userRole === 'superadmin') {
      fetchData();
    }
  }, [user, userRole]);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch shop requests
    const { data: requestsData } = await supabase
      .from('shop_requests')
      .select('*')
      .order('created_at', { ascending: false });

    // Fetch profiles for requests
    const requestsWithNames: ShopRequest[] = [];
    if (requestsData) {
      for (const req of requestsData) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', req.user_id)
          .maybeSingle();
        
        requestsWithNames.push({
          ...req,
          user_name: profile?.full_name || 'Unknown'
        });
      }
    }

    // Fetch admin roles
    const { data: rolesData } = await supabase
      .from('user_roles')
      .select('*')
      .eq('role', 'admin');

    // Fetch admin info with shops
    const adminsInfo: AdminInfo[] = [];
    if (rolesData) {
      for (const role of rolesData) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('user_id', role.user_id)
          .maybeSingle();
        
        const { data: shop } = await supabase
          .from('shops')
          .select('name, address')
          .eq('owner_id', role.user_id)
          .maybeSingle();
        
        adminsInfo.push({
          id: role.id,
          user_id: role.user_id,
          role: role.role,
          user_name: profile?.full_name || 'Unknown',
          shop_name: shop?.name,
          shop_address: shop?.address || undefined
        });
      }
    }

    // Get stats
    const { count: shopCount } = await supabase.from('shops').select('*', { count: 'exact', head: true });
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });

    setRequests(requestsWithNames);
    setAdmins(adminsInfo);
    setStats({
      totalAdmins: adminsInfo.length,
      totalShops: shopCount || 0,
      pendingRequests: requestsWithNames.filter(r => r.status === 'pending').length,
      totalProducts: productCount || 0
    });
    
    setLoading(false);
  };

  const handleApproveRequest = async (request: ShopRequest) => {
    setProcessingId(request.id);

    // 1. Update request status
    const { error: updateError } = await supabase
      .from('shop_requests')
      .update({ 
        status: 'approved',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', request.id);

    if (updateError) {
      toast({ title: 'Gagal menyetujui', description: updateError.message, variant: 'destructive' });
      setProcessingId(null);
      return;
    }

    // 2. Update user role to admin
    const { error: roleError } = await supabase
      .from('user_roles')
      .update({ role: 'admin' })
      .eq('user_id', request.user_id);

    if (roleError) {
      toast({ title: 'Gagal update role', description: roleError.message, variant: 'destructive' });
      setProcessingId(null);
      return;
    }

    // 3. Create shop for the user
    const { error: shopError } = await supabase
      .from('shops')
      .insert({
        owner_id: request.user_id,
        name: request.shop_name,
        description: request.description,
        address: request.address,
        phone: request.phone,
        province: request.province,
        is_approved: true
      });

    if (shopError) {
      toast({ title: 'Gagal membuat toko', description: shopError.message, variant: 'destructive' });
    } else {
      toast({ title: 'Request disetujui!', description: 'User sekarang menjadi admin' });
      fetchData();
    }

    setProcessingId(null);
  };

  const handleRejectRequest = async (requestId: string) => {
    setProcessingId(requestId);

    const { error } = await supabase
      .from('shop_requests')
      .update({ 
        status: 'rejected',
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId);

    if (error) {
      toast({ title: 'Gagal menolak', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Request ditolak' });
      fetchData();
    }

    setProcessingId(null);
  };

  if (authLoading || (!user || userRole !== 'superadmin')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pendingRequests = requests.filter(r => r.status === 'pending');

  return (
    <div className="min-h-screen page-transition">
      <Header
        province={province}
        onProvinceChange={setProvince}
        weather={weather}
        weatherLoading={weatherLoading}
      />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Shield className="h-8 w-8 text-primary" />
              Dashboard Superadmin
            </h1>
            <p className="text-muted-foreground">Kelola admin dan request toko</p>
          </div>
          <Button onClick={() => navigate('/')}>Lihat Website</Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Admin</CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAdmins}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Toko</CardTitle>
              <Store className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalShops}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Request Pending</CardTitle>
              <Clock className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingRequests}</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="requests" className="space-y-4">
          <TabsList className="bg-secondary">
            <TabsTrigger value="requests" className="relative">
              Request Admin
              {pendingRequests.length > 0 && (
                <Badge className="ml-2 bg-destructive text-destructive-foreground">
                  {pendingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="admins">Daftar Admin</TabsTrigger>
          </TabsList>

          {/* Admin Requests */}
          <TabsContent value="requests" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : requests.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Belum ada request
                </CardContent>
              </Card>
            ) : (
              requests.map((request) => (
                <Card key={request.id} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Store className="h-5 w-5 text-accent" />
                          {request.shop_name}
                        </CardTitle>
                        <CardDescription>
                          {request.user_name} • {request.address}
                        </CardDescription>
                      </div>
                      <Badge
                        variant={
                          request.status === 'pending'
                            ? 'secondary'
                            : request.status === 'approved'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {request.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {request.description && (
                        <p className="text-sm text-muted-foreground">{request.description}</p>
                      )}
                      {request.phone && (
                        <p className="text-sm">Tel: {request.phone}</p>
                      )}
                      {request.status === 'pending' && (
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => handleApproveRequest(request)}
                            disabled={processingId === request.id}
                            className="flex-1 gap-2"
                          >
                            {processingId === request.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            Setujui
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => handleRejectRequest(request.id)}
                            disabled={processingId === request.id}
                            className="flex-1 gap-2"
                          >
                            <XCircle className="h-4 w-4" />
                            Tolak
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Admin List */}
          <TabsContent value="admins" className="space-y-4">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : admins.length === 0 ? (
              <Card className="border-border/50">
                <CardContent className="py-8 text-center text-muted-foreground">
                  Belum ada admin terdaftar
                </CardContent>
              </Card>
            ) : (
              admins.map((admin) => (
                <Card key={admin.id} className="border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-primary" />
                          {admin.user_name}
                        </CardTitle>
                        <CardDescription>
                          {admin.shop_name || 'Belum ada toko'}
                        </CardDescription>
                      </div>
                      <Badge>Admin</Badge>
                    </div>
                  </CardHeader>
                  {admin.shop_address && (
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{admin.shop_address}</p>
                    </CardContent>
                  )}
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
