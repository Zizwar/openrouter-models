'use client';

import { Button } from '@/components/ui/button';
import { useRouter, usePathname } from 'next/navigation';

export default function LanguageSelector() {
  const router = useRouter();
  const pathname = usePathname();
  
  const getCurrentLocale = () => {
    const segments = pathname.split('/');
    return segments[1] === 'ar' ? 'ar' : 'en';
  };
  
  const locale = getCurrentLocale();

  const switchLanguage = (newLocale: string) => {
    const segments = pathname.split('/');
    segments[1] = newLocale;
    const newPathname = segments.join('/');
    router.push(newPathname);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('en')}
      >
        English
      </Button>
      <Button
        variant={locale === 'ar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => switchLanguage('ar')}
      >
        العربية
      </Button>
    </div>
  );
}