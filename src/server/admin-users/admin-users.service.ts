import { prisma } from '@/server/db/client'
import type { Prisma } from '@prisma/client'

export interface AdminUserListParams {
  page: number
  limit: number
  keyword?: string
  status?: string
  instansi?: string
  registrationSource?: string
}

export class AdminUsersService {
  /**
   * Mengambil daftar user dengan paginasi, pencarian, dan filter status
   */
  static async listUsers(params: AdminUserListParams) {
    const { page, limit, keyword, status, instansi, registrationSource } = params
    const skip = (page - 1) * limit

    const where: Prisma.UserWhereInput = {}

    if (keyword) {
      const isUuidLike = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(keyword.trim())
      
      where.OR = [
        { name: { contains: keyword, mode: 'insensitive' } },
        { email: { contains: keyword, mode: 'insensitive' } },
        { phone: { contains: keyword, mode: 'insensitive' } },
      ]
      
      if (isUuidLike) {
        where.OR.push({ id: { equals: keyword.trim() } })
      }
    }

    if (status) {
      // Sesuai enum UserStatus di prisma: PENDING_VERIFICATION, ACTIVE, SUSPENDED, BANNED
      where.status = status as import('@prisma/client').UserStatus
    }

    if (instansi) {
      where.profile = {
        target_instansi: { contains: instansi, mode: 'insensitive' }
      }
    }

    if (registrationSource) {
      where.registration_source = { equals: registrationSource }
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
   * Mengambil statistik ringkasan pengguna
   */
  static async getUserSummaryStats() {
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const [totalUsers, activeLast7Days, newLast30Days, suspendedUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          auth_sessions: {
            some: {
              issued_at: { gte: sevenDaysAgo }
            }
          }
        }
      }),
      prisma.user.count({
        where: {
          created_at: { gte: thirtyDaysAgo }
        }
      }),
      prisma.user.count({
        where: {
          status: 'SUSPENDED'
        }
      })
    ])

    return {
      totalUsers,
      activeLast7Days,
      newLast30Days,
      suspendedUsers
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

  /**
   * Menambahkan catatan manual (support note) untuk seorang user
   */
  static async addSupportNote(userId: string, adminId: string, note: string, category: string = 'MANUAL_NOTE') {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User tidak ditemukan')

    const newNote = await prisma.userSupportNote.create({
      data: {
        user_id: userId,
        admin_id: adminId,
        note,
        category: category || 'MANUAL_NOTE',
      }
    })

    return {
      id: newNote.id,
      note: newNote.note,
      category: newNote.category,
      adminId: newNote.admin_id,
      createdAt: newNote.created_at
    }
  }

  /**
   * Memverifikasi email pengguna secara manual
   */
  static async manuallyVerifyUserEmail(userId: string, adminId: string, reason: string = 'Email diverifikasi manual oleh admin.') {
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) throw new Error('User tidak ditemukan')

    if (user.email_verified) {
      return {
        userId: user.id,
        emailVerified: user.email_verified,
        status: user.status,
        note: null
      }
    }

    const newStatus = user.status === 'PENDING_VERIFICATION' ? 'ACTIVE' : user.status

    const result = await prisma.$transaction(async (tx) => {
      const updatedUser = await tx.user.update({
        where: { id: userId },
        data: {
          email_verified: true,
          status: newStatus as import('@prisma/client').UserStatus,
        }
      })

      await tx.adminLog.create({
        data: {
          admin_id: adminId,
          action: 'MANUAL_VERIFY_USER_EMAIL',
          resource_type: 'USER',
          resource_id: userId,
          changes: {
            old_email_verified: false,
            new_email_verified: true,
            old_status: user.status,
            new_status: newStatus,
            reason
          }
        }
      })

      const note = await tx.userSupportNote.create({
        data: {
          user_id: userId,
          admin_id: adminId,
          note: reason,
          category: 'MANUAL_EMAIL_VERIFICATION',
        }
      })

      return {
        userId: updatedUser.id,
        emailVerified: updatedUser.email_verified,
        status: updatedUser.status,
        note
      }
    })

    return result
  }
}
