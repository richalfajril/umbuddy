/**
 * src/lib/supabase/server.ts
 * Supabase SERVER-ONLY client — pakai service_role key.
 *
 * ⚠️ SERVER-ONLY — jangan pernah import file ini di Client Component.
 * ⚠️ SECURITY.md: service_role bypasses RLS — hanya untuk operasi admin/backend.
 *
 * Gunakan untuk:
 * - API Routes (/api/v1/*)
 * - Server Components yang butuh data sensitif
 * - Server Actions
 * - Background jobs
 *
 * Import Next.js server-only guard agar file ini error jika di-import di browser.
 */

import 'server-only'
import { createClient } from '@supabase/supabase-js'

/**
 * Supabase admin client dengan service_role key.
 * Bypass RLS — gunakan hanya di server-side logic.
 */
export function createSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      '[Supabase Server] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars'
    )
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      // Service role tidak perlu session persistence
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
