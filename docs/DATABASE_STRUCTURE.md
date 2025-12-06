# Hunger's Harmony - Database Structure

## Overview
Dokumentasi lengkap struktur database untuk website Hunger's Harmony.

---

## Diagram Entity Relationship

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │   user_roles    │     │     shops       │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ id (PK)         │────<│ user_id (FK)    │     │ id (PK)         │
│ email           │     │ role            │     │ owner_id (FK)   │>───┐
│ created_at      │     │ id (PK)         │     │ shop_name       │    │
│ address         │     └─────────────────┘     │ open_time       │    │
│ location_lat    │                             │ close_time      │    │
│ location_lng    │                             │ latitude        │    │
└─────────────────┘                             │ longitude       │    │
                                                │ created_at      │    │
                                                └─────────────────┘    │
                                                         │             │
                                                         │             │
┌─────────────────┐     ┌─────────────────┐     ┌───────▼─────────┐    │
│ product_images  │     │ delivery_links  │     │    products     │    │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤    │
│ id (PK)         │     │ id (PK)         │     │ id (PK)         │    │
│ product_id (FK) │>────│ product_id (FK) │>────│ shop_id (FK)    │>───┘
│ image_url       │     │ gofood_url      │     │ name            │
│ created_at      │     │ grabfood_url    │     │ type            │
└─────────────────┘     │ shopeefood_url  │     │ price           │
                        └─────────────────┘     │ description     │
                                                │ weather_suit    │
                                                │ created_at      │
┌─────────────────┐                             └─────────────────┘
│ admin_requests  │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ user_email      │
│ shop_name       │
│ location_lat    │
│ location_lng    │
│ manual_loc_url  │
│ status          │
│ created_at      │
└─────────────────┘
```

---

## Table Definitions

### 1. users (Extends auth.users)
Tabel profil pengguna yang memperluas auth.users dari Supabase.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  address TEXT,
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

### 2. user_roles
Tabel untuk menyimpan role pengguna (PENTING: terpisah dari profiles untuk keamanan).

```sql
-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('superadmin', 'admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Policy: Users can view their own roles
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Only superadmin can manage roles
CREATE POLICY "Superadmin can manage roles"
  ON public.user_roles FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'));
```

### 3. shops
Tabel untuk menyimpan informasi warung/toko.

```sql
CREATE TABLE public.shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shop_name TEXT NOT NULL,
  open_time TIME NOT NULL DEFAULT '08:00',
  close_time TIME NOT NULL DEFAULT '21:00',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  address TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.shops ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active shops"
  ON public.shops FOR SELECT
  USING (is_active = true);

CREATE POLICY "Owners can manage own shop"
  ON public.shops FOR ALL
  TO authenticated
  USING (auth.uid() = owner_id);

CREATE POLICY "Superadmin can manage all shops"
  ON public.shops FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'));
```

### 4. products
Tabel untuk menyimpan produk makanan/minuman.

```sql
-- Create enum for product type
CREATE TYPE public.product_type AS ENUM ('makanan', 'minuman');

-- Create enum for weather suitability
CREATE TYPE public.weather_suitability AS ENUM ('panas', 'dingin', 'sejuk', 'semua');

CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES public.shops(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type product_type NOT NULL,
  price INTEGER NOT NULL CHECK (price >= 0),
  description TEXT,
  weather_suitability weather_suitability DEFAULT 'semua',
  is_available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view available products"
  ON public.products FOR SELECT
  USING (is_available = true);

CREATE POLICY "Shop owners can manage own products"
  ON public.products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.shops
      WHERE shops.id = products.shop_id
      AND shops.owner_id = auth.uid()
    )
  );
```

### 5. product_images
Tabel untuk menyimpan gambar produk.

```sql
CREATE TABLE public.product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view product images"
  ON public.product_images FOR SELECT
  USING (true);

CREATE POLICY "Shop owners can manage product images"
  ON public.product_images FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      JOIN public.shops ON shops.id = products.shop_id
      WHERE products.id = product_images.product_id
      AND shops.owner_id = auth.uid()
    )
  );
```

### 6. delivery_links
Tabel untuk menyimpan link delivery platform.

```sql
CREATE TABLE public.delivery_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL UNIQUE,
  gofood_url TEXT,
  grabfood_url TEXT,
  shopeefood_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.delivery_links ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view delivery links"
  ON public.delivery_links FOR SELECT
  USING (true);

CREATE POLICY "Shop owners can manage delivery links"
  ON public.delivery_links FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      JOIN public.shops ON shops.id = products.shop_id
      WHERE products.id = delivery_links.product_id
      AND shops.owner_id = auth.uid()
    )
  );
```

### 7. admin_requests
Tabel untuk menyimpan request user yang ingin menjadi admin (pemilik warung).

```sql
-- Create enum for request status
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE public.admin_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_email TEXT NOT NULL,
  shop_name TEXT NOT NULL,
  location_lat DECIMAL(10, 8) NOT NULL,
  location_lng DECIMAL(11, 8) NOT NULL,
  manual_location_url TEXT,
  status request_status DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.admin_requests ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own requests"
  ON public.admin_requests FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create requests"
  ON public.admin_requests FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Superadmin can manage all requests"
  ON public.admin_requests FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'superadmin'));
```

---

## Trigger Functions

### Auto-create profile on signup
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  -- Assign default 'user' role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### Auto-update timestamps
```sql
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply to shops
CREATE TRIGGER update_shops_updated_at
  BEFORE UPDATE ON public.shops
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Apply to products
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Apply to delivery_links
CREATE TRIGGER update_delivery_links_updated_at
  BEFORE UPDATE ON public.delivery_links
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

### Handle approved admin request
```sql
CREATE OR REPLACE FUNCTION public.handle_approved_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only proceed if status changed to 'approved'
  IF NEW.status = 'approved' AND OLD.status = 'pending' THEN
    -- Add admin role to user
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    -- Create shop for the user
    INSERT INTO public.shops (owner_id, shop_name, latitude, longitude)
    VALUES (NEW.user_id, NEW.shop_name, NEW.location_lat, NEW.location_lng);
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_request_approved
  AFTER UPDATE ON public.admin_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_approved_request();
```

---

## Storage Buckets

### Product Images Bucket
```sql
-- Create bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true);

-- Policy: Anyone can view product images
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'product-images');

-- Policy: Authenticated users can upload
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Policy: Owners can delete their images
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## Indexes
```sql
-- Performance indexes
CREATE INDEX idx_products_shop_id ON public.products(shop_id);
CREATE INDEX idx_products_type ON public.products(type);
CREATE INDEX idx_products_weather ON public.products(weather_suitability);
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_delivery_links_product_id ON public.delivery_links(product_id);
CREATE INDEX idx_admin_requests_status ON public.admin_requests(status);
CREATE INDEX idx_admin_requests_user_id ON public.admin_requests(user_id);
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_shops_owner_id ON public.shops(owner_id);
```

---

## Sample Data
```sql
-- Insert superadmin (after user signs up)
INSERT INTO public.user_roles (user_id, role)
VALUES ('YOUR_SUPERADMIN_USER_ID', 'superadmin');
```
