'use client';

import { useState, useMemo, useEffect } from 'react';
import { OpenRouterModel, OpenRouterProvider, getModelProvider } from '@/lib/openrouter';
import { FilterOptions } from '@/components/models/AdvancedFilter';

interface UseFilteredModelsResult {
  filteredModels: OpenRouterModel[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  paginatedModels: OpenRouterModel[];
  setPage: (page: number) => void;
  loadMore: () => void;
  hasMore: boolean;
}

export function useFilteredModels(
  models: OpenRouterModel[],
  providers: OpenRouterProvider[],
  filters: FilterOptions,
  itemsPerPage: number = 20
): UseFilteredModelsResult {
  const [currentPage, setCurrentPage] = useState(1);

  // Apply all filters
  const filteredModels = useMemo(() => {
    return models.filter((model) => {
      // Search filter (immediate)
      if (filters.search.trim()) {
        const searchTerm = filters.search.toLowerCase().trim();
        const matchesSearch = (
          model.name.toLowerCase().includes(searchTerm) ||
          model.id.toLowerCase().includes(searchTerm) ||
          (model.description && model.description.toLowerCase().includes(searchTerm)) ||
          getModelProvider(model.id).toLowerCase().includes(searchTerm)
        );
        if (!matchesSearch) return false;
      }

      // Provider filter
      if (filters.providers.length > 0) {
        const modelProvider = getModelProvider(model.id);
        const providerMatch = providers.find(p => 
          p.name.toLowerCase() === modelProvider.toLowerCase() ||
          p.slug.toLowerCase() === modelProvider.toLowerCase()
        );
        if (!providerMatch || !filters.providers.includes(providerMatch.slug)) {
          return false;
        }
      }

      // Modality filter
      if (filters.modality.length > 0) {
        if (!filters.modality.includes(model.architecture.modality)) {
          return false;
        }
      }

      // Price range filter (checking prompt price)
      const promptPrice = parseFloat(model.pricing.prompt);
      if (filters.priceRange.min !== null && promptPrice < filters.priceRange.min) {
        return false;
      }
      if (filters.priceRange.max !== null && promptPrice > filters.priceRange.max) {
        return false;
      }

      // Context length filter
      if (filters.contextLength.min !== null && model.context_length < filters.contextLength.min) {
        return false;
      }
      if (filters.contextLength.max !== null && model.context_length > filters.contextLength.max) {
        return false;
      }

      // Moderation filter
      if (filters.isModerated !== null) {
        if (model.top_provider.is_moderated !== filters.isModerated) {
          return false;
        }
      }

      return true;
    });
  }, [models, providers, filters]);

  // Calculate pagination values
  const totalCount = filteredModels.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  
  // Get paginated results
  const paginatedModels = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredModels.slice(startIndex, endIndex);
  }, [filteredModels, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const loadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const hasMore = currentPage < totalPages;

  return {
    filteredModels,
    totalCount,
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedModels,
    setPage,
    loadMore,
    hasMore,
  };
}