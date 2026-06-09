import { prisma } from '@/server/db'

// Data seed default untuk taksonomi CPNS sesuai cetak biru.
const SEED_DATA = [
  {
    code: 'TWK',
    name: 'Tes Wawasan Kebangsaan',
    order: 1,
    materials: [
      { name: 'Nasionalisme', order: 1 },
      { name: 'Integritas', order: 2 },
      { name: 'Bela Negara', order: 3 },
      { name: 'Pilar Negara', order: 4 },
      { name: 'Bahasa Negara', order: 5 },
    ]
  },
  {
    code: 'TIU',
    name: 'Tes Intelegensia Umum',
    order: 2,
    materials: [
      {
        name: 'Kemampuan Verbal',
        order: 1,
        subMaterials: [
          { name: 'Analogi', order: 1 },
          { name: 'Silogisme', order: 2 },
          { name: 'Analitis', order: 3 },
        ]
      },
      {
        name: 'Kemampuan Numerik',
        order: 2,
        subMaterials: [
          { name: 'Berhitung Cepat', order: 1 },
          { name: 'Deret Angka', order: 2 },
          { name: 'Perbandingan Kuantitatif', order: 3 },
          { name: 'Soal Cerita', order: 4 },
        ]
      },
      {
        name: 'Kemampuan Figural',
        order: 3,
        subMaterials: [
          { name: 'Analogi Gambar', order: 1 },
          { name: 'Ketidaksamaan', order: 2 },
          { name: 'Serial Gambar', order: 3 },
        ]
      }
    ]
  },
  {
    code: 'TKP',
    name: 'Tes Karakteristik Pribadi',
    order: 3,
    materials: [
      { name: 'Pelayanan Publik', order: 1 },
      { name: 'Jejaring Kerja', order: 2 },
      { name: 'Sosial Budaya', order: 3 },
      { name: 'Teknologi Informasi & Komunikasi', order: 4 },
      { name: 'Profesionalisme & Anti-Radikalisme', order: 5 },
    ]
  }
]

export class AdminQuestionTaxonomyService {
  /**
   * Mengambil hierarki penuh taksonomi (Subtes -> Materi -> Sub-Materi).
   * Relasi ini dijamin diurutkan berdasarkan field "order".
   */
  static async getTaxonomyTree() {
    return prisma.questionSubtest.findMany({
      include: {
        materials: {
          include: {
            sub_materials: {
              orderBy: { order: 'asc' }
            }
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })
  }

  /**
   * Menjalankan proses seeder secara idempotent.
   * Hanya membuat entitas (subtes/materi) yang belum ada agar data yang
   * sudah di-edit admin tidak ter-overwrite/hilang.
   */
  static async seedDefaultTaxonomy() {
    for (const subtest of SEED_DATA) {
      // 1. Pastikan Subtest ada
      const createdSubtest = await prisma.questionSubtest.upsert({
        where: { code: subtest.code },
        update: {}, // Jangan timpa perubahan nama/deskripsi admin
        create: {
          code: subtest.code,
          name: subtest.name,
          order: subtest.order,
        }
      })

      // 2. Pastikan Materi ada
      for (const material of subtest.materials) {
        let currentMaterial = await prisma.questionMaterial.findFirst({
          where: { subtest_id: createdSubtest.id, name: material.name }
        })

        if (!currentMaterial) {
          currentMaterial = await prisma.questionMaterial.create({
            data: {
              subtest_id: createdSubtest.id,
              name: material.name,
              order: material.order,
            }
          })
        }

        // 3. Pastikan Sub-Materi ada (bila didefinisikan)
        if ('subMaterials' in material && material.subMaterials) {
          for (const subMaterial of material.subMaterials) {
            const currentSub = await prisma.questionSubMaterial.findFirst({
              where: { material_id: currentMaterial.id, name: subMaterial.name }
            })

            if (!currentSub) {
              await prisma.questionSubMaterial.create({
                data: {
                  material_id: currentMaterial.id,
                  name: subMaterial.name,
                  order: subMaterial.order,
                }
              })
            }
          }
        }
      }
    }

    return { success: true, message: 'Taxonomy seed completed idempotently.' }
  }
}
