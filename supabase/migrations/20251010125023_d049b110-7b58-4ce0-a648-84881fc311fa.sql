-- Phase 1: Make essential settings public
UPDATE public.settings 
SET is_public = true 
WHERE key IN ('site_description', 'social_instagram', 'contact_email');