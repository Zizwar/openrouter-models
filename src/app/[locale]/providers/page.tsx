'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, ExternalLink, Building2 } from 'lucide-react';
import { type Locale } from '@/lib/i18n';
import { fetchProviders, fetchModels, OpenRouterProvider, OpenRouterModel, getModelProviderFromProviders } from '@/lib/openrouter';
import LanguageSelector from '@/components/dashboard/LanguageSelector';

interface ProvidersPageProps {
  params: Promise<{ locale: string }>;
}

export default function ProvidersPage({ params }: ProvidersPageProps) {
  const [locale, setLocale] = useState<Locale>('en');
  const [providers, setProviders] = useState<OpenRouterProvider[]>([]);
  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    params.then(({ locale: paramLocale }) => {
      setLocale(paramLocale as Locale);
    });
  }, [params]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [providersData, modelsData] = await Promise.all([
          fetchProviders(),
          fetchModels()
        ]);
        setProviders(providersData);
        setModels(modelsData);
      } catch (error) {
        console.error('Failed to load providers:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter providers based on search
  const filteredProviders = providers.filter(provider => 
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get models count for each provider
  const getProviderModelsCount = (provider: OpenRouterProvider) => {
    return models.filter(model => {
      const modelProvider = getModelProviderFromProviders(model.id, providers);
      return modelProvider?.slug === provider.slug;
    }).length;
  };

  // Get provider models for display
  const getProviderModels = (provider: OpenRouterProvider, limit = 3) => {
    return models
      .filter(model => {
        const modelProvider = getModelProviderFromProviders(model.id, providers);
        return modelProvider?.slug === provider.slug;
      })
      .slice(0, limit);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading providers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={`/${locale}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Models
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Building2 className="h-6 w-6" />
                  Providers
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Browse AI model providers and their offerings
                </p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Search */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search providers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 text-sm text-muted-foreground">
          {filteredProviders.length} {filteredProviders.length === 1 ? 'provider' : 'providers'} found
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProviders.map((provider) => {
            const modelsCount = getProviderModelsCount(provider);
            const sampleModels = getProviderModels(provider, 3);

            return (
              <Card key={provider.slug} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {provider.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="secondary">{provider.slug}</Badge>
                        <Badge variant="outline">
                          {modelsCount} model{modelsCount !== 1 ? 's' : ''}
                        </Badge>
                      </div>
                    </div>
                    {provider.terms_of_service_url && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                      >
                        <a 
                          href={provider.terms_of_service_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-1"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">

                  {/* Sample Models */}
                  {sampleModels.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Popular Models:</h4>
                      <div className="space-y-1">
                        {sampleModels.map((model) => (
                          <Link
                            key={model.id}
                            href={`/${locale}/models/${encodeURIComponent(model.id)}`}
                            className="block"
                          >
                            <div className="text-xs p-2 bg-muted rounded hover:bg-muted/80 transition-colors">
                              <div className="font-medium">{model.name}</div>
                              <div className="text-muted-foreground mt-1 truncate">
                                {model.id}
                              </div>
                            </div>
                          </Link>
                        ))}
                        {modelsCount > 3 && (
                          <div className="text-xs text-muted-foreground p-2">
                            and {modelsCount - 3} more models...
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Provider Stats */}
                  <div className="pt-2 border-t">
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      <div>
                        <span className="font-medium">Models:</span> {modelsCount}
                      </div>
                      {provider.privacy_policy_url && (
                        <a 
                          href={provider.privacy_policy_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary underline"
                        >
                          Privacy Policy
                        </a>
                      )}
                      {provider.status_page_url && (
                        <a 
                          href={provider.status_page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-primary underline"
                        >
                          Status Page
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results */}
        {filteredProviders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No providers found matching your search.</p>
          </div>
        )}
      </main>
    </div>
  );
}