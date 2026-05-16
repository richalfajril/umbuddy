import Link from 'next/link'
import Image from 'next/image'
import { Globe, Code, Mail, Heart } from 'lucide-react'

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background dark:bg-dark-background border-t border-border dark:border-dark-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Col */}
          <div className="md:col-span-1 space-y-6">
            <Image 
              src="/logo/logo_horizontal.png" 
              alt="Umbuddy Logo" 
              width={160} 
              height={40} 
              className="h-10 w-auto"
            />
            <p className="text-body text-sm leading-relaxed">
              Platform persiapan CPNS revolusioner yang menggabungkan keseruan bermain dengan akurasi simulasi CAT. 100% Gratis, oleh Umbies untuk Umbies.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://instagram.com" className="p-2 rounded-lg bg-surface dark:bg-dark-surface hover:text-primary transition-colors">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="https://github.com" className="p-2 rounded-lg bg-surface dark:bg-dark-surface hover:text-primary transition-colors">
                <Code className="w-5 h-5" />
              </Link>
              <Link href="mailto:halo@umbuddy.com" className="p-2 rounded-lg bg-surface dark:bg-dark-surface hover:text-primary transition-colors">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-black font-display text-slate-800 dark:text-slate-100 mb-6 uppercase tracking-wider text-xs">Produk</h4>
            <ul className="space-y-4 text-sm text-body">
              <li><Link href="/practice" className="hover:text-primary transition-colors">Latihan Soal</Link></li>
              <li><Link href="/cat-simulation" className="hover:text-primary transition-colors">Simulasi CAT</Link></li>
              <li><Link href="/battle" className="hover:text-primary transition-colors">Battle Arena</Link></li>
              <li><Link href="/leaderboard" className="hover:text-primary transition-colors">Papan Peringkat</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-black font-display text-slate-800 dark:text-slate-100 mb-6 uppercase tracking-wider text-xs">Komunitas</h4>
            <ul className="space-y-4 text-sm text-body">
              <li><Link href="/donate-questions" className="hover:text-primary transition-colors">Sumbang Soal</Link></li>
              <li><Link href="https://saweria.co" className="hover:text-primary transition-colors">Donasi Saweria</Link></li>
              <li><Link href="/community" className="hover:text-primary transition-colors">Grup Telegram</Link></li>
              <li><Link href="/updates" className="hover:text-primary transition-colors">Update Versi</Link></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h4 className="font-black font-display text-slate-800 dark:text-slate-100 mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4 text-sm text-body">
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="/security" className="hover:text-primary transition-colors">Lapor Bug</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border dark:border-dark-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-body font-medium">
          <p>© {currentYear} Umbuddy. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 text-coral-red fill-coral-red" /> untuk Indonesia ASN Juara
          </div>
        </div>
      </div>
    </footer>
  )
}
