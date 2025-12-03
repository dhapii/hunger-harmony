import { ChevronLeft, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProvinceSelector } from './ProvinceSelector';
import { WeatherDisplay } from './WeatherDisplay';
import { useAuth } from '@/hooks/useAuth';
import { WeatherData } from '@/types';

interface HeaderProps {
  showBack?: boolean;
  title?: string;
  province: string;
  onProvinceChange: (province: string) => void;
  weather: WeatherData | null;
  weatherLoading: boolean;
}

export function Header({
  showBack,
  title,
  province,
  onProvinceChange,
  weather,
  weatherLoading,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {showBack && (
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Kembali
            </Button>
          )}
          <h1 className="text-lg font-bold">{title || 'Temukan Makananmu'}</h1>
        </div>

        <div className="flex items-center gap-4">
          <ProvinceSelector value={province} onChange={onProvinceChange} />
          <WeatherDisplay weather={weather} loading={weatherLoading} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user ? user.email[0].toUpperCase() : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              {user ? (
                <>
                  <DropdownMenuItem className="text-muted-foreground">
                    {user.email}
                  </DropdownMenuItem>
                  {(user.role === 'admin' || user.role === 'superadmin') && (
                    <DropdownMenuItem onClick={() => navigate('/admin')}>
                      Dashboard Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate('/auth')}>
                  Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
