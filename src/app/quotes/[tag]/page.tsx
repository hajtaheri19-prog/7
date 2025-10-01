"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';

type QuoteItem = { id: number; author: string; text: string; tags?: string[] };

export default function QuotesByTagPage() {
  const params = useParams<{ tag: string }>();
  const router = useRouter();
  const tag = decodeURIComponent(params.tag);
  const [mounted, setMounted] = useState(false);
  const [all, setAll] = useState<QuoteItem[]>([]);

  useEffect(() => {
    setMounted(true);
    fetch('/data/quotes.json').then(r => r.json()).then((data: QuoteItem[]) => setAll(Array.isArray(data) ? data : [])).catch(()=>setAll([]));
  }, []);

  const list = useMemo(() => all.filter(q => (q.tags || []).includes(tag)), [all, tag]);

  const containerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = containerRef.current; if (!node) return;
    node.animate([
      { opacity: 0, transform: 'translateY(20px) blur(2px)' },
      { opacity: 1, transform: 'translateY(0) blur(0)' }
    ], { duration: 500, easing: 'ease-out' });
  }, [tag]);

  if (!mounted) {
    return <div className="p-4 sm:p-6 lg:p-8"><div className="glass-effect rounded-3xl p-6 mb-6 animate-pulse" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-screen-lg space-y-6" ref={containerRef}>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-display">#{tag}</h1>
          <button className="text-xs text-yellow-300 hover:underline" onClick={()=>router.push('/quotes')}>بازگشت</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {list.map(q => (
            <Card key={q.id} className="glass-effect p-5 bg-black/30 border-yellow-500/20 shadow-[inset_0_0_60px_rgba(255,255,255,0.03)]">
              <div className="text-foreground leading-7">{q.text}</div>
              <div className="mt-2 text-xs text-muted-foreground">— {q.author}</div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


