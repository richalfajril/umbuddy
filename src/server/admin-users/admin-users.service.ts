import { prisma } from '@/server/db/client'
import type { Prisma } from '@prisma/client'

export interface AdminUserListParams {
  page: number
  limit: number
  keyword?: string
  status?: string
}

export class AdminUsersService {
  /**
   * Mengambil daftar user dengan paginasi, pencarian, dan filter status
   */
  static async listUsers(params: AdminUserListParams) {
    const { page, limit, keyword, status } = params
    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = {}

    if (keyword) {
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } },
      ]
    }

    if (status) {
      // Sesuai enum UserStatus di prisma: PENDING_VERIFICATION, ACTIVE, SUSPENDED, BANNED
      where.status = status as import('@prisma/client').UserStatus
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          role: true,
          created_at: true,
          profile: {
            select: {
              target_instansi: true,
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  /**
   * Mengambil detail lengkap seorang user beserta progress dan log aktivitas terakhir
   */
  static async getUserDetail(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        progression: true,
        activity_logs: {
          orderBy: { created_at: 'desc' },
          take: 10
        },
        support_notes: {
          orderBy: { created_at: 'desc' },
          include: {
            // Kita belum load admin name di schema note, cukup id-nya
          }
        }
      }
    })

    if (!user) throw new Error('User tidak ditemukan')
    
    return user
  }

  /**
   * Mengubah status pengguna (misal: ACTIVE -> SUSPENDED) dan mencatat admin log
   */
  static async updateUserStatus(userId: string, newStatus: string, adminId: string, reason: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User tidak ditemukan')

    // Gunakan transaction untuk memastikan status berubah dan audit log tercatat
    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: { status: newStatus as import('@prisma/client').UserStatus }
      })

      // Catat di admin log
      await tx.adminLog.create({
        data: {
          admin_id: adminId,
          action: 'UPDATE_USER_STATUS',
          resource_type: 'USER',
          resource_id: userId,
          changes: {
            old_status: user.status,
            new_status: newStatus,
            reason
          }
        }
      })

      // Jika ada reason, catat di support notes user
      if (reason) {
        await tx.userSupportNote.create({
          data: {
            user_id: userId,
            admin_id: adminId,
            note: `Status diubah dari ${user.status} ke ${newStatus}. Alasan: ${reason}`,
            category: 'STATUS_CHANGE',
          }
        })
      }

      return updatedUser
    })

    return result
  }
}
