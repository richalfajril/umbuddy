import Link from 'next/link'
import Image from 'next/image'
import { Globe, Code, Mail, Heart } from 'lucide-react'

export function LandingFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-surface/40 border-t border-border/80 pt-16 pb-8">
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
              <Link href="https://instagram.com" className="p-2 rounded-lg bg-surface hover:text-primary transition-colors text-body">
                <Globe className="w-5 h-5" />
              </Link>
              <Link href="https://github.com" className="p-2 rounded-lg bg-surface hover:text-primary transition-colors text-body">
                <Code className="w-5 h-5" />
              </Link>
              <Link href="mailto:halo@umbuddy.com" className="p-2 rounded-lg bg-surface hover:text-primary transition-colors text-body">
                <Mail className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Links Col 1 */}
          <div>
            <h4 className="font-black font-display text-headline mb-6 uppercase tracking-wider text-xs">Produk</h4>
            <ul className="space-y-4 text-sm text-body">
              <li><Link href="#features" className="hover:text-primary transition-colors">Latihan Soal</Link></li>
              <li><Link href="#analytics" className="hover:text-primary transition-colors">Simulasi CAT</Link></li>
              <li><Link href="#battle" className="hover:text-primary transition-colors">Battle Arena</Link></li>
              <li><Link href="#leaderboard" className="hover:text-primary transition-colors">Papan Peringkat</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div>
            <h4 className="font-black font-display text-headline mb-6 uppercase tracking-wider text-xs">Komunitas</h4>
            <ul className="space-y-4 text-sm text-body">
              <li><Link href="#features" className="hover:text-primary transition-colors">Sumbang Soal</Link></li>
              <li><Link href="https://saweria.co" className="hover:text-primary transition-colors">Donasi Saweria</Link></li>
              <li><Link href="#testimonials" className="hover:text-primary transition-colors">Cerita Umbies</Link></li>
              <li><Link href="#faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Links Col 3 */}
          <div>
            <h4 className="font-black font-display text-headline mb-6 uppercase tracking-wider text-xs">Legal</h4>
            <ul className="space-y-4 text-sm text-body">
              <li><Link href="#faq" className="hover:text-primary transition-colors">Kebijakan Privasi</Link></li>
              <li><Link href="#faq" className="hover:text-primary transition-colors">Syarat & Ketentuan</Link></li>
              <li><Link href="mailto:halo@umbuddy.com" className="hover:text-primary transition-colors">Lapor Bug</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-body font-medium">
          <p>© {currentYear} Umbuddy. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1">
            Dibuat dengan <Heart className="w-3 h-3 text-error fill-error" /> untuk Indonesia ASN Juara
          </div>
        </div>
      </div>
    </footer>
  )
}
