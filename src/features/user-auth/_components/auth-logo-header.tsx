import Image from 'next/image'
import Link from 'next/link'

// Header logo konsisten untuk halaman auth user.
export function AuthLogoHeader() {
  // Dua asset logo dipisah agar ukuran maskot dan wordmark bisa dikontrol responsif.
  return (
    <Link href="/" className="flex flex-col items-center gap-0 group transition-transform duration-300 hover:scale-105 active:scale-95">
      <Image 
        src="/logo/logo_only.png" 
        alt="Umbuddy Mascot" 
        width={120} 
        height={120} 
        className="h-20 w-auto sm:h-28 animate-bounce-subtle"
        style={{ width: 'auto' }}
        priority
      />
      <Image 
        src="/logo/logo_text.png" 
        alt="Umbuddy" 
        width={224} 
        height={56} 
        className="w-48 h-auto -mt-3 sm:w-56 sm:-mt-4"
        style={{ height: 'auto' }}
        priority
      />
    </Link>
  )
}
