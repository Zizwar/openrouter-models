'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import ModelCard from '@/components/models/ModelCard';
import AdvancedFilter, { FilterOptions } from '@/components/models/AdvancedFilter';
import { Pagination } from '@/components/ui/pagination';
import { t, type Locale } from '@/lib/i18n';
import { fetchModels, fetchProviders, OpenRouterModel, OpenRouterProvider } from '@/lib/openrouter';
import { useFilteredModels } from '@/hooks/useFilteredModels';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default function HomePage({ params }: HomePageProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [providers, setProviders] = useState<OpenRouterProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    providers: [],
    priceRange: { min: null, max: null },
    contextLength: { min: null, max: null },
    modality: [],
    isModerated: null,
  });

  const {
    totalCount,
    currentPage,
    totalPages,
    paginatedModels,
    setPage,
  } = useFilteredModels(models, providers, filters, 20);

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale as Locale);
    });
  }, [params]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [modelsData, providersData] = await Promise.all([
          fetchModels(),
          fetchProviders()
        ]);
        setModels(modelsData);
        setProviders(providersData);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t('models.title', locale)}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('models.subtitle', locale)}
              </p>
              <div className="mt-2">
                <Link 
                  href={`/${locale}/providers`}
                  className="text-xs text-primary hover:underline"
                >
                  Browse Providers →
                </Link>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Advanced Filter */}
        <div className="mb-6">
          <AdvancedFilter
            filters={filters}
            onFiltersChange={setFilters}
            providers={providers}
            locale={locale}
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('common.loading', locale)}</p>
            </div>
          </div>
        )}

        {/* Models Grid */}
        {!loading && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, totalCount)} of {totalCount} models
                {totalCount > 20 && (
                  <span className="ml-2 text-xs">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedModels.map((model) => (
                <ModelCard key={model.id} model={model} locale={locale} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}

            {totalCount === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No models found matching your filters.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}