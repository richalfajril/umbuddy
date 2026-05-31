import { redirect } from 'next/navigation'
import { AdminAuthService } from '@/server/admin-auth'
import { AdminLogoutButton } from '@/features/admin-auth/_components/admin-logout-button'

// Flow dashboard admin minimal untuk membuktikan guard session admin aktif.
export async function AdminDashboardFlow() {
  const session = await AdminAuthService.getCurrentAdmin()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <section className="mx-auto max-w-5xl rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl shadow-black/30">
        {/* Header dashboard admin menampilkan identitas dan role tanpa data sensitif. */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
              Umbuddy Backoffice
            </p>
            <h1 className="mt-2 font-display text-3xl font-black">
              Halo, <span className="text-primary">{session.admin.email}</span>
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Role aktif: {session.admin.role}
            </p>
          </div>
          <AdminLogoutButton />
        </div>

        {/* Placeholder eksplisit agar scope A1 tidak melebar ke dashboard admin penuh. */}
        <div className="mt-8 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm font-bold text-primary">
          Admin auth aktif. Modul admin dashboard, users, dan questions bisa dibangun setelah guard ini stabil.
        </div>
      </section>
    </main>
  )
}
