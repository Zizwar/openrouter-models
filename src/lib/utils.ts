import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { OpenRouterModel, getModelProvider } from "./openrouter";
import { ProviderChartData } from "@/components/dashboard/ModelsByProviderChart";
import { ContextPriceChartData } from "@/components/dashboard/ContextPriceScatterPlot";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function processDataForProviderChart(models: OpenRouterModel[]): ProviderChartData[] {
  const providerCounts = new Map<string, number>();

  models.forEach(model => {
    const provider = getModelProvider(model.id);
    providerCounts.set(provider, (providerCounts.get(provider) || 0) + 1);
  });

  return Array.from(providerCounts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function processDataForContextPriceChart(models: OpenRouterModel[]): ContextPriceChartData[] {
  return models
    .filter(model => model.context_length > 0 && parseFloat(model.pricing.prompt) > 0)
    .map(model => ({
      name: model.name,
      context: model.context_length,
      price: parseFloat(model.pricing.prompt) * 1000, // Price per 1k tokens
    }));
}
