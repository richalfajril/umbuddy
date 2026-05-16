/**
 * src/lib/supabase/client.ts
 * Supabase BROWSER-SAFE client — hanya pakai anon key (public).
 *
 * Gunakan untuk: realtime channel subscription, public data read di Client Components.
 * JANGAN gunakan untuk operasi yang butuh privilege (gunakan server.ts).
 *
 * "use client" tidak diperlukan di file ini karena hanya export fungsi/instance.
 * Komponen yang menggunakannya yang bertanggung jawab menandai "use client".
 */

import { createClient } from '@supabase/supabase-js'

/** Supabase browser client menggunakan anon key (public read). */
export function createSupabaseBrowserClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
