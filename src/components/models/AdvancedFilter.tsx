'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { t, type Locale } from '@/lib/i18n';
import { Search, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { OpenRouterProvider } from '@/lib/openrouter';

export interface FilterOptions {
  search: string;
  providers: string[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
  contextLength: {
    min: number | null;
    max: number | null;
  };
  modality: string[];
  isModerated: boolean | null;
}

interface AdvancedFilterProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  providers: OpenRouterProvider[];
  locale: Locale;
}

const MODALITIES = ['text', 'text+image', 'image', 'multimodal'];

export default function AdvancedFilter({ 
  filters, 
  onFiltersChange, 
  providers, 
  locale 
}: AdvancedFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const applyFilters = () => {
    onFiltersChange(localFilters);
  };

  const resetFilters = () => {
    const emptyFilters: FilterOptions = {
      search: '',
      providers: [],
      priceRange: { min: null, max: null },
      contextLength: { min: null, max: null },
      modality: [],
      isModerated: null,
    };
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const updateSearch = (search: string) => {
    const newFilters = { ...localFilters, search };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters); // Apply search immediately
  };

  const toggleProvider = (providerId: string) => {
    if (!providerId) return; // Guard against empty/undefined providerId
    const newProviders = localFilters.providers.includes(providerId)
      ? localFilters.providers.filter(p => p !== providerId)
      : [...localFilters.providers, providerId];
    setLocalFilters({ ...localFilters, providers: newProviders });
  };

  const toggleModality = (modality: string) => {
    const newModalities = localFilters.modality.includes(modality)
      ? localFilters.modality.filter(m => m !== modality)
      : [...localFilters.modality, modality];
    setLocalFilters({ ...localFilters, modality: newModalities });
  };

  const activeFiltersCount = 
    localFilters.providers.length +
    localFilters.modality.length +
    (localFilters.priceRange.min !== null ? 1 : 0) +
    (localFilters.priceRange.max !== null ? 1 : 0) +
    (localFilters.contextLength.min !== null ? 1 : 0) +
    (localFilters.contextLength.max !== null ? 1 : 0) +
    (localFilters.isModerated !== null ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder={t('models.searchPlaceholder', locale)}
          value={localFilters.search}
          onChange={(e) => updateSearch(e.target.value)}
          className="pl-10 pr-12"
        />
        {localFilters.search && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
            onClick={() => updateSearch('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Advanced Filters Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={resetFilters}>
            Clear All
          </Button>
        )}
      </div>

      {/* Advanced Filters Panel */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Filter Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Providers Filter */}
            <div>
              <h4 className="text-sm font-medium mb-3">Providers</h4>
              <div className="flex flex-wrap gap-2">
                {providers.map((provider, index) => (
                  <Badge
                    key={provider.slug || `provider-${index}`}
                    variant={localFilters.providers.includes(provider.slug || '') ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleProvider(provider.slug || '')}
                  >
                    {provider.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Modality Filter */}
            <div>
              <h4 className="text-sm font-medium mb-3">Modality</h4>
              <div className="flex flex-wrap gap-2">
                {MODALITIES.map((modality, index) => (
                  <Badge
                    key={modality || `modality-${index}`}
                    variant={localFilters.modality.includes(modality) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/80"
                    onClick={() => toggleModality(modality)}
                  >
                    {modality}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <h4 className="text-sm font-medium mb-3">Price Range (per 1K tokens)</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Min Price ($)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="0.0001"
                    value={localFilters.priceRange.min || ''}
                    onChange={(e) => setLocalFilters({
                      ...localFilters,
                      priceRange: {
                        ...localFilters.priceRange,
                        min: e.target.value ? parseFloat(e.target.value) : null
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Max Price ($)</label>
                  <Input
                    type="number"
                    step="0.0001"
                    placeholder="1.0000"
                    value={localFilters.priceRange.max || ''}
                    onChange={(e) => setLocalFilters({
                      ...localFilters,
                      priceRange: {
                        ...localFilters.priceRange,
                        max: e.target.value ? parseFloat(e.target.value) : null
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Context Length */}
            <div>
              <h4 className="text-sm font-medium mb-3">Context Length</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Min Context</label>
                  <Input
                    type="number"
                    placeholder="4096"
                    value={localFilters.contextLength.min || ''}
                    onChange={(e) => setLocalFilters({
                      ...localFilters,
                      contextLength: {
                        ...localFilters.contextLength,
                        min: e.target.value ? parseInt(e.target.value) : null
                      }
                    })}
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Max Context</label>
                  <Input
                    type="number"
                    placeholder="1000000"
                    value={localFilters.contextLength.max || ''}
                    onChange={(e) => setLocalFilters({
                      ...localFilters,
                      contextLength: {
                        ...localFilters.contextLength,
                        max: e.target.value ? parseInt(e.target.value) : null
                      }
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Moderated Filter */}
            <div>
              <h4 className="text-sm font-medium mb-3">Moderation</h4>
              <div className="flex gap-2">
                <Badge
                  variant={localFilters.isModerated === true ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => setLocalFilters({
                    ...localFilters,
                    isModerated: localFilters.isModerated === true ? null : true
                  })}
                >
                  Moderated
                </Badge>
                <Badge
                  variant={localFilters.isModerated === false ? "default" : "outline"}
                  className="cursor-pointer hover:bg-primary/80"
                  onClick={() => setLocalFilters({
                    ...localFilters,
                    isModerated: localFilters.isModerated === false ? null : false
                  })}
                >
                  Unmoderated
                </Badge>
              </div>
            </div>

            {/* Apply Filters Button */}
            <div className="flex gap-3 pt-4">
              <Button onClick={applyFilters} className="flex-1">
                Apply Filters
              </Button>
              <Button variant="outline" onClick={resetFilters}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Filters Summary */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {localFilters.providers.map((providerSlug, index) => {
            const provider = providers.find(p => p.slug === providerSlug);
            return provider ? (
              <Badge
                key={providerSlug || `active-provider-${index}`}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {provider.name}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => toggleProvider(providerSlug)}
                />
              </Badge>
            ) : null;
          })}
          {localFilters.modality.map((modality, index) => (
            <Badge
              key={modality || `active-modality-${index}`}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {modality}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => toggleModality(modality)}
              />
            </Badge>
          ))}
          {localFilters.isModerated !== null && (
            <Badge
              variant="secondary"
              className="flex items-center gap-1"
            >
              {localFilters.isModerated ? 'Moderated' : 'Unmoderated'}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setLocalFilters({ ...localFilters, isModerated: null })}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}