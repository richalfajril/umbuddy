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
    label: 'Kelola Soal',
    href: '/admin/questions',
    icon: 'questions',
    description: 'Draft, publish, arsip, dan restore soal.',
    prefetch: true,
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: 'users',
    description: 'Kelola pengguna dan status akun.',
    isSoon: true,
  },
  {
    label: 'Notifikasi',
    href: '/admin/notifications',
    icon: 'notifications',
    description: 'Kelola campaign dan pesan sistem.',
    isSoon: true,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
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
