'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  locale: string
}

const locales = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
]

export default function Header({ locale }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const handleLocaleChange = (newLocale: string) => {
    // Store locale preference
    document.cookie = `locale=${newLocale};path=/;max-age=31536000`
    // Redirect to new locale
    const currentPath = window.location.pathname.replace(/^\/[a-z]{2}/, '')
    window.location.href = `/${newLocale}${currentPath}`
  }

  const currentLocale = locales.find(l => l.code === locale) || locales[0]

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">
              LIONS OF ZION
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/daily-brief" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Daily Brief
            </Link>
            <Link 
              href="/archive" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Archive
            </Link>
            <Link 
              href="/academy/playbooks" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Playbooks
            </Link>
            <Link 
              href="/about" 
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* Locale Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <Globe className="h-4 w-4" />
                <span className="hidden sm:inline">{currentLocale?.flag}</span>
                <span className="hidden lg:inline text-xs">{currentLocale?.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {locales.map((loc) => (
                <DropdownMenuItem
                  key={loc.code}
                  onClick={() => handleLocaleChange(loc.code)}
                  className="gap-2"
                >
                  <span>{loc.flag}</span>
                  <span>{loc.name}</span>
                  {loc.code === locale && (
                    <span className="ml-auto text-xs text-cyan-400">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* CTA Buttons */}
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/auth/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/auth/join">
              <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                Join the Fight
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-4 space-y-3">
            <Link 
              href="/daily-brief" 
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Daily Brief
            </Link>
            <Link 
              href="/archive" 
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Archive
            </Link>
            <Link 
              href="/academy/playbooks" 
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Playbooks
            </Link>
            <Link 
              href="/about" 
              className="block py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              About
            </Link>
            <div className="pt-4 border-t space-y-2">
              <Link href="/auth/sign-in" className="block">
                <Button variant="outline" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/join" className="block">
                <Button size="sm" className="w-full bg-cyan-500 hover:bg-cyan-600 text-black font-bold">
                  Join the Fight
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
