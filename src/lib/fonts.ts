/**
 * Font configuration untuk Umbuddy Design System.
 *
 * Mengapa dua font?
 * - Inter: Optimized untuk teks panjang & soal TWK/TIU/TKP — readability tinggi di ukuran kecil.
 * - Nunito: Geometris, rounded, joyful — digunakan untuk heading, skor, CTA agar terasa "game".
 *
 * Sesuai UI_UX.md: "Inter untuk teks panjang/soal, Nunito/Dinamis untuk heading dan skor."
 */
import { Inter, Nunito } from 'next/font/google'

/**
 * Inter — font utama untuk body text, soal, dan konten panjang.
 * Subsets: latin untuk performa optimal (tidak load charset yang tidak perlu).
 */
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap', // Mencegah FOIT (Flash of Invisible Text)
})

/**
 * Nunito — font heading untuk gamification feel.
 * Weight 400-900 agar bisa dipakai untuk judul bold, skor besar, dan badge.
 */
export const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})
