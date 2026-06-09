import 'server-only'
import { prisma } from '@/server/db'
import type { Prisma } from '@prisma/client'
import type {
  AdminQuestionActor,
  AdminQuestionListInput,
  AdminQuestionMutationInput,
} from './admin-questions.types'
import { ADMIN_QUESTION_MAX_PAGE_SIZE } from './admin-questions.constants'
import {
  AdminQuestionError,
  isUniqueConstraintError,
  toAdminQuestionListItem,
  toInputJson,
} from './admin-questions.utils'
import { canManageQuestions } from '@/server/admin-auth'

// Service A2 untuk workflow soal admin tanpa mencampur logic ke route handler.
export class AdminQuestionService {
  // List soal memakai pagination ringan agar backoffice tidak menarik seluruh bank soal.
  static async listQuestions(actor: AdminQuestionActor, input: AdminQuestionListInput) {
    this.ensureCanRead(actor)
    const page = Math.max(1, input.page ?? 1)
    const pageSize = Math.max(1, Math.min(input.page_size ?? 20, ADMIN_QUESTION_MAX_PAGE_SIZE))
    const keyword = input.keyword?.trim()
    const where: Prisma.QuestionWhereInput = {
      deleted_at: null,
      ...(input.status ? { status: input.status } : {}),
      ...(input.category ? { category: input.category } : {}),
      ...(keyword ? {
        OR: [
          { text: { contains: keyword, mode: 'insensitive' } },
          { package_code: { contains: keyword, mode: 'insensitive' } },
        ],
      } : {}),
    }

    const [questions, total] = await prisma.$transaction([
      prisma.question.findMany({
        where,
        orderBy: [{ updated_at: 'desc' }, { package_code: 'asc' }, { number: 'asc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.question.count({ where }),
    ])

    return {
      questions: questions.map(toAdminQuestionListItem),
      page,
      page_size: pageSize,
      total,
    }
  }

  // Detail soal dipakai untuk preview/edit drawer admin.
  static async getQuestion(actor: AdminQuestionActor, questionId: string) {
    this.ensureCanRead(actor)
    const question = await prisma.question.findFirst({
      where: { id: questionId, deleted_at: null },
    })

    if (!question) {
      throw new AdminQuestionError('NOT_FOUND', 'Soal tidak ditemukan.', 404)
    }

    return toAdminQuestionListItem(question)
  }

  // Create selalu menyimpan sebagai draft agar admin bisa review sebelum publish.
  static async createQuestion(actor: AdminQuestionActor, input: AdminQuestionMutationInput) {
    this.ensureCanWrite(actor)

    try {
      const question = await prisma.question.create({
        data: {
          category: input.category,
          package_code: input.package_code,
          number: input.number,
          text: input.text,
          image_urls: input.image_urls ? toInputJson(input.image_urls) : undefined,
          options: toInputJson(input.options),
          answer_key: input.answer_key,
          tkp_weights: input.tkp_weights ? toInputJson(input.tkp_weights) : undefined,
          explanation: input.explanation,
          difficulty: input.difficulty,
          subtest_id: input.subtest_id,
          material_id: input.material_id,
          sub_material_id: input.sub_material_id,
          status: 'DRAFT',
          created_by: actor.id,
          updated_by: actor.id,
        },
      })

      await prisma.questionHistory.create({
        data: {
          question_id: question.id,
          admin_id: actor.id,
          change_type: 'CREATE_DRAFT',
          changes: toInputJson({ status: 'DRAFT' }),
        },
      })

      return toAdminQuestionListItem(question)
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AdminQuestionError('DUPLICATE_QUESTION', 'Kode paket dan nomor soal sudah dipakai.', 409)
      }
      throw error
    }
  }

  // Update hanya boleh untuk draft agar published questions tetap auditable.
  static async updateQuestion(actor: AdminQuestionActor, questionId: string, input: AdminQuestionMutationInput) {
    this.ensureCanWrite(actor)
    const existing = await prisma.question.findFirst({
      where: { id: questionId, deleted_at: null },
    })

    if (!existing) throw new AdminQuestionError('NOT_FOUND', 'Soal tidak ditemukan.', 404)
    if (existing.status !== 'DRAFT') {
      throw new AdminQuestionError('QUESTION_LOCKED', 'Soal published/archived tidak bisa diedit langsung.', 409)
    }

    try {
      const question = await prisma.$transaction(async (tx) => {
        const updated = await tx.question.update({
          where: { id: questionId },
          data: {
            category: input.category,
            package_code: input.package_code,
            number: input.number,
            text: input.text,
            image_urls: input.image_urls ? toInputJson(input.image_urls) : undefined,
            options: toInputJson(input.options),
            answer_key: input.answer_key,
            tkp_weights: input.tkp_weights ? toInputJson(input.tkp_weights) : undefined,
            explanation: input.explanation,
            difficulty: input.difficulty,
            subtest_id: input.subtest_id,
            material_id: input.material_id,
            sub_material_id: input.sub_material_id,
            updated_by: actor.id,
          },
        })

        await tx.questionHistory.create({
          data: {
            question_id: questionId,
            admin_id: actor.id,
            change_type: 'UPDATE_DRAFT',
            changes: toInputJson({
              before: toAdminQuestionListItem(existing),
              after: toAdminQuestionListItem(updated),
            }),
          },
        })

        return updated
      })

      return toAdminQuestionListItem(question)
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new AdminQuestionError('DUPLICATE_QUESTION', 'Kode paket dan nomor soal sudah dipakai.', 409)
      }
      throw error
    }
  }

  // Publish membuat soal visible ke user practice/simulation.
  static async publishQuestion(actor: AdminQuestionActor, questionId: string) {
    return this.transitionStatus(actor, questionId, 'PUBLISHED', ['DRAFT', 'FLAGGED'], 'PUBLISH')
  }

  // Archive adalah soft delete sesuai A2 agar attempt lama tetap aman.
  static async archiveQuestion(actor: AdminQuestionActor, questionId: string) {
    return this.transitionStatus(actor, questionId, 'ARCHIVED', ['DRAFT', 'PUBLISHED', 'FLAGGED'], 'ARCHIVE')
  }

  // Restore mengembalikan archived ke draft untuk review ulang sebelum publish.
  static async restoreQuestion(actor: AdminQuestionActor, questionId: string) {
    return this.transitionStatus(actor, questionId, 'DRAFT', ['ARCHIVED'], 'RESTORE')
  }

  // Guard baca: semua role admin aktif boleh melihat bank soal.
  private static ensureCanRead(actor: AdminQuestionActor) {
    if (!actor) throw new AdminQuestionError('UNAUTHORIZED', 'Sesi admin tidak valid.', 401)
  }

  // Guard tulis: support tidak boleh mengubah konten soal.
  private static ensureCanWrite(actor: AdminQuestionActor) {
    this.ensureCanRead(actor)
    if (!canManageQuestions(actor.role)) {
      throw new AdminQuestionError('FORBIDDEN', 'Role admin ini belum boleh mengubah soal.', 403)
    }
  }

  // Transisi status dibuat satu pintu agar workflow Draft/Published/Archived tidak menyimpang.
  private static async transitionStatus(
    actor: AdminQuestionActor,
    questionId: string,
    nextStatus: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED',
    allowedFrom: Array<'DRAFT' | 'PUBLISHED' | 'ARCHIVED' | 'FLAGGED'>,
    changeType: string
  ) {
    this.ensureCanWrite(actor)
    const existing = await prisma.question.findFirst({
      where: { id: questionId, deleted_at: null },
    })

    if (!existing) throw new AdminQuestionError('NOT_FOUND', 'Soal tidak ditemukan.', 404)
    if (!allowedFrom.includes(existing.status)) {
      throw new AdminQuestionError('INVALID_STATUS_TRANSITION', 'Status soal tidak bisa diubah dengan aksi ini.', 409)
    }

    const question = await prisma.$transaction(async (tx) => {
      const updated = await tx.question.update({
        where: { id: questionId },
        data: {
          status: nextStatus,
          updated_by: actor.id,
        },
      })

      await tx.questionHistory.create({
        data: {
          question_id: questionId,
          admin_id: actor.id,
          change_type: changeType,
          changes: toInputJson({ from: existing.status, to: nextStatus }),
        },
      })

      return updated
    })

    return toAdminQuestionListItem(question)
  }
}

