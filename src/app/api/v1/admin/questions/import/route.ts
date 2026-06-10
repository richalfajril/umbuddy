import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'
import { getCachedUserSession } from '@/server/auth/session'
import { QuestionCategory, QuestionStatus, Prisma, UserRole, BulkUploadStatus } from '@prisma/client'

export async function POST(req: Request) {
  try {
    const session = await getCachedUserSession()
    
    // Auth validation
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Pastikan user memiliki role ADMIN / SUPER_ADMIN
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    })
    
    if (!user || user.role !== UserRole.ADMIN) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
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

    // Mapping excel rows to Question objects
    const questionDataToInsert = questions.map((q: Record<string, unknown>, index: number) => {
      // Tentukan kategori soal
      let category: QuestionCategory = globalCategory === 'CAMPURAN' 
        ? (q['Subtes (TWK, TIU, TKP)'] || 'TWK') as QuestionCategory
        : globalCategory as QuestionCategory

      // Pastikan kategori valid
      if (!['TWK', 'TIU', 'TKP'].includes(category)) {
        category = 'TWK' // Default fallback
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
        // Parsing "A:5, B:4, C:3, D:2, E:1"
        tkp_weights = {} as Record<string, number>
        const parts = rawBobot.split(',')
        parts.forEach(part => {
          const [key, val] = part.split(':').map(s => s.trim())
          if (key && val && !isNaN(Number(val)) && tkp_weights) {
            tkp_weights[key.toUpperCase()] = Number(val)
          }
        })
        
        // TKP biasanya tidak punya answer_key absolute, tapi kita bisa set null
      } else {
        // TWK / TIU
        answer_key = rawBobot.toUpperCase()
      }

      // Gambar
      const image_urls: string[] = []
      if (q['Gambar']) {
        image_urls.push(String(q['Gambar']))
      }

      return {
        category,
        package_code: packageCode,
        number: Number(q['No'] || index + 1),
        text: String(q['Soal'] || ''),
        options: options as Prisma.InputJsonValue,
        answer_key,
        tkp_weights: tkp_weights ? (tkp_weights as Prisma.InputJsonValue) : Prisma.JsonNull,
        explanation: String(q['Pembahasan'] || ''),
        difficulty: 'MEDIUM', // Default
        status: QuestionStatus.PUBLISHED,
        image_urls,
        created_by: session.user.id,
        updated_by: session.user.id,
      }
    })

    // Insert to database inside a transaction to ensure all or nothing
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.question.createMany({
        data: questionDataToInsert,
        skipDuplicates: true // Just in case
      })
      
      // Catat log upload (optional tapi direkomendasikan jika kita punya BulkUploadJob table)
      await tx.bulkUploadJob.create({
        data: {
          admin_id: session.user.id,
          file_name: `Excel Import - ${packageCode}`,
          package_code: packageCode,
          status: BulkUploadStatus.DONE,
          total_count: questionDataToInsert.length,
          success_count: questionDataToInsert.length,
          completed_at: new Date()
        }
      })
    })

    return NextResponse.json({ 
      success: true, 
      message: `${questionDataToInsert.length} soal berhasil di-import ke paket ${packageCode}` 
    })

  } catch (error: unknown) {
    console.error('Import Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server saat import.' }, { status: 500 })
  }
}
