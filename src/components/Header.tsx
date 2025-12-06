import { User, Store, LogOut, Settings, Shield } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ProvinceSelector } from './ProvinceSelector';
import { WeatherDisplay } from './WeatherDisplay';
import { ThemeToggle } from './ThemeToggle';
import { BackButton } from './BackButton';
import { useAuth } from '@/hooks/useAuth';
import { WeatherData } from '@/types';

interface HeaderProps {
  province: string;
  onProvinceChange: (province: string) => void;
  weather: WeatherData | null;
  weatherLoading: boolean;
}

export function Header({
  province,
  onProvinceChange,
  weather,
  weatherLoading,
}: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50 transition-colors">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {!isHome && <BackButton />}
          <h1 
            className="text-xl font-bold cursor-pointer gradient-text hover:opacity-80 transition-opacity"
            onClick={() => navigate('/')}
          >
            Hunger's Harmony
          </h1>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <ProvinceSelector value={province} onChange={onProvinceChange} />
            <WeatherDisplay weather={weather} loading={weatherLoading} />
          </div>

          <ThemeToggle />

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
            <DropdownMenuContent align="end" className="w-56 bg-card border-border">
              {user ? (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.email}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  
                  {user.role === 'superadmin' && (
                    <DropdownMenuItem onClick={() => navigate('/superadmin')} className="gap-2">
                      <Shield className="h-4 w-4" />
                      Dashboard Superadmin
                    </DropdownMenuItem>
                  )}
                  
                  {user.role === 'admin' && (
                    <DropdownMenuItem onClick={() => navigate('/admin')} className="gap-2">
                      <Settings className="h-4 w-4" />
                      Dashboard Admin
                    </DropdownMenuItem>
                  )}
                  
                  {user.role === 'user' && (
                    <DropdownMenuItem onClick={() => navigate('/profile')} className="gap-2">
                      <Store className="h-4 w-4" />
                      Profil & Buka Toko
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <DropdownMenuItem onClick={() => navigate('/auth')} className="gap-2">
                  <User className="h-4 w-4" />
                  Login
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Mobile weather display */}
      <div className="md:hidden px-4 pb-3 flex items-center gap-2">
        <ProvinceSelector value={province} onChange={onProvinceChange} />
        <WeatherDisplay weather={weather} loading={weatherLoading} />
      </div>
    </header>
  );
}
