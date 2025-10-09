import type { Metadata } from 'next'

import '../globals.css'



export const metadata: Metadata = {
  title: 'Open Router Models',
  description: 'A dashboard to browse and compare Open Router Models',
}

import { ComparisonProvider } from '@/context/ComparisonContext';
import { FavoritesProvider } from '@/context/FavoritesContext';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  await params;
  return (
    <FavoritesProvider>
      <ComparisonProvider>
        {children}
      </ComparisonProvider>
    </FavoritesProvider>
  );
}