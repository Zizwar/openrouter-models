'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PortfolioItem } from '@/lib/mock-data';

interface PortfolioChartProps {
  title: string;
  data: PortfolioItem[];
}

export default function PortfolioChart({ title, data }: PortfolioChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item) => {
            const percentage = (item.value / total) * 100;
            return (
              <div key={item.crypto.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="text-xl">{item.crypto.logo}</div>
                    <span className="font-medium">{item.crypto.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.value)}</div>
                    <div className="text-sm text-muted-foreground">
                      {item.amount} {item.crypto.symbol}
                    </div>
                  </div>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <div className="text-sm text-muted-foreground text-right">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="font-medium">Total Portfolio Value</span>
            <span className="text-xl font-bold">{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}