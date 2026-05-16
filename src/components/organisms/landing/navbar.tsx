'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { useTheme } from 'next-themes'

/**
 * Navbar Landing Page — Client Component.
 * Menangani toggle theme dan mobile menu.
 */
export function LandingNavbar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Avoid hydration mismatch
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
  }

  if (!mounted) return (
    <nav className="w-full bg-background/80 backdrop-blur-md border-b border-border h-16">
      {/* Skeleton / Placeholder while loading theme to prevent FOUC */}
    </nav>
  )

  const currentTheme = resolvedTheme || theme

  return (
    <nav className="w-full bg-background/80 dark:bg-dark-background/80 backdrop-blur-md border-b border-border dark:border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="md:hidden">
                <Image 
                  src="/logo/logo_only.png" 
                  alt="Umbuddy Logo" 
                  width={40} 
                  height={40} 
                  className="w-10 h-10"
                />
              </div>
              <div className="hidden md:block">
                <Image 
                  src="/logo/logo_horizontal.png" 
                  alt="Umbuddy Logo" 
                  width={150} 
                  height={40} 
                  className="h-10 w-auto"
                />
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-sm font-medium text-body hover:text-primary transition-colors">Fitur</Link>
            <Link href="#battle" className="text-sm font-medium text-body hover:text-primary transition-colors">Battle</Link>
            <Link href="#leaderboard" className="text-sm font-medium text-body hover:text-primary transition-colors">Leaderboard</Link>
            <Link href="#faq" className="text-sm font-medium text-body hover:text-primary transition-colors">FAQ</Link>
            
            <div className="flex items-center gap-4 ml-4">
              <button 
                onClick={toggleTheme}
                className="p-2 rounded-xl border-2 border-border dark:border-dark-border hover:bg-surface dark:hover:bg-dark-surface transition-all"
                aria-label="Toggle Theme"
              >
                {currentTheme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
              </button>
              <Link href="/auth/login">
                <Button variant="secondary" size="sm">Masuk</Button>
              </Link>
              <Link href="/auth/register">
                <Button variant="primary" size="sm">Daftar Gratis</Button>
              </Link>
            </div>
          </div>

          {/* Mobile Toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl border-2 border-border dark:border-dark-border"
            >
              {currentTheme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5 text-yellow-400" />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl border-2 border-border dark:border-dark-border"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-background dark:bg-dark-background border-b border-border dark:border-dark-border px-4 pt-2 pb-6 space-y-4">
          <Link href="#features" className="block text-base font-medium text-body py-2">Fitur</Link>
          <Link href="#battle" className="block text-base font-medium text-body py-2">Battle</Link>
          <Link href="#leaderboard" className="block text-base font-medium text-body py-2">Leaderboard</Link>
          <Link href="#faq" className="block text-base font-medium text-body py-2">FAQ</Link>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Link href="/auth/login" className="w-full">
              <Button variant="secondary" className="w-full">Masuk</Button>
            </Link>
            <Link href="/auth/register" className="w-full">
              <Button variant="primary" className="w-full">Daftar</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
