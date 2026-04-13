-- Insert admin user into auth.users (handled via Supabase Auth API, not raw SQL)
-- Instead, we'll just ensure the complaints table allows anonymous inserts
-- by granting insert to anon role explicitly
GRANT INSERT ON public.complaints TO anon;