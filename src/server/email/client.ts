/**
 * src/server/email/client.ts
 * Resend email client — SERVER-ONLY.
 *
 * ⚠️ SERVER-ONLY — API key tidak boleh exposed ke browser.
 *
 * Digunakan untuk:
 * - Email verifikasi akun
 * - Reset password
 * - Notifikasi terjadwal (via background job)
 *
 * Stack: Resend (free tier) sesuai Zero-Budget constraint (AGENTS.md).
 * Email templates menggunakan react-email.
 *
 * EMAIL_FROM env: harus domain yang sudah diverifikasi di Resend.
 * Dev fallback: onboarding@resend.dev (domain bawaan Resend, gratis).
 */

import 'server-only'
import { Resend } from 'resend'

/**
 * Lazy-initialized Resend client singleton.
 */
let resendInstance: Resend | null = null

export function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error('[Resend] Missing RESEND_API_KEY env var')
    }
    resendInstance = new Resend(apiKey)
  }
  return resendInstance
}

/**
 * Alamat pengirim email default.
 * Fallback ke onboarding@resend.dev untuk development.
 */
export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? 'Umbuddy <onboarding@resend.dev>'
