'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'; // Assuming a textarea component exists
import { OpenRouterModel } from '@/lib/openrouter';
import { Play } from 'lucide-react';

interface ModelPlaygroundProps {
  model: OpenRouterModel;
}

export default function ModelPlayground({ model }: ModelPlaygroundProps) {
  const [apiKey, setApiKey] = useState('');
  const [prompt, setPrompt] = useState('Hello, who are you?');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRun = async () => {
    if (!apiKey) {
      setError('Please enter your OpenRouter API key.');
      return;
    }
    if (!prompt) {
      setError('Please enter a prompt.');
      return;
    }

    setIsLoading(true);
    setError('');
    setResponse('');

    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          "model": model.id,
          "messages": [
            { "role": "user", "content": prompt },
          ]
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error?.message || 'An unknown error occurred.');
      }

      const data = await res.json();
      setResponse(data.choices[0].message.content);

    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Try this Model (Playground)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">OpenRouter API Key</label>
          <Input 
            type="password"
            placeholder="sk-or-..."
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Your key is only used for this session and not stored.
          </p>
        </div>
        <div>
          <label className="text-sm font-medium">Prompt</label>
          <Textarea 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            rows={4}
          />
        </div>
        <Button onClick={handleRun} disabled={isLoading}>
          {isLoading ? 'Running...' : 'Run'}
        </Button>

        {(response || error) && (
          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Response</h4>
            {error && (
              <pre className="text-sm text-destructive bg-destructive/10 p-3 rounded-md whitespace-pre-wrap">
                {error}
              </pre>
            )}
            {response && (
              <pre className="text-sm bg-muted p-3 rounded-md whitespace-pre-wrap">
                {response}
              </pre>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
