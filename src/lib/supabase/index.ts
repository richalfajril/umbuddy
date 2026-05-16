/**
 * Barrel export untuk Supabase clients.
 * Browser-safe: import { createSupabaseBrowserClient } from '@/lib/supabase'
 * Server-only:  import { createSupabaseServerClient } from '@/lib/supabase/server'
 */
export { createSupabaseBrowserClient } from './client'
// server.ts tidak di-export dari barrel ini agar tidak ter-import secara tidak sengaja
// di Client Components. Import langsung: '@/lib/supabase/server'
