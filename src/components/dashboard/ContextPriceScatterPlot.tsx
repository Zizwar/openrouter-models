'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


export interface ContextPriceChartData {
  name: string;
  context: number;
  price: number;
}

interface ContextPriceScatterPlotProps {
  data: ContextPriceChartData[];
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    payload: ContextPriceChartData;
    value: number;
    name: string;
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="p-2 bg-background border rounded-md" style={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}>
        <p className="font-bold">{data.name}</p>
        <p>Context: {data.context.toLocaleString()}</p>
        <p>Price: ${data.price.toFixed(6)}/1k tok</p>
      </div>
    );
  }

  return null;
};

export default function ContextPriceScatterPlot({ data }: ContextPriceScatterPlotProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Context Length vs. Prompt Price</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid />
            <XAxis 
              type="number" 
              dataKey="context" 
              name="Context Length" 
              tickFormatter={(tick) => `${(tick / 1000)}k`} 
              domain={[0, 'dataMax']} 
            />
            <YAxis 
              type="number" 
              dataKey="price" 
              name="Prompt Price ($/1k tokens)" 
              tickFormatter={(tick) => `$${tick.toFixed(4)}`} 
              domain={[0, 'dataMax']} 
            />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }} 
              content={<CustomTooltip />}
            />
            <Legend />
            <Scatter name="Models" data={data} fill="hsl(var(--primary))" />
          </ScatterChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
