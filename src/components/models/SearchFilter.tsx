'use client';

import { Input } from '@/components/ui/input';
import { t, type Locale } from '@/lib/i18n';
import { Search } from 'lucide-react';

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  locale: Locale;
}

export default function SearchFilter({ searchTerm, onSearchChange, locale }: SearchFilterProps) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="text"
        placeholder={t('models.searchPlaceholder', locale)}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}