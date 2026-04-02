import { createClient } from '@supabase/supabase-js';

// Server-side client with service-role key — bypasses RLS, only use in Route Handlers and Server Components
export const supabase = createClient(
  process.env.SUPABASE_URL ?? '',
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
  { auth: { persistSession: false } }
);
