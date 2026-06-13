import Link from 'next/link'
import { ArrowLeft, BookOpenCheck, CheckCircle2, ImageIcon } from 'lucide-react'
import { AdminPageHeader } from '@/components/organisms'
import { Button } from '@/components/ui'
import { QUESTION_STATUS_COLORS } from '../_constants/admin-question-bank.constants'
import type { AdminQuestion } from '../_types/admin-question-bank.types'

type AdminQuestionDetailViewProps = {
  question: AdminQuestion
}

// Halaman detail soal memperlihatkan preview yang mendekati tampilan latihan pengguna.
export function AdminQuestionDetailView({ question }: AdminQuestionDetailViewProps) {
  const optionEntries = Object.entries(question.options).filter(([, value]) => Boolean(value))
  const correctAnswer = question.category === 'TKP'
    ? getHighestTkpOption(question.tkp_weights ? { ...question.tkp_weights } : null)
    : question.answer_key

  return (
    <section className="px-4 py-6 text-headline sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <AdminPageHeader
          icon={
            <Link
              href="/admin/question-bank"
              className="grid h-full w-full place-items-center text-muted transition-colors hover:text-headline"
              prefetch
              transitionTypes={['app-nav']}
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          }
          eyebrow="Question Preview"
          title={<>Detail <span className="text-primary">Soal</span></>}
          description="Lihat metadata dan pratinjau soal seperti yang akan dibaca pengguna."
          actions={
            <span className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-black tracking-wider ${QUESTION_STATUS_COLORS[question.status] || ''}`}>
              {question.status}
            </span>
          }
        />

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="rounded-3xl border border-border bg-background p-5 shadow-sm sm:p-7 dark:bg-surface">
            <div className="flex flex-wrap items-center gap-3 border-b border-border pb-5">
              <span className="inline-flex rounded-xl bg-primary/10 px-3 py-1 text-xs font-black text-primary">
                {question.category}
              </span>
              <p className="text-sm font-semibold text-muted">
                Soal <span className="font-black text-headline">{question.number}</span> dari paket{' '}
                <span className="font-black text-headline">{question.package_code}</span>
              </p>
            </div>

            <div className="space-y-5 pt-6">
              <div className="rounded-2xl border-l-4 border-primary bg-surface/70 p-5 dark:bg-background/40">
                <p className="whitespace-pre-line text-base font-normal leading-7 text-headline">
                  {question.text || 'Pertanyaan belum diisi.'}
                </p>
              </div>

              {question.image_urls && question.image_urls.length > 0 && (
                <div className="rounded-2xl border border-border bg-surface/50 p-4 dark:bg-background/30">
                  <div className="mb-3 flex items-center gap-2 text-sm font-black text-headline">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Gambar Pendukung
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {question.image_urls.map((imageUrl) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        key={imageUrl}
                        src={imageUrl}
                        alt="Gambar pendukung soal"
                        className="max-h-72 w-full rounded-xl border border-border object-contain"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {optionEntries.map(([optionKey, optionValue]) => {
                  const isCorrect = optionKey === correctAnswer

                  return (
                    <div
                      key={optionKey}
                      className={`flex min-h-14 items-center gap-4 rounded-2xl border px-4 py-3 text-left transition-colors ${
                        isCorrect
                          ? 'border-primary bg-primary/10 text-headline'
                          : 'border-border bg-background text-body dark:bg-surface'
                      }`}
                    >
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-sm font-black ${
                        isCorrect ? 'bg-primary text-white' : 'bg-surface text-headline dark:bg-background'
                      }`}>
                        {optionKey}
                      </span>
                      <span className="grid gap-2 text-base font-normal leading-6">
                        {optionValue?.text && <span>{optionValue.text}</span>}
                        {optionValue?.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={optionValue.image_url}
                            alt={`Gambar pilihan ${optionKey}`}
                            className="max-h-40 rounded-xl border border-border object-contain"
                          />
                        )}
                      </span>
                      {isCorrect && (
                        <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-primary" />
                      )}
                    </div>
                  )
                })}
              </div>

              <div className="rounded-2xl border border-border bg-surface/60 p-5 dark:bg-background/30">
                <div className="mb-2 flex items-center gap-2 text-sm font-black text-headline">
                  <BookOpenCheck className="h-4 w-4 text-primary" />
                  Pembahasan
                </div>
                <p className="whitespace-pre-line text-sm font-medium leading-6 text-body">
                  {question.explanation || 'Pembahasan belum tersedia.'}
                </p>
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
              <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Metadata</p>
              <dl className="mt-4 space-y-3 text-sm">
                <MetaRow label="Paket" value={question.package_code} />
                <MetaRow label="Kategori" value={question.category} />
                <MetaRow label="Materi" value={question.material_name ?? '-'} />
                <MetaRow label="Sub-Materi" value={question.sub_material_name ?? '-'} />
                <MetaRow label="Difficulty" value={question.difficulty ?? '-'} />
                <MetaRow label="Dibuat" value={formatDate(question.created_at)} />
                <MetaRow label="Diubah" value={formatDate(question.updated_at)} />
              </dl>
            </div>

            {question.category === 'TKP' && question.tkp_weights && (
              <div className="rounded-3xl border border-border bg-background p-5 shadow-sm dark:bg-surface">
                <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Bobot TKP</p>
                <div className="mt-4 grid grid-cols-5 gap-2">
                  {Object.entries(question.tkp_weights).map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-border bg-surface p-3 text-center dark:bg-background">
                      <p className="text-xs font-black text-muted">{key}</p>
                      <p className="text-lg font-black text-headline">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Link href="/admin/question-bank" prefetch transitionTypes={['app-nav']}>
              <Button variant="secondary" className="w-full">
                Kembali ke Bank Soal
              </Button>
            </Link>
          </aside>
        </div>
      </div>
    </section>
  )
}

function MetaRow({ label, value }: { label: string; value: string }) {
  // Baris metadata dibuat ringkas agar informasi admin mudah dipindai.
  return (
    <div className="flex items-start justify-between gap-4 border-b border-border pb-3 last:border-0 last:pb-0">
      <dt className="font-bold text-muted">{label}</dt>
      <dd className="text-right font-black text-headline">{value}</dd>
    </div>
  )
}

function formatDate(value: string) {
  // Format tanggal admin memakai locale Indonesia agar konsisten dengan tabel backoffice.
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getHighestTkpOption(weights?: Record<string, number> | null) {
  // Preview TKP menandai opsi berbobot tertinggi sebagai jawaban terbaik.
  if (!weights) return null

  return Object.entries(weights).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}
