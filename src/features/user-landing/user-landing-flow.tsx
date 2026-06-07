import { ThemeToggle } from '@/components/atoms/theme-toggle'
import {
  LandingBottomCTA,
  LandingFAQ,
  LandingFeatures,
  LandingFooter,
  LandingFunding,
  LandingHero,
  LandingMetrics,
  LandingNavbar,
  LandingShowcases,
  LandingStickyCTA,
  LandingTestimonials,
} from '@/features/user-landing/_components'
import { HeroLayout } from '@/components/templates/hero-layout'

// Flow landing menyusun section publik agar route app tetap routing-only.
export function UserLandingFlow() {
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
