'use client';

import { useComparison } from '@/context/ComparisonContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X } from 'lucide-react';

interface ComparisonBarProps {
  onCompare: () => void;
}

export default function ComparisonBar({ onCompare }: ComparisonBarProps) {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();

  if (comparisonList.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="container mx-auto p-4 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <h3 className="text-lg font-semibold">Compare Models ({comparisonList.length}/4)</h3>
          <div className="flex items-center gap-2">
            {comparisonList.map(model => (
              <div key={model.id} className="flex items-center gap-1 bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                <span>{model.name}</span>
                <button onClick={() => removeFromComparison(model.id)} className="hover:text-destructive">
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={onCompare} 
            disabled={comparisonList.length < 2}
          >
            Compare
          </Button>
          <Button variant="ghost" onClick={clearComparison}>Clear</Button>
        </div>
      </Card>
    </div>
  );
}
