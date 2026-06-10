import type { AdminNavItem } from '../_types/admin-dashboard.types'

// Menu utama backoffice yang sengaja hanya berisi fitur admin.
export const ADMIN_DASHBOARD_NAV_ITEMS: AdminNavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'dashboard',
    description: 'Ringkasan operasional admin.',
    prefetch: true,
  },
  {
    label: 'Dashboard Soal',
    href: '/admin/questions/dashboard',
    icon: 'questions',
    description: 'Ringkasan performa dan metrik bank soal.',
    prefetch: true,
  },
  {
    label: 'Subtes',
    href: '/admin/questions/subtests',
    icon: 'subtests',
    description: 'Kelola wadah paket soal dan import.',
    prefetch: true,
  },
  {
    label: 'Try Out',
    href: '/admin/questions/tryouts',
    icon: 'tryouts',
    description: 'Manajemen paket soal Try Out.',
    prefetch: true,
  },
  {
    label: 'Bank Soal',
    href: '/admin/questions/bank',
    icon: 'bank',
    description: 'Draft, publish, arsip, dan restore soal.',
    prefetch: true,
  },
  {
    label: 'Sinkron Soal',
    href: '/admin/questions/sync',
    icon: 'sync',
    description: 'Manajemen taksonomi dan materi CPNS.',
    prefetch: true,
  },
  {
    label: 'Users',
    href: '/admin/data/users',
    icon: 'users',
    description: 'Kelola pengguna dan status akun.',
    prefetch: true,
  },
  {
    label: 'Notifikasi',
    href: '/admin/data/notifications',
    icon: 'notifications',
    description: 'Kelola campaign dan pesan sistem.',
    isSoon: true,
  },
  {
    label: 'Settings',
    href: '/admin/data/settings',
    icon: 'settings',
    description: 'Konfigurasi backoffice Umbuddy.',
    isSoon: true,
  },
]

// Kartu ringkasan MVP untuk menjaga dashboard tetap berguna sebelum analytics admin penuh.
export const ADMIN_DASHBOARD_SUMMARY_CARDS = [
  {
    label: 'Question Management',
    value: 'A2',
    detail: 'MVP aktif',
  },
  {
    label: 'Admin Auth',
    value: 'A1',
    detail: 'Guard aktif',
  },
  {
    label: 'Production',
    value: 'Ready',
    detail: 'Vercel hijau',
  },
]
