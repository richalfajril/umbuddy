import Link from 'next/link'
import Image from 'next/image'
import { Mail, Heart } from 'lucide-react'

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface/50 border-t border-border/80 pt-16 pb-8 relative overflow-hidden">
      
      {/* Decorative subtle background gradient blob */}
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
          
          {/* Brand & Contact Column (Wide) */}
          <div className="lg:col-span-2 space-y-6">
            <Image 
              src="/logo/logo_horizontal.png" 
              alt="Umbuddy Logo" 
              width={220} 
              height={58} 
              className="h-14 w-auto object-contain dark:brightness-115"
            />
            <p className="text-body text-sm leading-relaxed max-w-sm">
              Platform persiapan CPNS revolusioner yang menggabungkan keseruan bermain game RPG dengan akurasi simulasi CAT BKN asli. Dari Cambies, oleh Cambies, untuk Cambies.
            </p>
            
            {/* Contact Support details */}
            <div className="space-y-2 text-sm text-body">
              <p className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-primary" />
                <span>Support Email: <a href="mailto:halo@umbuddy.com" className="font-bold hover:text-primary transition-colors">halo@umbuddy.com</a></span>
              </p>
            </div>

            {/* Social media icons via robust inline SVGs */}
            <div className="flex items-center gap-3">
              <Link 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-xl bg-background border border-border hover:border-primary/50 hover:bg-primary-light/30 hover:text-primary dark:hover:bg-primary/10 transition-all text-body group" 
                aria-label="Instagram"
              >
                <svg className="w-5 h-5 group-hover:scale-105 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </Link>
              <Link 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2.5 rounded-xl bg-background border border-border hover:border-primary/50 hover:bg-primary-light/30 hover:text-primary dark:hover:bg-primary/10 transition-all text-body group" 
                aria-label="TikTok"
              >
                <svg className="w-5 h-5 group-hover:scale-105 transition-transform" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.76 4.08 1.4 1.31 3.39 1.88 5.23 2.04v3.52c-1.87-.02-3.72-.56-5.26-1.64-.17-.12-.32-.26-.47-.4v8.36c.01 4.38-3.26 8.03-7.61 8.04-4.59.13-8.52-3.51-8.51-8.1.01-4.53 3.73-8.15 8.24-8.15 1.15-.01 2.3.23 3.36.71v3.7c-.82-.44-1.74-.67-2.68-.66-2.58-.02-4.78 2.01-4.83 4.59-.07 2.82 2.18 5.17 5 5.11 2.51-.05 4.55-2.01 4.57-4.52V.02z" />
                </svg>
              </Link>
              <Link 
                href="mailto:halo@umbuddy.com" 
                className="p-2.5 rounded-xl bg-background border border-border hover:border-primary/50 hover:bg-primary-light/30 hover:text-primary dark:hover:bg-primary/10 transition-all text-body group" 
                aria-label="Email Support"
              >
                <Mail className="w-5 h-5 group-hover:scale-105 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Column 1: Produk */}
          <div>
            <h4 className="font-black font-display text-headline mb-6 text-sm uppercase tracking-wider border-l-2 border-primary pl-2.5">
              Produk
            </h4>
            <ul className="space-y-4 text-sm font-semibold text-body">
              <li><Link href="#features" className="hover:text-primary transition-colors">Latihan Soal Harian</Link></li>
              <li><Link href="#analytics" className="hover:text-primary transition-colors">Simulasi CAT</Link></li>
              <li><Link href="#battle" className="hover:text-primary transition-colors">Battle Arena Mini CAT</Link></li>
              <li><Link href="#leaderboard" className="hover:text-primary transition-colors">Papan Peringkat</Link></li>
            </ul>
          </div>

          {/* Column 2: Komunitas */}
          <div>
            <h4 className="font-black font-display text-headline mb-6 text-sm uppercase tracking-wider border-l-2 border-primary pl-2.5">
              Komunitas
            </h4>
            <ul className="space-y-4 text-sm font-semibold text-body">
              <li><Link href="#features" className="hover:text-primary transition-colors">Sumbang Soal</Link></li>
              <li><Link href="https://saweria.co" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Donasi Saweria</Link></li>
              <li><Link href="#testimonials" className="hover:text-primary transition-colors">Cerita Umbies</Link></li>
              <li><Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-black font-display text-headline mb-6 text-sm uppercase tracking-wider border-l-2 border-primary pl-2.5">
              Legal
            </h4>
            <ul className="space-y-4 text-sm font-semibold text-body">
              <li><Link href="#faq" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#faq" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="mailto:halo@umbuddy.com" className="hover:text-primary transition-colors">Lapor Bug</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-body font-medium">
          <p>© {currentYear} Umbuddy. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1.5">
            Dibuat dengan <Heart className="w-3.5 h-3.5 text-error fill-error animate-pulse" /> untuk Indonesia ASN Juara
          </div>
        </div>

      </div>
    </footer>
  )
}
