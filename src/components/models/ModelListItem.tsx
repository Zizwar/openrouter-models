'use client';

import { OpenRouterModel, formatPrice, getModelProvider, formatContextLength } from '@/lib/openrouter';
import { type Locale } from '@/lib/i18n';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useComparison } from '@/context/ComparisonContext';
import { useFavorites } from '@/context/FavoritesContext';
import { PlusCircle, MinusCircle, Heart } from 'lucide-react';

interface ModelListItemProps {
  model: OpenRouterModel;
  locale: Locale;
}

export default function ModelListItem({ model, locale }: ModelListItemProps) {
  const { comparisonList, addToComparison, removeFromComparison, isInComparison } = useComparison();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const provider = getModelProvider(model.id);
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
    e.stopPropagation();
    if (isFav) {
      removeFavorite(model.id);
    } else {
      addFavorite(model.id);
    }
  };

  return (
    <div className="border-b p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-muted/50">
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <Link href={`/${locale}/models/${encodeURIComponent(model.id)}`} className="font-semibold hover:underline">
            {model.name}
          </Link>
          <Badge variant="secondary">{provider}</Badge>
        </div>
        {model.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {model.description}
          </p>
        )}
      </div>

      <div className="flex-none grid grid-cols-2 md:grid-cols-4 gap-4 items-center text-sm text-center">
        <div className="font-mono">{formatContextLength(model.context_length)}</div>
        <div className="font-mono text-xs">{formatPrice(model.pricing.prompt)}</div>
        <div className="font-mono text-xs">{formatPrice(model.pricing.completion)}</div>
        <Badge variant="outline" className="text-xs justify-self-center">{model.architecture.modality}</Badge>
      </div>

      <div className="flex-none flex items-center gap-2 justify-end">
        <Button 
          size="sm"
          variant={inList ? 'secondary' : 'outline'}
          onClick={handleCompareClick}
          disabled={isFull}
          className="w-28"
        >
          {inList ? (
            <><MinusCircle className="h-4 w-4 mr-2" />Remove</>
          ) : (
            <><PlusCircle className="h-4 w-4 mr-2" />Compare</>
          )}
        </Button>
        <button onClick={handleFavoriteClick} className="p-2 hover:text-red-500 transition-colors">
          <Heart className={`h-5 w-5 ${isFav ? 'fill-current text-red-500' : 'text-muted-foreground'}`} />
        </button>
      </div>
    </div>
  );
}
