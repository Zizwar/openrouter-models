'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const LOCAL_STORAGE_KEY = 'favorite_models';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (modelId: string) => void;
  removeFavorite: (modelId: string) => void;
  isFavorite: (modelId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      console.error('Failed to load favorites from localStorage', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error('Failed to save favorites to localStorage', error);
    }
  }, [favorites]);

  const addFavorite = (modelId: string) => {
    setFavorites(prev => [...prev, modelId]);
  };

  const removeFavorite = (modelId: string) => {
    setFavorites(prev => prev.filter(id => id !== modelId));
  };

  const isFavorite = (modelId: string) => {
    return favorites.includes(modelId);
  };

  const value = {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
