import { useState, useEffect } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getProductsWithDetails } from '@/data/mockData';
import { ProductWithDetails } from '@/types';
import { toast } from '@/hooks/use-toast';

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export function ProductsTable() {
  const [products, setProducts] = useState<ProductWithDetails[]>([]);

  useEffect(() => {
    setProducts(getProductsWithDetails());
  }, []);

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: 'Produk dihapus',
      description: 'Produk berhasil dihapus dari daftar',
    });
  };

  const weatherLabels = {
    panas: 'Panas',
    dingin: 'Dingin',
    sejuk: 'Sejuk',
    semua: 'Semua',
  };

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle>Daftar Produk</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Tipe</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Cuaca</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {product.type === 'makanan' ? 'Makanan' : 'Minuman'}
                  </Badge>
                </TableCell>
                <TableCell>{formatPrice(product.price)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {weatherLabels[product.weatherSuitability]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {product.deliveryLinks.gofoodUrl && (
                      <Badge className="bg-accent text-xs">GoFood</Badge>
                    )}
                    {product.deliveryLinks.grabfoodUrl && (
                      <Badge className="bg-accent text-xs">Grab</Badge>
                    )}
                    {product.deliveryLinks.shopeefoodUrl && (
                      <Badge className="bg-shopeefood text-xs">Shopee</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
