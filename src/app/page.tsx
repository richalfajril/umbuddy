import { HeroLayout } from '@/components/templates/hero-layout'
import { ThemeToggle } from '@/components/atoms/theme-toggle'
import { 
  LandingNavbar, 
  LandingHero, 
  LandingFeatures, 
  LandingShowcases,
  LandingTestimonials,
  LandingFunding,
  LandingFAQ, 
  LandingBottomCTA,
  LandingFooter,
  LandingMetrics,
  LandingStickyCTA
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
      <LandingMetrics />
      <LandingFeatures />
      <LandingShowcases />
      <LandingFunding />
      <LandingTestimonials />
      <LandingFAQ />
      <LandingBottomCTA />
      <LandingStickyCTA />
      <ThemeToggle />
    </HeroLayout>
  )
}
