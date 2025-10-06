import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { t, type Locale } from '@/lib/i18n';
import { fetchModels, formatPrice, getModelProvider, formatContextLength, fetchModelEndpoints, getModelAuthorAndSlug, ModelEndpoint } from '@/lib/openrouter';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import ModelPlayground from '@/components/models/ModelPlayground';

interface ModelDetailsPageProps {
  params: Promise<{ 
    locale: Locale;
    modelId: string 
  }>;
}

export default async function ModelDetailsPage({ params }: ModelDetailsPageProps) {
  const { locale, modelId } = await params;
  const decodedModelId = decodeURIComponent(modelId);
  const authorSlug = getModelAuthorAndSlug(decodedModelId);

  const allModels = await fetchModels();
  const model = allModels.find(m => m.id === decodedModelId);

  if (!model) {
    notFound();
  }

  const endpoints = authorSlug
    ? await fetchModelEndpoints(authorSlug.author, authorSlug.slug)
    : [];

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

          {/* Model Endpoints */}
          {endpoints.length > 0 && (
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Available Endpoints
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {endpoints.map((endpoint, index) => (
                    <div key={endpoint.id || index} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-medium">{endpoint.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Provider: {endpoint.provider}
                          </p>
                        </div>
                        <Badge variant={endpoint.is_moderated ? "default" : "secondary"}>
                          {endpoint.is_moderated ? 'Moderated' : 'Unmoderated'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                        <div>
                          <span className="text-muted-foreground">Prompt:</span>
                          <span className="font-mono ml-1">{formatPrice(endpoint.pricing.prompt)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Completion:</span>
                          <span className="font-mono ml-1">{formatPrice(endpoint.pricing.completion)}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Context:</span>
                          <span className="font-mono ml-1">{formatContextLength(endpoint.context_length)}</span>
                        </div>
                        {endpoint.max_completion_tokens && (
                          <div>
                            <span className="text-muted-foreground">Max Completion:</span>
                            <span className="font-mono ml-1">{formatContextLength(endpoint.max_completion_tokens)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Playground */}
          <ModelPlayground model={model} />

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