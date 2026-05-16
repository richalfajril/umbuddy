import { HeroLayout } from '@/components/layouts/hero-layout'
import { 
  LandingNavbar, 
  LandingHero, 
  LandingFeatures, 
  LandingFAQ, 
  LandingFooter 
} from '@/components/organisms/landing'

/**
 * Halaman Utama (Landing Page) — Server Component.
 * Menggunakan HeroLayout sesuai Layout_Patterns.md.
 */
export default function LandingPage() {
  return (
    <HeroLayout
      navbar={<LandingNavbar />}
      hero={<LandingHero />}
      footer={<LandingFooter />}
    >
      <LandingFeatures />
      {/* Social Proof / Testimonials could go here */}
      <LandingFAQ />
    </HeroLayout>
  )
}
