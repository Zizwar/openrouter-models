'use client';

import { useState, useEffect } from 'react';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import ModelCard from '@/components/models/ModelCard';
import SearchFilter from '@/components/models/SearchFilter';
import { t, type Locale } from '@/lib/i18n';
import { fetchModels, OpenRouterModel } from '@/lib/openrouter';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default function HomePage({ params }: HomePageProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [filteredModels, setFilteredModels] = useState<OpenRouterModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale as Locale);
    });
  }, [params]);

  useEffect(() => {
    const loadModels = async () => {
      setLoading(true);
      try {
        const modelsData = await fetchModels();
        setModels(modelsData);
        setFilteredModels(modelsData); // Show ALL models
      } catch (error) {
        console.error('Failed to load models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredModels(models); // Show ALL models when no search
      return;
    }

    const filtered = models.filter(
      (model) =>
        model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        model.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (model.description && model.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredModels(filtered);
  }, [searchTerm, models]);

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
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6 max-w-md">
          <SearchFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
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
            <div className="mb-4 text-sm text-muted-foreground">
              {filteredModels.length} {filteredModels.length === 1 ? 'model' : 'models'} found
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredModels.map((model) => (
                <ModelCard key={model.id} model={model} locale={locale} />
              ))}
            </div>

            {filteredModels.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No models found matching your search.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}