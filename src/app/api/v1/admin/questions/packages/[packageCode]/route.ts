import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'
import { AdminAuthService } from '@/server/admin-auth'
import { parseTkpWeightMap } from '@/server/admin-questions'
import { BulkUploadStatus, Prisma, QuestionCategory, QuestionStatus } from '@prisma/client'

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ packageCode: string }> }
) {
  try {
    const session = await AdminAuthService.getCurrentAdmin()
    
    // Validasi Autentikasi Admin
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const packageCode = resolvedParams.packageCode

    if (!packageCode) {
      return NextResponse.json({ error: 'Package code is required' }, { status: 400 })
    }

    // Melakukan hard-delete seluruh soal yang memiliki package_code tersebut
    // Hal ini karena di tahap ini (V1) PRD menyebutkan package/soal dihapus langsung.
    // Jika soal sudah dipakai ujian, ini bisa menjadi masalah integritas, tapi untuk MVP 
    // jika kita belum ada constraint, hapus semua question dengan packageCode tersebut.
    const deleted = await prisma.question.deleteMany({
      where: { package_code: packageCode }
    })

    if (deleted.count === 0) {
      return NextResponse.json({ error: 'Subtes tidak ditemukan atau sudah dihapus' }, { status: 404 })
    }

    return NextResponse.json({ 
      success: true, 
      message: `Berhasil menghapus ${deleted.count} soal dari subtes ${packageCode}` 
    })

  } catch (error) {
    console.error('Delete Package API Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat menghapus data.' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ packageCode: string }> }
) {
  try {
    const session = await AdminAuthService.getCurrentAdmin()

    // Guard admin memastikan hanya backoffice yang bisa mengubah paket soal.
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const resolvedParams = await params
    const currentPackageCode = decodeURIComponent(resolvedParams.packageCode)
    const body = await request.json()
    const nextPackageCode = typeof body.packageCode === 'string' ? body.packageCode.trim() : ''
    const globalCategory = typeof body.category === 'string' ? body.category : 'CAMPURAN'
    const questions = Array.isArray(body.questions) ? body.questions as Record<string, unknown>[] : null

    if (!currentPackageCode || !nextPackageCode) {
      return NextResponse.json({ error: 'Nama subtes wajib diisi.' }, { status: 400 })
    }

    const existingCount = await prisma.question.count({
      where: { package_code: currentPackageCode },
    })

    if (existingCount === 0) {
      return NextResponse.json({ error: 'Subtes tidak ditemukan.' }, { status: 404 })
    }

    if (currentPackageCode !== nextPackageCode) {
      const duplicatePackage = await prisma.question.findFirst({
        where: { package_code: nextPackageCode },
        select: { id: true },
      })

      if (duplicatePackage) {
        return NextResponse.json({
          error: `Subtes dengan nama '${nextPackageCode}' sudah ada. Silakan gunakan nama lain.`,
        }, { status: 400 })
      }
    }

    if (questions && questions.length === 0) {
      return NextResponse.json({ error: 'File Excel harus berisi minimal 1 soal.' }, { status: 400 })
    }

    // Jika Excel baru dikirim, isi paket diganti total agar nomor dan kategori tetap sinkron.
    if (questions) {
      const questionDataToInsert = questions.map((q, index) => {
        let category: QuestionCategory = globalCategory === 'CAMPURAN'
          ? (q['Subtes (TWK, TIU, TKP)'] || 'TWK') as QuestionCategory
          : globalCategory as QuestionCategory

        if (!['TWK', 'TIU', 'TKP'].includes(category)) {
          category = 'TWK'
        }

        const options = {
          A: String(q['A'] || ''),
          B: String(q['B'] || ''),
          C: String(q['C'] || ''),
          D: String(q['D'] || ''),
          E: String(q['E'] || ''),
        }

        let tkp_weights: Record<string, number> | null = null
        let answer_key: string | null = null
        const rawBobot = String(q['Kunci/Bobot (bobot 1-5)'] || '').trim()

        if (category === 'TKP') {
          // Memparsing format bobot TKP dari Excel, baik "A=5" maupun "A:5".
          tkp_weights = parseTkpWeightMap(rawBobot)
        } else {
          answer_key = rawBobot.toUpperCase()
        }

        const image_urls: string[] = []
        if (q['Gambar']) {
          image_urls.push(String(q['Gambar']))
        }

        return {
          category,
          package_code: nextPackageCode,
          number: Number(q['No'] || index + 1),
          text: String(q['Soal'] || ''),
          options: options as Prisma.InputJsonValue,
          answer_key,
          tkp_weights: tkp_weights ? (tkp_weights as Prisma.InputJsonValue) : Prisma.JsonNull,
          explanation: String(q['Pembahasan'] || ''),
          difficulty: 'MEDIUM',
          status: QuestionStatus.PUBLISHED,
          image_urls,
          created_by: session.admin.id,
          updated_by: session.admin.id,
        }
      })

      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.question.deleteMany({
          where: { package_code: currentPackageCode },
        })

        await tx.question.createMany({
          data: questionDataToInsert,
          skipDuplicates: true,
        })

        await tx.bulkUploadJob.create({
          data: {
            admin_id: session.admin.id,
            file_name: `Excel Reimport - ${nextPackageCode}`,
            package_code: nextPackageCode,
            status: BulkUploadStatus.DONE,
            total_count: questionDataToInsert.length,
            success_count: questionDataToInsert.length,
            completed_at: new Date(),
          },
        })
      })

      return NextResponse.json({
        success: true,
        message: `${questionDataToInsert.length} soal berhasil diperbarui di paket ${nextPackageCode}.`,
      })
    }

    // Tanpa Excel baru, edit hanya mengganti package_code dan kategori global jika bukan CAMPURAN.
    await prisma.question.updateMany({
      where: { package_code: currentPackageCode },
      data: {
        package_code: nextPackageCode,
        ...(globalCategory !== 'CAMPURAN' && ['TWK', 'TIU', 'TKP'].includes(globalCategory)
          ? { category: globalCategory as QuestionCategory }
          : {}),
        updated_by: session.admin.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: `Subtes ${currentPackageCode} berhasil diperbarui menjadi ${nextPackageCode}.`,
    })
  } catch (error) {
    console.error('Update Package API Error:', error)
    return NextResponse.json(
      { error: 'Terjadi kesalahan pada server saat memperbarui data.' },
      { status: 500 }
    )
  }
}
