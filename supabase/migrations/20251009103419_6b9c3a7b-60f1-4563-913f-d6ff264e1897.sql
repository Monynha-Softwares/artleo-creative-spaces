-- Phase 1: Critical Security Fixes

-- 1. Fix profiles table RLS - prevent public access to email addresses
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 2. Secure settings table with is_public field
ALTER TABLE public.settings 
ADD COLUMN IF NOT EXISTS is_public boolean DEFAULT false;

DROP POLICY IF EXISTS "Settings are viewable by everyone" ON public.settings;

CREATE POLICY "Public settings viewable by everyone" ON public.settings
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Admins can view all settings" ON public.settings
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- 3. Fix handle_updated_at function to include search_path
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 4. Update seed data to mark public settings
UPDATE public.settings 
SET is_public = true 
WHERE key IN ('site_title', 'site_tagline', 'bio', 'social_links');

-- Note: Contact messages RLS is already secure (admin-only SELECT)