"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { useParams, useSearchParams } from 'next/navigation';
import Header from '@/components/layout/header';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Home, ArrowLeft, Loader2 } from 'lucide-react';

const LoadingFallback = () => (
  <div className="flex items-center justify-center p-12 text-muted-foreground">
    <Loader2 className="h-6 w-6 animate-spin mr-2" /> در حال بارگذاری ابزار...
  </div>
);

const components: Record<string, React.ComponentType | null> = {
  'text-summarizer': dynamic(() => import('@/components/features/text-summarizer'), { ssr: false, loading: LoadingFallback }),
  'legal-financial-chatbot': dynamic(() => import('@/components/features/legal-financial-chatbot'), { ssr: false, loading: LoadingFallback }),
  'social-post-generator': dynamic(() => import('@/components/features/social-post-generator'), { ssr: false, loading: LoadingFallback }),
  'ocr-extractor': dynamic(() => import('@/components/features/ocr-extractor'), { ssr: false, loading: LoadingFallback }),
  'pdf-word-converter': dynamic(() => import('@/components/features/pdf-word-converter'), { ssr: false, loading: LoadingFallback }),
  'pdf-image-converter': dynamic(() => import('@/components/features/pdf-image-converter'), { ssr: false, loading: LoadingFallback }),
  'unit-converter': dynamic(() => import('@/components/features/unit-converter'), { ssr: false, loading: LoadingFallback }),
  'currency-converter': dynamic(() => import('@/components/features/currency-converter'), { ssr: false, loading: LoadingFallback }),
  'date-converter': dynamic(() => import('@/components/features/date-converter'), { ssr: false, loading: LoadingFallback }),
  'rial-toman-converter': dynamic(() => import('@/components/features/rial-toman-converter'), { ssr: false, loading: LoadingFallback }),
  'number-to-words': dynamic(() => import('@/components/features/number-to-words-converter'), { ssr: false, loading: LoadingFallback }),
  'number-system': dynamic(() => import('@/components/features/number-system-converter'), { ssr: false, loading: LoadingFallback }),
  'binary-converter': dynamic(() => import('@/components/features/binary-converter'), { ssr: false, loading: LoadingFallback }),
  'base-converter': dynamic(() => import('@/components/features/base-converter'), { ssr: false, loading: LoadingFallback }),
  'color-converter': dynamic(() => import('@/components/features/color-converter'), { ssr: false, loading: LoadingFallback }),
  'base64-converter': dynamic(() => import('@/components/features/base64-converter'), { ssr: false, loading: LoadingFallback }),
  'age-calculator': dynamic(() => import('@/components/features/age-calculator'), { ssr: false, loading: LoadingFallback }),
  'stopwatch': dynamic(() => import('@/components/features/stopwatch'), { ssr: false, loading: LoadingFallback }),
  'countdown-timer': dynamic(() => import('@/components/features/countdown-timer'), { ssr: false, loading: LoadingFallback }),
  'events-calendar': dynamic(() => import('@/components/features/events-calendar'), { ssr: false, loading: LoadingFallback }),
  'iran-time': dynamic(() => import('@/components/features/iran-time'), { ssr: false, loading: LoadingFallback }),
  'online-alarm': dynamic(() => import('@/components/features/online-alarm'), { ssr: false, loading: LoadingFallback }),
  'gpa-calculator': dynamic(() => import('@/components/features/gpa-calculator'), { ssr: false, loading: LoadingFallback }),
  'crypto-converter': dynamic(() => import('@/components/features/crypto-converter'), { ssr: false, loading: LoadingFallback }),
  'loan-calculator': dynamic(() => import('@/components/features/loan-calculator'), { ssr: false, loading: LoadingFallback }),
  'deposit-calculator': dynamic(() => import('@/components/features/deposit-calculator'), { ssr: false, loading: LoadingFallback }),
  'savings-calculator': dynamic(() => import('@/components/features/savings-calculator'), { ssr: false, loading: LoadingFallback }),
  'percentage-calculator': dynamic(() => import('@/components/features/percentage-calculator'), { ssr: false, loading: LoadingFallback }),
  'vat-calculator': dynamic(() => import('@/components/features/vat-calculator'), { ssr: false, loading: LoadingFallback }),
  'morse-converter': dynamic(() => import('@/components/features/morse-converter'), { ssr: false, loading: LoadingFallback }),
  'invoice-generator': dynamic(() => import('@/components/features/invoice-generator'), { ssr: false, loading: LoadingFallback }),
  'gold-coin-calculator': dynamic(() => import('@/components/features/gold-coin-calculator'), { ssr: false, loading: LoadingFallback }),
  'factorial-calculator': dynamic(() => import('@/components/features/factorial-calculator'), { ssr: false, loading: LoadingFallback }),
  'square-root-calculator': dynamic(() => import('@/components/features/square-root-calculator'), { ssr: false, loading: LoadingFallback }),
  'mehrieh-calculator': dynamic(() => import('@/components/features/mehrieh-calculator'), { ssr: false, loading: LoadingFallback }),
  'execution-fee': dynamic(() => import('@/components/features/execution-fee'), { ssr: false, loading: LoadingFallback }),
  'attorney-fee': dynamic(() => import('@/components/features/attorney-fee'), { ssr: false, loading: LoadingFallback }),
  'workout-timer': dynamic(() => import('@/components/features/workout-timer'), { ssr: false, loading: LoadingFallback }),
  'bmi-calculator': dynamic(() => import('@/components/features/bmi-calculator'), { ssr: false, loading: LoadingFallback }),
  'beck-depression-test': dynamic(() => import('@/components/features/beck-depression-test'), { ssr: false, loading: LoadingFallback }),
  'happiness-test': dynamic(() => import('@/components/features/happiness-test'), { ssr: false, loading: LoadingFallback }),
  'self-confidence-test': dynamic(() => import('@/components/features/self-confidence-test'), { ssr: false, loading: LoadingFallback }),
  'tic-tac-toe': dynamic(() => import('@/components/features/tic-tac-toe'), { ssr: false, loading: LoadingFallback }),
  'guess-the-number': dynamic(() => import('@/components/features/guess-the-number'), { ssr: false, loading: LoadingFallback }),
  'memory-game': dynamic(() => import('@/components/features/memory-game'), { ssr: false, loading: LoadingFallback }),
  '2048': dynamic(() => import('@/components/features/game-2048'), { ssr: false, loading: LoadingFallback }),
  'sheba-converter': dynamic(() => import('@/components/features/sheba-converter'), { ssr: false, loading: LoadingFallback }),
  'national-id-validator': dynamic(() => import('@/components/features/national-id-validator'), { ssr: false, loading: LoadingFallback }),
  'link-shortener': dynamic(() => import('@/components/features/link-shortener'), { ssr: false, loading: LoadingFallback }),
  'vehicle-plate-identifier': dynamic(() => import('@/components/features/vehicle-plate-identifier'), { ssr: false, loading: LoadingFallback }),
  'random-number': dynamic(() => import('@/components/features/random-number-generator'), { ssr: false, loading: LoadingFallback }),
  'password-generator': dynamic(() => import('@/components/features/password-generator'), { ssr: false, loading: LoadingFallback }),
  'qr-code-generator': dynamic(() => import('@/components/features/qr-code-generator'), { ssr: false, loading: LoadingFallback }),
  'qr-code-reader': dynamic(() => import('@/components/features/qr-code-reader'), { ssr: false, loading: LoadingFallback }),
  'image-optimizer': dynamic(() => import('@/components/features/image-optimizer'), { ssr: false, loading: LoadingFallback }),
  'text-analyzer': dynamic(() => import('@/components/features/text-analyzer'), { ssr: false, loading: LoadingFallback }),
  'space-remover': dynamic(() => import('@/components/features/space-remover'), { ssr: false, loading: LoadingFallback }),
  'distance-calculator': dynamic(() => import('@/components/features/distance-calculator'), { ssr: false, loading: LoadingFallback }),
  'signature-generator': dynamic(() => import('@/components/features/signature-generator'), { ssr: false, loading: LoadingFallback }),
  'robots-txt-generator': dynamic(() => import('@/components/features/robots-txt-generator'), { ssr: false, loading: LoadingFallback }),
  'ip-detector': dynamic(() => import('@/components/features/ip-detector'), { ssr: false, loading: LoadingFallback }),
  'lottery-tool': dynamic(() => import('@/components/features/lottery-tool'), { ssr: false, loading: LoadingFallback }),
  'post-tracker': null,
  'whois-lookup': dynamic(() => import('@/components/features/whois-lookup'), { ssr: false, loading: LoadingFallback }),
  'favicon-generator': dynamic(() => import('@/components/features/favicon-generator'), { ssr: false, loading: LoadingFallback }),
  'utm-builder': dynamic(() => import('@/components/features/utm-builder'), { ssr: false, loading: LoadingFallback }),
  'whatsapp-link': dynamic(() => import('@/components/features/whatsapp-link'), { ssr: false, loading: LoadingFallback }),
  'lorem-ipsum': dynamic(() => import('@/components/features/lorem-ipsum'), { ssr: false, loading: LoadingFallback }),
};

export default function ToolPage() {
  const { id } = useParams<{ id: string }>();
  const search = useSearchParams();
  const section = search?.get('section');
  const Comp = components[id] || null;
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl space-y-6">
          <nav className="text-sm text-muted-foreground flex items-center gap-2 glass-effect rounded-2xl p-4">
            <Link href="/" className="hover:text-foreground inline-flex items-center gap-1">
              <Home className="w-4 h-4" /> خانه
            </Link>
            <span>/</span>
            <span className="text-foreground">{section ? 'جعبه ابزار' : 'ابزار'}</span>
            <span>/</span>
            <span className="text-foreground">{id}</span>
            <span className="ml-auto" />
            <Link href={section ? `/#section-${section}` : '/'} className="inline-flex items-center gap-1 hover:underline">
              بازگشت
              <ArrowLeft className="w-4 h-4" />
            </Link>
          </nav>

          {!Comp ? (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-lg">این ابزار موجود نیست یا خارجی است.</CardTitle>
              </CardHeader>
            </Card>
          ) : (
            <div className="glass-effect rounded-3xl">
              <Comp />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}


