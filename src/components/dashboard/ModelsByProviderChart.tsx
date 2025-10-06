'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ProviderChartData {
  name: string;
  count: number;
}

interface ModelsByProviderChartProps {
  data: ProviderChartData[];
}

export default function ModelsByProviderChart({ data }: ModelsByProviderChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Models by Provider</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))', 
                borderColor: 'hsl(var(--border))' 
              }}
            />
            <Legend />
            <Bar dataKey="count" fill="hsl(var(--primary))" name="Number of Models" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
