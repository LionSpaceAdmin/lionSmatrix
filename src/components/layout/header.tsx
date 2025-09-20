import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/daily-brief', label: 'Daily Brief' },
  { href: '#', label: 'War Machine' }, // Should be /dashboard/war-machine
  { href: '#', label: 'Impact' },
  { href: '#', label: 'About' },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex md:hidden">
          <Sheet>
              <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                      <Menu className="h-6 w-6" />
                      <span className="sr-only">Toggle Menu</span>
                  </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs">
                  <div className="p-4">
                      <Link href="/" className="mb-8 flex items-center space-x-2">
                          <Shield className="h-6 w-6 text-primary" />
                          <span className="font-bold font-headline">Zion's Shield</span>
                      </Link>
                      <nav className="flex flex-col gap-4">
                          {navItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className='text-lg font-medium text-foreground/80 hover:text-foreground'
                            >
                              {item.label}
                            </Link>
                          ))}
                      </nav>
                  </div>
              </SheetContent>
          </Sheet>>
        </div>
        
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Shield className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">
              Zion's Shield
            </span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'transition-colors hover:text-foreground/80 text-foreground/60'
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          <nav className="flex items-center gap-2">
            <Button asChild>
              <Link href="#">Join the fight — Free</Link>
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
