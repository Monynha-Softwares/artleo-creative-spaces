-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');
CREATE TYPE public.content_status AS ENUM ('draft', 'published', 'archived');

-- Settings table for site-wide configuration
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pages table for general content pages
CREATE TABLE public.pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  status content_status DEFAULT 'published',
  locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Artworks table for portfolio pieces
CREATE TABLE public.artworks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  technique TEXT,
  year INTEGER,
  cover_url TEXT NOT NULL,
  images JSONB DEFAULT '[]'::jsonb,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  status content_status DEFAULT 'published',
  featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Exhibitions table for timeline
CREATE TABLE public.exhibitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  location TEXT,
  year INTEGER NOT NULL,
  date TEXT,
  type TEXT DEFAULT 'group',
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE public.contact_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles table for user information
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artworks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exhibitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS Policies for settings
CREATE POLICY "Settings are viewable by everyone" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Settings are editable by admins" ON public.settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for pages
CREATE POLICY "Published pages are viewable by everyone" ON public.pages FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Pages are editable by admins" ON public.pages FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for artworks
CREATE POLICY "Published artworks are viewable by everyone" ON public.artworks FOR SELECT USING (status = 'published' OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Artworks are editable by admins" ON public.artworks FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for exhibitions
CREATE POLICY "Exhibitions are viewable by everyone" ON public.exhibitions FOR SELECT USING (true);
CREATE POLICY "Exhibitions are editable by admins" ON public.exhibitions FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for contact messages
CREATE POLICY "Anyone can insert contact messages" ON public.contact_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view contact messages" ON public.contact_messages FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update contact messages" ON public.contact_messages FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- RLS Policies for profiles
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by admins" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin') OR auth.uid() = user_id);
CREATE POLICY "User roles are editable by admins" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.pages FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.artworks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES ('artwork-images', 'artwork-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('general-media', 'general-media', true);

-- Storage policies for artwork-images
CREATE POLICY "Artwork images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'artwork-images');
CREATE POLICY "Admins can upload artwork images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'artwork-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update artwork images" ON storage.objects FOR UPDATE USING (bucket_id = 'artwork-images' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete artwork images" ON storage.objects FOR DELETE USING (bucket_id = 'artwork-images' AND public.has_role(auth.uid(), 'admin'));

-- Storage policies for general-media
CREATE POLICY "General media are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'general-media');
CREATE POLICY "Admins can upload general media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'general-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update general media" ON storage.objects FOR UPDATE USING (bucket_id = 'general-media' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete general media" ON storage.objects FOR DELETE USING (bucket_id = 'general-media' AND public.has_role(auth.uid(), 'admin'));

-- Insert seed data for testing
-- Site settings
INSERT INTO public.settings (key, value, description) VALUES
('site_title', '"Creative Portfolio"', 'Main site title'),
('site_description', '"A showcase of creative work and artistic expression"', 'Site meta description'),
('social_instagram', '"https://instagram.com/artist"', 'Instagram profile URL'),
('contact_email', '"hello@example.com"', 'Contact email address');

-- Home page content
INSERT INTO public.pages (slug, title, content, meta_title, meta_description) VALUES
('home', 'Home', 
 '{"hero": {"title": "Creative Vision", "subtitle": "Exploring the intersection of art and technology", "description": "A portfolio showcasing motion design, 3D art, and interactive experiences"}}'::jsonb,
 'Home - Creative Portfolio',
 'Explore a portfolio of creative work spanning motion design, 3D art, and interactive experiences');

-- About page content
INSERT INTO public.pages (slug, title, content, meta_title, meta_description) VALUES
('about', 'About', 
 '{"bio": "Artist and creative technologist exploring the boundaries of digital art. With a background in design and technology, I create immersive experiences that blend traditional artistic techniques with cutting-edge digital tools."}'::jsonb,
 'About - Creative Portfolio',
 'Learn more about the artist and their creative journey');

-- Sample artworks
INSERT INTO public.artworks (slug, title, description, category, technique, year, cover_url, tags, featured, display_order) VALUES
('digital-dreams', 'Digital Dreams', 'An exploration of surreal digital landscapes', 'Motion Design', 'Cinema 4D, After Effects', 2024, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80', ARRAY['motion', 'digital', 'surreal'], true, 1),
('abstract-forms', 'Abstract Forms', 'Geometric abstractions in 3D space', '3D Art', 'Blender', 2024, 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80', ARRAY['3d', 'abstract', 'geometric'], true, 2),
('interactive-experience', 'Interactive Experience', 'User-driven visual narrative', 'Interactive', 'Three.js, React', 2023, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', ARRAY['interactive', 'web', 'experimental'], true, 3),
('motion-study', 'Motion Study', 'Experimental animation exploring fluid dynamics', 'Motion Design', 'Houdini', 2023, 'https://images.unsplash.com/photo-1618172193622-ae2d025f4032?auto=format&fit=crop&w=800&q=80', ARRAY['motion', 'experimental', 'animation'], false, 4),
('virtual-sculpture', 'Virtual Sculpture', 'Digital sculpture in virtual space', '3D Art', 'ZBrush', 2023, 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80', ARRAY['3d', 'sculpture', 'virtual'], false, 5);

-- Sample exhibitions
INSERT INTO public.exhibitions (title, description, location, year, date, type, display_order) VALUES
('Digital Futures', 'Group exhibition exploring digital art forms', 'New York, USA', 2024, 'March 2024', 'group', 1),
('Solo Show: Reflections', 'First solo exhibition showcasing recent work', 'London, UK', 2023, 'September 2023', 'solo', 2),
('Art & Technology Symposium', 'Panel discussion on the future of digital art', 'Berlin, Germany', 2023, 'June 2023', 'group', 3),
('Emerging Artists Collective', 'Group show featuring emerging digital artists', 'Tokyo, Japan', 2022, 'December 2022', 'group', 4);