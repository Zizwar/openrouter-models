'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { t, type Locale } from '@/lib/i18n';
import { fetchModels, OpenRouterModel, formatPrice, getModelProvider, formatContextLength } from '@/lib/openrouter';
import LanguageSelector from '@/components/dashboard/LanguageSelector';

interface ModelDetailsPageProps {
  params: Promise<{ locale: string; modelId: string }>;
}

export default function ModelDetailsPage({ params }: ModelDetailsPageProps) {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>('en');
  const [model, setModel] = useState<OpenRouterModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async ({ locale: paramLocale, modelId }) => {
      setLocale(paramLocale as Locale);
      
      try {
        const models = await fetchModels();
        const decodedModelId = decodeURIComponent(modelId);
        const foundModel = models.find(m => m.id === decodedModelId);
        
        if (foundModel) {
          setModel(foundModel);
        } else {
          router.push(`/${paramLocale}`);
        }
      } catch (error) {
        console.error('Error fetching model:', error);
        router.push(`/${paramLocale}`);
      } finally {
        setLoading(false);
      }
    });
  }, [params, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{t('common.loading', locale)}</p>
        </div>
      </div>
    );
  }

  if (!model) {
    return null;
  }

  const provider = getModelProvider(model.id);
  const promptPrice = formatPrice(model.pricing.prompt);
  const completionPrice = formatPrice(model.pricing.completion);

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
                  {t('models.backToModels', locale)}
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">{model.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{provider}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatContextLength(model.context_length)} context
                  </span>
                </div>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Description */}
          {model.description && (
            <Card>
              <CardHeader>
                <CardTitle>{t('models.description', locale)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">{model.description}</p>
              </CardContent>
            </Card>
          )}

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>{t('models.pricing', locale)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('models.prompt', locale)}</span>
                <span className="font-mono text-sm">{promptPrice}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('models.completion', locale)}</span>
                <span className="font-mono text-sm">{completionPrice}</span>
              </div>
              {model.pricing.request && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Request</span>
                  <span className="font-mono text-sm">{formatPrice(model.pricing.request)}</span>
                </div>
              )}
              {model.pricing.image && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Image</span>
                  <span className="font-mono text-sm">{formatPrice(model.pricing.image)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Architecture */}
          <Card>
            <CardHeader>
              <CardTitle>{t('models.architecture', locale)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('models.modality', locale)}</span>
                <Badge variant="outline">{model.architecture.modality}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('models.tokenizer', locale)}</span>
                <span className="text-sm">{model.architecture.tokenizer}</span>
              </div>
              {model.architecture.instruct_type && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('models.instructType', locale)}</span>
                  <span className="text-sm">{model.architecture.instruct_type}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>{t('models.specifications', locale)}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('models.contextLength', locale)}</span>
                <span className="font-mono text-sm">{formatContextLength(model.context_length)}</span>
              </div>
              {model.top_provider.max_completion_tokens && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Max Completion</span>
                  <span className="font-mono text-sm">
                    {formatContextLength(model.top_provider.max_completion_tokens)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{t('models.moderated', locale)}</span>
                <Badge variant={model.top_provider.is_moderated ? 'default' : 'secondary'}>
                  {t(model.top_provider.is_moderated ? 'models.yes' : 'models.no', locale)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Limits */}
          {model.per_request_limits && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>{t('models.limits', locale)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('models.promptTokens', locale)}</span>
                    <span className="font-mono text-sm">
                      {formatContextLength(parseInt(model.per_request_limits.prompt_tokens))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('models.completionTokens', locale)}</span>
                    <span className="font-mono text-sm">
                      {formatContextLength(parseInt(model.per_request_limits.completion_tokens))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Model ID */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Model ID</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-sm bg-muted px-2 py-1 rounded">{model.id}</code>
              <p className="text-xs text-muted-foreground mt-2">
                Use this ID to reference the model in API calls
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}