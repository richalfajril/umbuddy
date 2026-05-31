import Image from 'next/image'
import Link from 'next/link'

// Header logo konsisten untuk semua step onboarding.
export function OnboardingLogoHeader() {
  return (
    <Link href="/" className="flex flex-col items-center gap-0 transition-transform duration-300 hover:scale-105 active:scale-95">
      {/* Logo only dipakai sebagai mascot-like anchor visual di atas form onboarding. */}
      <Image
        src="/logo/logo_only.png"
        alt="Umbuddy Mascot"
        width={120}
        height={120}
        className="h-20 w-auto sm:h-28 animate-bounce-subtle"
        style={{ width: 'auto' }}
        priority
      />
      {/* Logo text didekatkan dengan logo only agar header terasa seperti auth page. */}
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
