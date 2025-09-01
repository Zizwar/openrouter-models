export interface OpenRouterModel {
  id: string;
  name: string;
  canonical_slug?: string;
  description?: string;
  context_length: number;
  architecture: {
    modality: string;
    tokenizer: string;
    instruct_type?: string;
  };
  pricing: {
    prompt: string;
    completion: string;
    request?: string;
    image?: string;
  };
  top_provider: {
    context_length: number;
    max_completion_tokens?: number;
    is_moderated: boolean;
  };
  per_request_limits?: {
    prompt_tokens: string;
    completion_tokens: string;
  };
  created: number;
}

export interface OpenRouterResponse {
  data: OpenRouterModel[];
}

export async function fetchModels(): Promise<OpenRouterModel[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: OpenRouterResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching OpenRouter models:', error);
    return [];
  }
}

export function formatPrice(price: string): string {
  const numPrice = parseFloat(price);
  if (numPrice === 0) return 'Free';
  if (numPrice < 0.000001) return `$${(numPrice * 1000000).toFixed(2)}/1M tokens`;
  if (numPrice < 0.001) return `$${(numPrice * 1000).toFixed(2)}/1K tokens`;
  return `$${numPrice.toFixed(6)}/token`;
}

export function getModelProvider(id: string): string {
  if (id.includes('openai')) return 'OpenAI';
  if (id.includes('anthropic')) return 'Anthropic';
  if (id.includes('google')) return 'Google';
  if (id.includes('meta')) return 'Meta';
  if (id.includes('mistral')) return 'Mistral';
  if (id.includes('cohere')) return 'Cohere';
  if (id.includes('perplexity')) return 'Perplexity';
  return 'Other';
}

export function formatContextLength(length: number): string {
  if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`;
  if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
  return length.toString();
}

// Provider types
export interface OpenRouterProvider {
  name: string;
  slug: string;
  privacy_policy_url?: string;
  terms_of_service_url?: string;
  status_page_url?: string;
}

export interface OpenRouterProvidersResponse {
  data: OpenRouterProvider[];
}

// Model endpoints types  
export interface ModelEndpoint {
  id: string;
  name: string;
  provider: string;
  pricing: {
    prompt: string;
    completion: string;
    request?: string;
    image?: string;
  };
  context_length: number;
  is_moderated: boolean;
  max_completion_tokens?: number;
}

export interface ModelEndpointsResponse {
  data: ModelEndpoint[];
}

// Fetch providers from OpenRouter API
export async function fetchProviders(): Promise<OpenRouterProvider[]> {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/providers', {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: OpenRouterProvidersResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching OpenRouter providers:', error);
    return [];
  }
}

// Fetch model endpoints
export async function fetchModelEndpoints(author: string, slug: string): Promise<ModelEndpoint[]> {
  try {
    const response = await fetch(`https://openrouter.ai/api/v1/models/${author}/${slug}/endpoints`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: ModelEndpointsResponse = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching model endpoints:', error);
    return [];
  }
}

// Enhanced provider detection function
export function getModelProviderFromProviders(modelId: string, providers: OpenRouterProvider[]): OpenRouterProvider | null {
  for (const provider of providers) {
    if (modelId.toLowerCase().includes(provider.slug.toLowerCase()) || 
        modelId.toLowerCase().includes(provider.name.toLowerCase())) {
      return provider;
    }
  }
  return null;
}

// Get model author and slug from model ID
export function getModelAuthorAndSlug(modelId: string): { author: string; slug: string } | null {
  const parts = modelId.split('/');
  if (parts.length >= 2) {
    return {
      author: parts[0],
      slug: parts.slice(1).join('/')
    };
  }
  return null;
}