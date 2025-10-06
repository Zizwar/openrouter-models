'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { OpenRouterModel } from '@/lib/openrouter';

interface ComparisonContextType {
  comparisonList: OpenRouterModel[];
  addToComparison: (model: OpenRouterModel) => void;
  removeFromComparison: (modelId: string) => void;
  isInComparison: (modelId: string) => boolean;
  clearComparison: () => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export function useComparison() {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error('useComparison must be used within a ComparisonProvider');
  }
  return context;
}

interface ComparisonProviderProps {
  children: ReactNode;
}

export function ComparisonProvider({ children }: ComparisonProviderProps) {
  const [comparisonList, setComparisonList] = useState<OpenRouterModel[]>([]);

  const addToComparison = (model: OpenRouterModel) => {
    setComparisonList(prevList => {
      if (prevList.length < 4 && !prevList.find(m => m.id === model.id)) {
        return [...prevList, model];
      }
      return prevList;
    });
  };

  const removeFromComparison = (modelId: string) => {
    setComparisonList(prevList => prevList.filter(m => m.id !== modelId));
  };

  const isInComparison = (modelId: string) => {
    return comparisonList.some(m => m.id === modelId);
  };

  const clearComparison = () => {
    setComparisonList([]);
  };

  const value = {
    comparisonList,
    addToComparison,
    removeFromComparison,
    isInComparison,
    clearComparison,
  };

  return (
    <ComparisonContext.Provider value={value}>
      {children}
    </ComparisonContext.Provider>
  );
}
