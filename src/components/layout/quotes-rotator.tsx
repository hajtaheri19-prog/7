"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Quote } from 'lucide-react';
type QuoteItem = { body: string; author: string; id?: number; text?: string; tags?: string[] };

export default function QuotesRotator({ effect = 'flip3d', mode = 'random' }: { effect?: 'fade' | 'parallax' | 'flip3d', mode?: 'random' | 'daily' }) {
  const [mounted, setMounted] = useState(false);
  const [all, setAll] = useState<QuoteItem[]>([]);
  const [index, setIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const timerRef = useRef<number | null>(null);

  const current = useMemo(() => all.length ? all[index % all.length] : undefined, [all, index]);
  
  // متن کوتاه برای موبایل
  const getDisplayText = (text: string) => {
    if (!text) return '';
    const maxLength = 120; // حداکثر 120 کاراکتر برای نمایش کوتاه
    if (text.length <= maxLength || isExpanded) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };
  
  const shouldShowExpandButton = current?.text && current.text.length > 120;

  useEffect(() => {
    setMounted(true);
    fetch('/quotes.json')
      .then(r => {
        console.log('Fetch response:', r.status);
        return r.json();
      })
      .then((data: QuoteItem[]) => {
        console.log('Quotes data loaded:', data.length, 'items');
        const items = Array.isArray(data) ? data.map((item, idx) => ({ 
          ...item, 
          id: item.id || idx, 
          text: item.body || item.text || '', 
          author: item.author || ''
        })) : [];
        console.log('Processed items:', items.length);
        setAll(items);
        if (mode === 'daily') {
          const seed = new Date().toISOString().slice(0, 10);
          let hash = 0; for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
          setIndex(hash % (items.length || 1));
        } else {
          // non-repeat logic via localStorage
          try {
            const key = 'quotes_seen_ids';
            const seen: number[] = JSON.parse(localStorage.getItem(key) || '[]');
            const available = items.filter(q => !seen.includes(q.id || 0));
            const pool = available.length ? available : items;
            const pick = pool[Math.floor(Math.random() * (pool.length || 1))];
            setIndex(items.findIndex(q => (q.id || 0) === (pick.id || 0)));
            const nextSeen = available.length ? [...seen, pick.id || 0] : [pick.id || 0];
            localStorage.setItem(key, JSON.stringify(nextSeen.slice(-1000)));
          } catch {
            setIndex(Math.floor(Math.random() * (items.length || 1)));
          }
        }
      })
      .catch((error) => {
        console.error('Error loading quotes:', error);
        setAll([]);
      });
  }, [mode]);

  // Auto-rotation disabled - quotes only change on page refresh
  // useEffect(() => {
  //   if (!all.length || mode === 'daily') return;
  //   timerRef.current && window.clearInterval(timerRef.current);
  //   timerRef.current = window.setInterval(() => {
  //     setIndex(prev => (prev + 1) % all.length);
  //   }, 5000);
  //   return () => {
  //     if (timerRef.current) window.clearInterval(timerRef.current);
  //   };
  // }, [all.length, mode]);

  if (!mounted || !current) return null;

  return (
    <Card className="relative overflow-hidden rounded-2xl md:rounded-3xl border border-primary/20 bg-gradient-to-br from-background/60 via-background/40 to-background/60 dark:from-zinc-900/40 dark:via-black/30 dark:to-zinc-900/40 shadow-[0_8px_32px_rgba(0,0,0,0.12)] backdrop-blur-xl w-full max-w-full">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -inset-16 bg-[radial-gradient(50%_50%_at_30%_30%,rgba(106,62,171,0.08),transparent_70%),radial-gradient(40%_40%_at_70%_70%,rgba(139,92,246,0.06),transparent_70%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
      </div>
      <div className="relative p-4 sm:p-6 md:p-8 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/15 to-accent/10 shadow-[0_4px_16px_rgba(106,62,171,0.15)] flex items-center justify-center backdrop-blur-sm">
            <Quote className="w-4 h-4 md:w-5 md:h-5 text-primary/80" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm font-medium tracking-wide text-primary/90">✨ سخن بزرگان ✨</span>
            <span className="inline-block h-3 w-px bg-primary/30" />
            <span className="text-xs text-muted-foreground/80">روزانه الهام‌بخش</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className={
            effect === 'flip3d'
              ? "text-base md:text-lg leading-relaxed md:leading-loose text-foreground/95 animate-in fade-in font-medium [text-shadow:0_0_8px_rgba(106,62,171,0.08)]"
              : effect === 'parallax'
              ? "text-base md:text-lg leading-relaxed md:leading-loose text-foreground/95 animate-in fade-in font-medium [transform:translateY(2px)]"
              : "text-base md:text-lg leading-relaxed md:leading-loose text-foreground/95 animate-in fade-in font-medium slide-in-from-bottom-1"
          }>
            <span className="text-primary/70 align-middle text-lg md:text-xl">"</span>
            <span className="px-1">{getDisplayText(current.text || '')}</span>
            <span className="text-primary/70 align-middle text-lg md:text-xl">"</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/15 border border-primary/25 text-xs text-primary/80 flex items-center justify-center shadow-[0_2px_8px_rgba(106,62,171,0.15)]">
                {(current.author || 'ح').slice(0, 1)}
              </div>
              <div className="text-sm text-muted-foreground font-medium">— {current.author || 'حکیم'}</div>
            </div>
            {shouldShowExpandButton && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center px-3 py-1.5 text-xs rounded-lg border border-primary/25 bg-primary/5 text-primary/80 hover:bg-primary/10 transition-colors"
              >
                {isExpanded ? 'کمتر' : 'مشاهده کامل'}
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="absolute inset-x-6 bottom-3 h-px bg-gradient-to-r from-transparent via-primary/15 to-transparent" />
    </Card>
  );
}


