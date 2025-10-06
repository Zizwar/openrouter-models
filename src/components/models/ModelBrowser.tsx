
'use client';

import { useState } from 'react';
import ModelCard from '@/components/models/ModelCard';
import ModelListItem from '@/components/models/ModelListItem';
import AdvancedFilter, { FilterOptions } from '@/components/models/AdvancedFilter';
import { Pagination } from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { t, type Locale } from '@/lib/i18n';
import { OpenRouterModel, OpenRouterProvider } from '@/lib/openrouter';
import { useFilteredModels } from '@/hooks/useFilteredModels';
import { useComparison } from '@/context/ComparisonContext';
import ComparisonBar from './ComparisonBar';
import ComparisonView from './ComparisonView';
import { LayoutGrid, List } from 'lucide-react';

interface ModelBrowserProps {
  initialModels: OpenRouterModel[];
  initialProviders: OpenRouterProvider[];
  locale: Locale;
}

type ViewMode = 'grid' | 'list';

export default function ModelBrowser({ initialModels, initialProviders, locale }: ModelBrowserProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    providers: [],
    priceRange: { min: null, max: null },
    contextLength: { min: null, max: null },
    modality: [],
    isModerated: null,
    sortBy: 'default',
    showFavoritesOnly: false,
  });

  const { comparisonList } = useComparison();
  const [showComparisonView, setShowComparisonView] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  const {
    totalCount,
    currentPage,
    totalPages,
    paginatedModels,
    setPage,
  } = useFilteredModels(initialModels, initialProviders, filters, 20);

  return (
    <>
      {/* Advanced Filter */}
      <div className="mb-6">
        <AdvancedFilter
          filters={filters}
          onFiltersChange={setFilters}
          providers={initialProviders}
          locale={locale}
        />
      </div>

      {/* View Mode Toggle and Summary */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t('models.showing', locale, {
            start: Math.min(((currentPage - 1) * 20) + 1, totalCount),
            end: Math.min(currentPage * 20, totalCount),
            total: totalCount,
          })}
          {totalCount > 20 && (
            <span className="ml-2 text-xs">
              ({t('models.page', locale, { current: currentPage, total: totalPages })})
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button variant={viewMode === 'grid' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button variant={viewMode === 'list' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('list')}>
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Models Display */}
      <div className="mb-8">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {paginatedModels.map((model) => (
              <ModelCard key={model.id} model={model} locale={locale} />
            ))}
          </div>
        ) : (
          <div className="border rounded-lg">
            {/* List Header */}
            <div className="border-b p-4 flex-row items-center justify-between gap-4 bg-muted/50 hidden md:flex">
              <div className="flex-1 font-semibold text-sm">Model</div>
              <div className="flex-none grid grid-cols-4 gap-4 items-center text-sm text-center font-semibold w-[400px]">
                <div>Context</div>
                <div>Prompt Price</div>
                <div>Completion Price</div>
                <div>Modality</div>
              </div>
              <div className="flex-none w-40 text-right"></div>
            </div>
            {paginatedModels.map(model => (
              <ModelListItem key={model.id} model={model} locale={locale} />
            ))}
          </div>
        )}
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

      {totalCount === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('models.noResults', locale)}</p>
        </div>
      )}

      {/* Comparison UI */}
      <ComparisonBar onCompare={() => setShowComparisonView(true)} />
      {showComparisonView && (
        <ComparisonView 
          models={comparisonList} 
          onClose={() => setShowComparisonView(false)} 
        />
      )}
    </>
  );
}
