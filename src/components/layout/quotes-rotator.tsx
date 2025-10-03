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
    <Card className="relative overflow-hidden rounded-3xl border border-yellow-500/30 bg-gradient-to-br from-zinc-900/80 via-black/70 to-zinc-900/80 shadow-[0_0_35px_#eab30822] backdrop-blur-xl">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -inset-20 bg-[radial-gradient(circle_at_top_left,rgba(234,179,8,0.12),transparent_50%)]" />
        <div className="absolute -inset-20 bg-[radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.08),transparent_50%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent" />
      </div>
      <div className="relative p-4 md:p-6 flex items-start gap-4">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl border border-yellow-400/40 bg-gradient-to-br from-yellow-500/40 to-yellow-300/20 shadow-[0_0_25px_#eab30855] flex items-center justify-center shrink-0 backdrop-blur-sm">
          <Quote className="w-5 h-5 md:w-6 md:h-6 text-yellow-100" />
        </div>
        <div className="flex-1">
          <div className="text-[11px] md:text-xs font-semibold text-yellow-200/90 tracking-wider mb-1">✨ سخن بزرگان ✨</div>
          <div className={
            effect === 'flip3d'
              ? "text-[15px] md:text-xl leading-8 text-foreground animate-in fade-in font-display font-semibold [text-shadow:0_0_20px_rgba(234,179,8,0.12)]"
              : effect === 'parallax'
              ? "text-[15px] md:text-xl leading-8 text-foreground animate-in fade-in [transform:translateY(4px)] font-display font-semibold"
              : "text-[15px] md:text-xl leading-8 text-foreground animate-in fade-in slide-in-from-bottom-1 font-display font-semibold"
          }>
            <span className="text-yellow-400/70 align-middle">“</span>
            {getDisplayText(current.text || '')}
            <span className="text-yellow-400/70 align-middle">”</span>
          </div>
          {shouldShowExpandButton && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="mt-2 text-xs text-yellow-300/80 hover:text-yellow-200 transition-colors duration-200 underline"
            >
              {isExpanded ? 'کمتر' : 'مشاهده کامل'}
            </button>
          )}
          <div className="mt-3 flex items-center gap-3">
            <div className="w-6 h-6 rounded-full bg-yellow-500/20 border border-yellow-400/30 text-[10px] text-yellow-100 flex items-center justify-center">
              {(current.author || 'ح').slice(0, 1)}
            </div>
            <div className="text-xs md:text-sm text-yellow-300/90 font-semibold">— {current.author || 'حکیم'}</div>
          </div>
        </div>
      </div>
      <div className="absolute inset-x-8 bottom-2 h-px bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent" />
    </Card>
  );
}


