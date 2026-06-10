import type { AdminQuestionFormState, AdminQuestionStatus } from '../_types/admin-questions.types'

// Membaca pesan error API tanpa mengekspos struktur internal ke UI.
export async function readAdminQuestionApiError(response: Response) {
  try {
    const data = (await response.json()) as { error?: { message?: string } }
    return data.error?.message ?? 'Aksi soal belum berhasil.'
  } catch {
    return 'Aksi soal belum berhasil.'
  }
}

// Membentuk payload API create question dari form backoffice.
export function buildAdminQuestionPayload(form: AdminQuestionFormState) {
  const options = {
    A: { text: form.option_a },
    B: { text: form.option_b },
    C: { text: form.option_c },
    D: { text: form.option_d },
    ...(form.option_e.trim() ? { E: { text: form.option_e } } : {}),
  }

  return {
    category: form.category,
    package_code: form.package_code,
    number: Number(form.number),
    text: form.text,
    options,
    answer_key: form.category === 'TKP' ? null : form.answer_key,
    tkp_weights: form.category === 'TKP'
      ? {
          A: Number(form.tkp_a),
          B: Number(form.tkp_b),
          C: Number(form.tkp_c),
          D: Number(form.tkp_d),
          ...(form.option_e.trim() ? { E: Number(form.tkp_e) } : {}),
        }
      : null,
    explanation: form.explanation,
    difficulty: form.difficulty || null,
  }
}

// Mengembalikan class badge status agar tabel cepat dipindai admin.
export function getQuestionStatusClass(status: AdminQuestionStatus) {
  const classes: Record<AdminQuestionStatus, string> = {
    DRAFT: 'border-xp/30 bg-xp/10 text-xp-dark dark:text-xp',
    PUBLISHED: 'border-primary/30 bg-primary/10 text-primary-dark dark:text-primary',
    ARCHIVED: 'border-muted/30 bg-muted/10 text-muted',
    FLAGGED: 'border-error/30 bg-error/10 text-error',
  }

  return classes[status]
}

