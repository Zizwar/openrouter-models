'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { OpenRouterModel, formatPrice, getModelProvider, formatContextLength } from '@/lib/openrouter';
import { t, type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { useComparison } from '@/context/ComparisonContext';
import { useFavorites } from '@/context/FavoritesContext';
import { PlusCircle, MinusCircle, Info, Heart } from 'lucide-react';

interface ModelCardProps {
  model: OpenRouterModel;
  locale: Locale;
}

export default function ModelCard({ model, locale }: ModelCardProps) {
  const { comparisonList, addToComparison, removeFromComparison, isInComparison } = useComparison();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();
  
  const provider = getModelProvider(model.id);
  const promptPrice = formatPrice(model.pricing.prompt);
  const completionPrice = formatPrice(model.pricing.completion);

  const inList = isInComparison(model.id);
  const isFull = comparisonList.length >= 4 && !inList;
  const isFav = isFavorite(model.id);

  const handleCompareClick = () => {
    if (inList) {
      removeFromComparison(model.id);
    } else if (!isFull) {
      addToComparison(model);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    if (isFav) {
      removeFavorite(model.id);
    } else {
      addFavorite(model.id);
    }
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg line-clamp-2 flex-1">{model.name}</CardTitle>
          <div className="flex items-center gap-1">
            <button onClick={handleFavoriteClick} className="p-1 hover:text-red-500 transition-colors">
              <Heart className={`h-5 w-5 ${isFav ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
            </button>
            <Badge variant="secondary" className="shrink-0">
              {provider}
            </Badge>
          </div>
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
        
        <div className="mt-4 pt-3 border-t flex items-center gap-2">
          <Link href={`/${locale}/models/${encodeURIComponent(model.id)}`} className="flex-grow">
            <Button className="w-full" size="sm" variant="outline">
              <Info className="h-4 w-4 mr-2" />
              {t('models.viewDetails', locale)}
            </Button>
          </Link>
          <Button 
            size="sm"
            variant={inList ? 'secondary' : 'default'}
            onClick={handleCompareClick}
            disabled={isFull}
            className="flex-grow"
          >
            {inList ? (
              <>
                <MinusCircle className="h-4 w-4 mr-2" />
                Remove
              </>
            ) : (
              <>
                <PlusCircle className="h-4 w-4 mr-2" />
                Compare
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}