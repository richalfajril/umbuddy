import type { AuthErrorCopy } from '@/features/user-auth/_types/user-auth.types'

// Mapping error credentials NextAuth ke copy aman dan ramah user.
export function getLoginErrorMessage(error?: string | null) {
  switch (error) {
    case 'PENDING_VERIFICATION':
      return 'Akunmu belum diverifikasi. Silakan cek email verifikasi dulu.'
    case 'SUSPENDED':
      return 'Akunmu sedang ditangguhkan. Hubungi support Umbuddy.'
    case 'LOCKED':
      return 'Akunmu terkunci sementara karena alasan keamanan.'
    case 'RATE_LIMITED':
      return 'Terlalu banyak percobaan masuk. Coba lagi beberapa menit lagi.'
    default:
      return 'Email atau password salah!'
  }
}

// Mapping error page NextAuth ke title dan description tanpa expose detail internal.
export function getAuthErrorCopy(error?: string): AuthErrorCopy {
  switch (error) {
    case 'CredentialsSignin':
      return {
        title: 'Kredensial Tidak Cocok 🔑',
        description: 'Kombinasi email atau password yang kamu masukkan salah. Periksa kembali dan coba lagi, ya!',
      }
    case 'AccessDenied':
      return {
        title: 'Akun Belum Aktif ✉️',
        description: 'Akses ditolak karena akunmu belum diverifikasi. Silakan periksa kotak masuk atau spam email kamu untuk tautan verifikasi!',
      }
    case 'Verification':
      return {
        title: 'Tautan Tidak Valid ⏳',
        description: 'Tautan verifikasi sudah kedaluwarsa atau tidak berlaku lagi. Silakan coba masuk kembali untuk mengirim tautan baru.',
      }
    case 'Configuration':
      return {
        title: 'Masalah Konfigurasi ⚙️',
        description: 'Terjadi kesalahan sistem saat mencoba masuk. Tim kami sedang menanganinya. Coba lagi sesaat lagi!',
      }
    case 'OAUTH_SIGNIN_FAILED':
      return {
        title: 'Google Login Tertahan',
        description: 'Google login belum bisa menyelesaikan proses akun. Coba lagi setelah koneksi database dan skema auth tersinkron.',
      }
    default:
      return {
        title: 'Masuk Belum Berhasil',
        description: 'Sesi tidak bisa dibuat. Coba masuk ulang, atau pastikan akunmu sudah aktif dan tidak terkunci.',
      }
  }
}
