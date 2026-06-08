import { prisma } from '@/server/db/client'

export class AnalyticsService {
  /**
   * Mengambil statistik pengguna (Total, New Users, dll)
   */
  static async getUsersKpi() {
    const totalUsers = await prisma.user.count()
    
    // Asumsi DAU menggunakan user yang aktif dalam 24 jam terakhir berdasarkan updated_at (pendekatan paling efisien untuk V1)
    const activeLast24Hours = await prisma.user.count({
      where: {
        updated_at: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
        }
      }
    })

    return {
      totalUsers,
      activeLast24Hours
    }
  }

  /**
   * Mengambil statistik Bank Soal
   */
  static async getQuestionsKpi() {
    const totalQuestions = await prisma.question.count()
    const publishedQuestions = await prisma.question.count({
      where: { status: 'PUBLISHED' }
    })
    const draftQuestions = await prisma.question.count({
      where: { status: 'DRAFT' }
    })

    return {
      totalQuestions,
      publishedQuestions,
      draftQuestions
    }
  }

  /**
   * Mengambil statistik interaksi & latihan
   */
  static async getEngagementKpi() {
    const totalPracticeSessions = await prisma.practiceSession.count()
    const totalBattles = await prisma.battle.count()

    return {
      totalPracticeSessions,
      totalBattles
    }
  }

  /**
   * Mengambil trend pendaftaran 7 hari terakhir untuk visualisasi line chart
   */
  static async getRegistrationTrend7Days() {
    // Karena SQLite/Postgres count grouping per hari agak kompleks di Prisma mentah,
    // kita akan mengambil data mentah untuk 7 hari terakhir lalu kita grup di JavaScript
    // Ini aman jika aplikasinya kecil, tapi idealnya pakai groupBy. 
    // Pendekatan Prisma yang direkomendasikan untuk ini:
    
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    sevenDaysAgo.setHours(0, 0, 0, 0)

    const recentUsers = await prisma.user.findMany({
      where: {
        created_at: {
          gte: sevenDaysAgo
        }
      },
      select: {
        created_at: true
      }
    })

    // Grouping by date (YYYY-MM-DD)
    const countsMap: Record<string, number> = {}
    
    // Inisialisasi 7 hari dengan 0
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      countsMap[dateStr] = 0
    }

    recentUsers.forEach((user: { created_at: Date }) => {
      const dateStr = user.created_at.toISOString().split('T')[0]
      if (countsMap[dateStr] !== undefined) {
        countsMap[dateStr]++
      }
    })

    // Format untuk recharts: [{ name: 'Mon', users: 12 }, ...]
    const trendData = Object.keys(countsMap).map(dateStr => {
      const d = new Date(dateStr)
      const dayName = d.toLocaleDateString('id-ID', { weekday: 'short' })
      return {
        name: dayName,
        users: countsMap[dateStr],
        fullDate: dateStr
      }
    })

    return trendData
  }
}
