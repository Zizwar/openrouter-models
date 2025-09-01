'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CryptoData } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface CryptoTableProps {
  title: string;
  data: CryptoData[];
}

export default function CryptoTable({ title, data }: CryptoTableProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: price < 1 ? 4 : 2,
    }).format(price);
  };

  const formatVolume = (volume: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(volume);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium text-muted-foreground">Coin</th>
                <th className="text-right py-3 px-2 font-medium text-muted-foreground">Price</th>
                <th className="text-right py-3 px-2 font-medium text-muted-foreground">24h Change</th>
                <th className="text-right py-3 px-2 font-medium text-muted-foreground">Volume</th>
              </tr>
            </thead>
            <tbody>
              {data.map((crypto) => (
                <tr key={crypto.id} className="border-b last:border-0 hover:bg-muted/50">
                  <td className="py-4 px-2">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{crypto.logo}</div>
                      <div>
                        <div className="font-medium">{crypto.name}</div>
                        <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-2 text-right font-mono">
                    {formatPrice(crypto.price)}
                  </td>
                  <td className="py-4 px-2 text-right">
                    <Badge
                      variant={crypto.change24h >= 0 ? 'default' : 'destructive'}
                      className={cn(
                        crypto.change24h >= 0
                          ? 'bg-green-100 text-green-800 hover:bg-green-100'
                          : 'bg-red-100 text-red-800 hover:bg-red-100'
                      )}
                    >
                      {crypto.change24h >= 0 ? '+' : ''}{crypto.change24h.toFixed(2)}%
                    </Badge>
                  </td>
                  <td className="py-4 px-2 text-right font-mono text-muted-foreground">
                    {formatVolume(crypto.volume24h)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}