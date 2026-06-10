import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'
import { AdminAuthService } from '@/server/admin-auth'

export async function GET() {
  try {
    const session = await AdminAuthService.getCurrentAdmin()
    
    // Validasi Autentikasi Admin
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Melakukan grouping berdasarkan package_code
    // Karena Prisma groupBy tidak mendukung pengambilan field selain yang di group secara dinamis dengan mudah,
    // Kita gunakan groupBy dan fetch data terpisah, atau raw query jika kompleks.
    
    const grouped = await prisma.question.groupBy({
      by: ['package_code'],
      _count: {
        id: true,
      },
      _min: {
        created_at: true,
      }
    })

    // Kita juga perlu tahu kategori dominan dari package_code tersebut
    // Karena groupBy by package_code, category bisa bervariasi jika CAMPURAN.
    // Kita ambil salah satu kategori pertama dari tiap package_code
    
    const packages = await Promise.all(grouped.map(async (g: { package_code: string; _count: { id: number }; _min: { created_at: Date | null } }) => {
      // Jika dalam 1 package ada berbagai category, kita bisa label 'CAMPURAN' 
      // Tapi untuk simplicity V1, kita pakai category dari sample (atau cek distinct).
      const distinctCategories = await prisma.question.findMany({
        where: { package_code: g.package_code },
        distinct: ['category'],
        select: { category: true }
      })

      const displayCategory = distinctCategories.length > 1 
        ? 'CAMPURAN' 
        : (distinctCategories[0]?.category || 'TWK')

      return {
        id: g.package_code, // Gunakan package_code sebagai ID unik tabel
        packageCode: g.package_code,
        category: displayCategory,
        totalQuestions: g._count.id,
        createdAt: g._min.created_at || new Date(),
        updatedAt: g._min.created_at || new Date(), // Sederhananya menggunakan created_at, atau Anda bisa query _max.updated_at
      }
    }))

    // Mengurutkan menurun berdasarkan tanggal dibuat (createdAt)
    packages.sort((a: { createdAt: Date }, b: { createdAt: Date }) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return NextResponse.json({ success: true, data: packages })

  } catch (error: unknown) {
    console.error('Fetch Packages Error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan pada server saat mengambil data paket.' }, { status: 500 })
  }
}
