'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OpenRouterModel, formatPrice, getModelProvider, formatContextLength } from '@/lib/openrouter';
import { t, type Locale } from '@/lib/i18n';
import Link from 'next/link';

interface ModelCardProps {
  model: OpenRouterModel;
  locale: Locale;
}

export default function ModelCard({ model, locale }: ModelCardProps) {
  const provider = getModelProvider(model.id);
  const promptPrice = formatPrice(model.pricing.prompt);
  const completionPrice = formatPrice(model.pricing.completion);
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2">{model.name}</CardTitle>
          <Badge variant="secondary" className="shrink-0">
            {provider}
          </Badge>
        </div>
        {model.description && (
          <p className="text-sm text-muted-foreground line-clamp-3">
            {model.description}
          </p>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('models.contextLength', locale)}</span>
            <span className="font-mono">{formatContextLength(model.context_length)}</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('models.prompt', locale)}</span>
              <span className="font-mono text-xs">{promptPrice}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('models.completion', locale)}</span>
              <span className="font-mono text-xs">{completionPrice}</span>
            </div>
          </div>
          
          {model.architecture.modality && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t('models.modality', locale)}</span>
              <Badge variant="outline" className="text-xs">
                {model.architecture.modality}
              </Badge>
            </div>
          )}
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <Link href={`/${locale}/models/${encodeURIComponent(model.id)}`}>
            <Button className="w-full" size="sm">
              {t('models.viewDetails', locale)}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}