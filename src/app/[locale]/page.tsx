import Link from 'next/link';
import LanguageSelector from '@/components/dashboard/LanguageSelector';
import ModelBrowser from '@/components/models/ModelBrowser';
import { t, type Locale } from '@/lib/i18n';
import { fetchModels, fetchProviders } from '@/lib/openrouter';

interface HomePageProps {
  params: Promise<{ locale: Locale }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const [models, providers] = await Promise.all([
    fetchModels(),
    fetchProviders(),
  ]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">{t('models.title', locale)}</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t('models.subtitle', locale)}
              </p>
              <div className="mt-2">
                <Link 
                  href={`/${locale}/providers`}
                  className="text-xs text-primary hover:underline"
                >
                  Browse Providers →
                </Link>
              </div>
            </div>
            <LanguageSelector />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        <ModelBrowser 
          initialModels={models}
          initialProviders={providers}
          locale={locale}
        />
      </main>
    </div>
  );
}