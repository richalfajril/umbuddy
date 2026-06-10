import { NextResponse } from 'next/server'
import { prisma } from '@/server/db/client'
import { AdminAuthService } from '@/server/admin-auth'

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
