export interface AdminUserListItem {
  id: string
  name: string
  email: string
  status: string
  role: string
  created_at: string | Date
  profile?: {
    target_instansi?: string | null
  } | null
}

export interface AdminUserSummaryStats {
  totalUsers: number
  activeLast7Days: number
  newLast30Days: number
  suspendedUsers: number
}

export interface AdminUsersListResponse {
  users: AdminUserListItem[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Untuk data profil lebih lengkap saat detail
export interface AdminUserDetail {
  id: string
  name: string
  email: string
  status: string
  role: string
  created_at: string | Date
  profile?: { target_instansi?: string | null } | null
  progression?: { total_xp?: number | null; level?: number | null } | null
  activity_logs?: { id: string; type: string; description?: string | null; created_at: string | Date }[] | null
  support_notes?: { id: string; category?: string | null; note: string; admin_id: string | null; created_at: string | Date }[] | null
}
