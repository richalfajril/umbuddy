import { AuthService } from '@/server/auth/auth.service'
import { EmailQuotaService } from '@/server/email/email-quota.service'
import { EMAIL_FROM, getResendClient } from '@/server/email/client'

export class AuthEmailService {
  /**
   * Mengirim email verifikasi setelah pendaftaran dengan pengecekan kuota.
   */
  static async sendVerificationEmail(email: string, ip: string, baseUrl: string) {
    const canCreateVerification = await AuthService.canCreateEmailVerificationRequest(email)
    if (!canCreateVerification) return

    // Cek batas pengiriman email untuk mencegah spam
    const quota = await EmailQuotaService.consumeAuthEmailQuota({
      type: 'verification',
      email,
      ip,
    })
    if (!quota.allowed) return

    // Buat token verifikasi baru
    const verificationRequest = await AuthService.createEmailVerificationRequest(email)
    if (!verificationRequest) return

    // Buat link tautan verifikasi
    const verifyUrl = new URL('/auth/login', baseUrl)
    verifyUrl.searchParams.set('verify_token', verificationRequest.token)

    try {
      // Kirim email via Resend
      await getResendClient().emails.send({
        from: EMAIL_FROM,
        to: verificationRequest.email,
        subject: 'Verifikasi Email Umbuddy',
        text: [
          `Halo ${verificationRequest.name},`,
          '',
          'Klik link berikut untuk mengaktifkan akun Umbuddy kamu. Link berlaku 24 jam:',
          verifyUrl.toString(),
          '',
          'Kalau kamu tidak membuat akun Umbuddy, abaikan email ini.',
        ].join('\n'),
      })
    } catch (error) {
      console.error('Email verification send error:', error)
    }
  }
}
