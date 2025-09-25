"use client";

import { usePathname, useRouter } from 'next/navigation';
import { locales } from '@/lib/i18n/config';

export function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (newLocale: string) => {
    // This is a simplified approach. A more robust solution would handle
    // cases where the path doesn't start with a locale.
    const segments = pathname.split('/');
    if (locales.includes(segments[1])) {
      segments[1] = newLocale;
      router.replace(segments.join('/'));
    } else {
      router.replace(`/${newLocale}${pathname}`);
    }
  };

  return (
    <div className="flex gap-2">
      {locales.map((locale) => (
        <button
          key={locale}
          onClick={() => handleLocaleChange(locale)}
          className="text-sm font-medium uppercase hover:text-primary"
        >
          {locale}
        </button>
      ))}
    </div>
  );
}
