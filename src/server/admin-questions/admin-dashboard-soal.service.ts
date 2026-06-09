import 'server-only'
import { prisma } from '@/server/db'
import { canManageQuestions, type AdminSessionContext } from '@/server/admin-auth'

export class AdminDashboardSoalService {
  static async getMetrics(actor: AdminSessionContext) {
    if (!canManageQuestions(actor.admin.role)) {
      throw new Error('Unauthorized')
    }

    const [
      totalQuestions,
      draftQuestions,
      publishedQuestions,
      archivedQuestions,
      invalidQuestions,
      distributionCategory,
      distributionMaterial,
      noExplanation,
    ] = await Promise.all([
      prisma.question.count({ where: { deleted_at: null } }),
      prisma.question.count({ where: { deleted_at: null, status: 'DRAFT' } }),
      prisma.question.count({ where: { deleted_at: null, status: 'PUBLISHED' } }),
      prisma.question.count({ where: { deleted_at: null, status: 'ARCHIVED' } }),
      prisma.questionReport.count({ where: { status: 'PENDING' } }),
      prisma.question.groupBy({
        by: ['category'],
        _count: { id: true },
        where: { deleted_at: null },
      }),
      prisma.question.groupBy({
        by: ['material_id'],
        _count: { id: true },
        where: { deleted_at: null, material_id: { not: null } },
      }),
      prisma.question.count({
        where: {
          deleted_at: null,
          OR: [{ explanation: null }, { explanation: '' }],
        },
      }),
    ])

    // Ambil nama material untuk distribusi materi
    const materialIds = distributionMaterial.map((m) => m.material_id as string)
    const materials = await prisma.questionMaterial.findMany({
      where: { id: { in: materialIds } },
      select: { id: true, name: true },
    })
    const materialMap = new Map(materials.map((m) => [m.id, m.name]))

    const formattedMaterials = distributionMaterial.map((m) => ({
      name: materialMap.get(m.material_id!) || 'Unknown',
      count: m._count.id,
    })).sort((a, b) => b.count - a.count)

    // Ambil recent questions
    const recentQuestions = await prisma.question.findMany({
      where: { deleted_at: null },
      orderBy: { created_at: 'desc' },
      take: 5,
      select: {
        id: true,
        category: true,
        package_code: true,
        number: true,
        status: true,
        created_at: true,
      },
    })

    return {
      total: totalQuestions,
      draft: draftQuestions,
      published: publishedQuestions,
      archived: archivedQuestions,
      invalid: invalidQuestions,
      distributionCategory: distributionCategory.map((c) => ({
        category: c.category,
        count: c._count.id,
      })),
      distributionMaterial: formattedMaterials,
      noExplanation,
      withImages: -1, // Metrik tidak didukung tanpa raw SQL (Prisma JSON limitation)
      tkpIncompleteWeights: -1, // Metrik tidak didukung tanpa raw SQL (Prisma JSON limitation)
      recentQuestions,
    }
  }
}
