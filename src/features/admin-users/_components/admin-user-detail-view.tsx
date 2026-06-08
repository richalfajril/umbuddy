'use client'

import * as React from 'react'
import Link from 'next/link'
import { ArrowLeft, User, Mail, Activity, CheckCircle2, ShieldAlert, AlertCircle } from 'lucide-react'
import type { AdminUserDetail, AdminUserSupportNote } from '../_types/admin-users.types'
import { AdminUserSupportNoteForm } from './admin-user-support-note-form'
import { AdminUserVerificationActions } from './admin-user-verification-actions'
import { AdminUserSecurityActions } from './admin-user-security-actions'

interface AdminUserDetailViewProps {
  user: AdminUserDetail
}

export function AdminUserDetailView({
  user,
}: AdminUserDetailViewProps) {
  // Parsing progression/profile aman
  const targetInstansi = user.profile?.target_instansi || 'Belum diatur'
  const currentXp = user.progression?.total_xp || 0
  const level = user.progression?.level || 1
  
  const [supportNotes, setSupportNotes] = React.useState(user.support_notes || [])
  const activityLogs = user.activity_logs || []

  // Local optimistic state for manual verification and status
  const [emailVerified, setEmailVerified] = React.useState(user.email_verified)
  const [currentStatus, setCurrentStatus] = React.useState(user.status)

  const handleNoteAdded = (newNote: AdminUserSupportNote) => {
    setSupportNotes((prev) => [newNote, ...prev])
  }

  const handleEmailVerified = (newStatus: string, newNote: AdminUserSupportNote | null) => {
    setEmailVerified(true)
    setCurrentStatus(newStatus)
    if (newNote) {
      setSupportNotes((prev) => [newNote, ...prev])
    }
  }

  return (
    <section className="min-h-screen bg-background px-4 py-6 text-headline sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-2xl border border-border bg-background p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between dark:bg-surface">
          <div>
            <Link href="/admin/users" className="inline-flex min-h-[44px] items-center gap-2 text-sm font-black text-primary hover:underline">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Kembali ke Direktori
            </Link>
            <h1 className="mt-4 text-2xl font-black text-headline">
              Detail <span className="text-primary">Profil Pengguna</span>
            </h1>
          </div>
          <div className="flex flex-col items-end">
            <StatusBadge status={currentStatus} />
            <p className="mt-2 text-xs font-semibold text-muted">User ID: {user.id}</p>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Kartu Profil Utama */}
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm dark:bg-surface">
              <div className="flex items-center gap-4 border-b border-border pb-4">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="font-display text-xl font-black">{user.name}</h2>
                  <span className="mt-1 inline-block rounded-md bg-surface px-2 py-1 text-xs font-bold text-muted border border-border">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-2">
                    <Mail className="h-3 w-3" /> Email
                  </p>
                  <p className="mt-1 font-semibold text-headline flex flex-wrap items-center gap-2">
                    {user.email}
                    {emailVerified ? (
                      <span className="inline-flex items-center gap-1 rounded bg-green-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-green-500">
                        Terverifikasi
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-orange-500/10 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-orange-500">
                        Belum Terverifikasi
                      </span>
                    )}
                  </p>
                  {!emailVerified && (
                    <AdminUserVerificationActions
                      userId={user.id}
                      isEmailVerified={emailVerified}
                      onVerified={handleEmailVerified}
                    />
                  )}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Target Instansi</p>
                  <p className="mt-1 font-semibold text-headline">{targetInstansi}</p>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">Bergabung Sejak</p>
                  <p className="mt-1 font-semibold text-headline">
                    {new Date(user.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Kartu Progres Gamifikasi */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm dark:bg-surface">
              <h3 className="font-display text-lg font-black text-headline flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Metrik Gamifikasi
              </h3>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-surface p-4 border border-border">
                  <p className="text-xs font-bold text-muted">Total XP</p>
                  <p className="mt-1 font-display text-2xl font-black text-primary">{currentXp}</p>
                </div>
                <div className="rounded-xl bg-surface p-4 border border-border">
                  <p className="text-xs font-bold text-muted">Level</p>
                  <p className="mt-1 font-display text-2xl font-black text-headline">{level}</p>
                </div>
              </div>
            </div>
            
            {/* Area Keamanan & Tindakan Paksa */}
            <AdminUserSecurityActions userId={user.id} onActionSuccess={handleNoteAdded} />
          </div>

          {/* Area Log dan Catatan Admin */}
          <div className="md:col-span-2 space-y-6">
            {/* Support Notes / Catatan Admin */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm dark:bg-surface">
              <h3 className="font-display text-lg font-black text-headline mb-4">
                Catatan Moderasi & Audit Log
              </h3>
              
              <AdminUserSupportNoteForm userId={user.id} onNoteAdded={handleNoteAdded} />

              {supportNotes.length === 0 ? (
                <p className="text-sm font-semibold text-muted italic p-4 bg-surface rounded-xl border border-border text-center">
                  Belum ada catatan moderasi untuk pengguna ini.
                </p>
              ) : (
                <div className="space-y-3">
                  {supportNotes.map((note) => (
                    <div key={note.id} className="rounded-xl border border-border bg-surface p-4">
                      <div className="flex justify-between items-start">
                        <span className="inline-block rounded bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">
                          {note.category || 'NOTE'}
                        </span>
                        <span className="text-xs font-semibold text-muted">
                          {new Date(note.created_at).toLocaleString('id-ID')}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-headline leading-relaxed">
                        {note.note}
                      </p>
                      <p className="mt-2 text-xs font-bold text-muted">
                        Admin ID: {note.admin_id}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recent Activity Logs */}
            <div className="rounded-2xl border border-border bg-background p-6 shadow-sm dark:bg-surface">
              <h3 className="font-display text-lg font-black text-headline mb-4">
                10 Aktivitas Terakhir
              </h3>
              
              {activityLogs.length === 0 ? (
                <p className="text-sm font-semibold text-muted italic p-4 bg-surface rounded-xl border border-border text-center">
                  Belum ada rekaman aktivitas sistem.
                </p>
              ) : (
                <div className="space-y-0">
                  {activityLogs.map((log, i: number) => (
                    <div key={log.id} className={`flex items-start gap-4 py-3 ${i !== activityLogs.length - 1 ? 'border-b border-border' : ''}`}>
                      <div className="mt-0.5 grid h-2 w-2 shrink-0 place-items-center rounded-full bg-primary/50 ring-4 ring-primary/10" />
                      <div>
                        <p className="text-sm font-bold text-headline">{log.type}</p>
                        {log.description && (
                          <p className="mt-0.5 text-xs font-semibold text-muted">{log.description}</p>
                        )}
                        <p className="mt-1 text-xs font-bold text-muted opacity-70">
                          {new Date(log.created_at).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'ACTIVE') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-bold text-primary">
        <CheckCircle2 className="h-4 w-4" /> Active Account
      </span>
    )
  }
  
  if (status === 'SUSPENDED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-sm font-bold text-orange-500">
        <ShieldAlert className="h-4 w-4" /> Suspended Account
      </span>
    )
  }

  if (status === 'BANNED') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-sm font-bold text-red-500">
        <AlertCircle className="h-4 w-4" /> Banned Account
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-bold text-muted">
      Pending Verification
    </span>
  )
}
