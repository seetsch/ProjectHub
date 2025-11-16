/**
 * Supabase client configuration for server-side operations.
 * 
 * Uses the service role key which bypasses Row Level Security (RLS) policies.
 * This is appropriate for server-side API routes where we need full database access.
 * 
 * Security Note: The service role key should NEVER be exposed to client-side code.
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    // Disable session persistence since we're using custom JWT authentication
    persistSession: false,
  },
});
