import Link from 'next/link';
import { fetchModels, fetchProviders } from '@/lib/openrouter';
import { processDataForProviderChart, processDataForContextPriceChart } from '@/lib/utils';
import { type Locale } from '@/lib/i18n';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import StatsCard from '@/components/dashboard/StatsCard';
import ModelsByProviderChart from '@/components/dashboard/ModelsByProviderChart';
import ContextPriceScatterPlot from '@/components/dashboard/ContextPriceScatterPlot';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shapes, BarChart3 } from 'lucide-react';

interface DashboardPageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params;
  const [models, providers] = await Promise.all([
    fetchModels(),
    fetchProviders(),
  ]);

  const providerChartData = processDataForProviderChart(models);
  const contextPriceChartData = processDataForContextPriceChart(models);

  const totalModels = models.length;
  const totalProviders = providers.length;

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
                  Back to Models
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Statistics and insights about OpenRouter models.
                </p>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatsCard 
            title="Total Models"
            value={totalModels.toLocaleString()}
            icon={<Shapes className="h-5 w-5 text-muted-foreground" />}
          />
          <StatsCard 
            title="Total Providers"
            value={totalProviders.toLocaleString()}
            icon={<BarChart3 className="h-5 w-5 text-muted-foreground" />}
          />
        </div>

        {/* Charts */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <ModelsByProviderChart data={providerChartData} />
          <ContextPriceScatterPlot data={contextPriceChartData} />
        </div>
      </main>
    </div>
  );
}
