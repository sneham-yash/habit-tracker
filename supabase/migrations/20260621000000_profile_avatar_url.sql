-- Add profile avatar URL column for Supabase Storage image references
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

COMMENT ON COLUMN public.profiles.avatar_url IS 'Public URL of profile image in Supabase Storage';
