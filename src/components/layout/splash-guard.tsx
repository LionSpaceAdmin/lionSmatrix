"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const getCookie = (name: string): string | undefined => {
  if (typeof document === 'undefined') {
    return undefined;
  }
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return undefined;
}

export function SplashGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const splashSeen = getCookie('splash-seen');
    const isOpeningPage = pathname.endsWith('/opening');

    if (!splashSeen && !isOpeningPage) {
      router.push('/opening');
    }
    if (splashSeen && isOpeningPage) {
      router.push('/');
    }
  }, [pathname, router]);

  if (pathname.endsWith('/opening')) {
    return <>{children}</>;
  }

  if (!getCookie('splash-seen')) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
}
