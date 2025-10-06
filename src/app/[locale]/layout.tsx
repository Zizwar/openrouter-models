import type { Metadata } from 'next'

import '../globals.css'



export const metadata: Metadata = {
  title: 'Crypto Dashboard',
  description: 'Modern cryptocurrency dashboard with real-time data',
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