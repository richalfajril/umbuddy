import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'
import { AdminAuthService } from '@/server/admin-auth'
import { Prisma, BulkUploadStatus } from '@prisma/client'
import { buildImportedQuestionDraft, getResolvedQuestionTaxonomy, resolveQuestionTaxonomyMap, toQuestionCreateInput } from '@/server/admin-questions'

export async function POST(req: Request) {
  try {
    const session = await AdminAuthService.getCurrentAdmin()
    
    // Validasi Autentikasi Admin
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { packageCode, category: globalCategory, questions } = body

    if (!packageCode || !questions || !Array.isArray(questions)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // Cek duplikasi packageCode
    const existingPackage = await prisma.question.findFirst({
      where: { package_code: packageCode }
    })

    if (existingPackage) {
      return NextResponse.json({ 
        error: `Subtes dengan nama '${packageCode}' sudah ada. Silakan gunakan nama lain.` 
      }, { status: 400 })
    }

    // Melakukan pemetaan baris Excel ke draft soal sesuai template admin terbaru.
    const questionDrafts = questions.map((q: Record<string, unknown>, index: number) => (
      buildImportedQuestionDraft(q, index, {
        packageCode,
        globalCategory,
        adminId: session.admin.id,
      })
    ))
    const taxonomyByKey = await resolveQuestionTaxonomyMap(prisma, questionDrafts)

    // Menyimpan insert soal dan log upload dalam transaksi singkat agar tidak melewati batas timeout Prisma.
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const questionDataToInsert = []

      for (const draft of questionDrafts) {
        const taxonomy = getResolvedQuestionTaxonomy(taxonomyByKey, draft)
        questionDataToInsert.push(toQuestionCreateInput(draft, taxonomy))
      }

      await tx.question.createMany({
        data: questionDataToInsert,
        skipDuplicates: true // Untuk berjaga-jaga menghindari duplikasi
      })
      
      // Catat log proses unggah (opsional namun disarankan jika tabel BulkUploadJob tersedia)
      await tx.bulkUploadJob.create({
        data: {
          admin_id: session.admin.id,
          file_name: `Excel Import - ${packageCode}`,
          package_code: packageCode,
          status: BulkUploadStatus.DONE,
          total_count: questionDrafts.length,
          success_count: questionDrafts.length,
          completed_at: new Date()
        }
      })
    })

    return NextResponse.json({ 
      success: true, 
      message: `${questionDrafts.length} soal berhasil di-import ke paket ${packageCode}` 
    })

  } catch (error: unknown) {
    console.error('Import Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server saat import.' }, { status: 500 })
  }
}
