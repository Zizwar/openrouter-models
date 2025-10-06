'use client';

import { OpenRouterModel, formatPrice, formatContextLength } from '@/lib/openrouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ComparisonViewProps {
  models: OpenRouterModel[];
  onClose: () => void;
}

const SPEC_ROWS = [
  { key: 'provider', label: 'Provider' },
  { key: 'context_length', label: 'Context Length' },
  { key: 'pricing.prompt', label: 'Prompt Price' },
  { key: 'pricing.completion', label: 'Completion Price' },
  { key: 'architecture.modality', label: 'Modality' },
  { key: 'architecture.tokenizer', label: 'Tokenizer' },
  { key: 'top_provider.is_moderated', label: 'Moderated' },
];

export default function ComparisonView({ models, onClose }: ComparisonViewProps) {
  const getSpecValue = (model: OpenRouterModel, key: string) => {
    switch (key) {
      case 'provider':
        return model.id.split('/')[0] || 'N/A';
      case 'context_length':
        return formatContextLength(model.context_length);
      case 'pricing.prompt':
        return formatPrice(model.pricing.prompt);
      case 'pricing.completion':
        return formatPrice(model.pricing.completion);
      case 'architecture.modality':
        return model.architecture.modality;
      case 'architecture.tokenizer':
        return model.architecture.tokenizer;
      case 'top_provider.is_moderated':
        return model.top_provider.is_moderated ? 'Yes' : 'No';
      default:
        return 'N/A';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Compare Models ({models.length})</CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-auto">
          <div className="relative">
            <table className="w-full border-collapse text-sm">
              {/* Table Head */}
              <thead className="sticky top-0 bg-card z-10">
                <tr>
                  <th className="border p-3 text-left font-semibold w-1/4">Specification</th>
                  {models.map(model => (
                    <th key={model.id} className="border p-3 text-left font-semibold">
                      {model.name}
                    </th>
                  ))}
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {SPEC_ROWS.map(row => (
                  <tr key={row.key}>
                    <td className="border p-3 font-medium text-muted-foreground">{row.label}</td>
                    {models.map(model => (
                      <td key={model.id} className="border p-3 font-mono">
                        {getSpecValue(model, row.key)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
