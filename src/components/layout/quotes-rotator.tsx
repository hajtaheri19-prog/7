"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Quote } from 'lucide-react';
type QuoteItem = { body: string; author: string; id?: number; text?: string; tags?: string[] };

export default function QuotesRotator({ effect = 'fade', mode = 'random' }: { effect?: 'fade' | 'parallax' | 'flip3d', mode?: 'random' | 'daily' }) {
  const [mounted, setMounted] = useState(false);
  const [all, setAll] = useState<QuoteItem[]>([]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);

  const current = useMemo(() => all.length ? all[index % all.length] : undefined, [all, index]);

  useEffect(() => {
    setMounted(true);
    fetch('/quotes/2.json')
      .then(r => r.json())
      .then((data: QuoteItem[]) => {
        const items = Array.isArray(data) ? data.map((item, idx) => ({ ...item, id: item.id || idx, text: item.body || item.text || '' })) : [];
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
      .catch(() => setAll([]));
  }, [mode]);

  useEffect(() => {
    if (!all.length || mode === 'daily') return;
    timerRef.current && window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setIndex(prev => (prev + 1) % all.length);
    }, 5000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [all.length, mode]);

  if (!mounted || !current) return null;

  return (
    <Card className="glass-effect rounded-3xl p-5 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0 overflow-hidden shadow-[0_0_25px_#eab30822]">
      <div className={
        effect === 'parallax'
          ? "flex items-start gap-4 will-change-transform [transform:perspective(800px)]"
          : effect === 'flip3d'
          ? "flex items-start gap-4 will-change-transform transition-transform duration-700 [transform:perspective(800px)_rotateY(0deg)]"
          : "flex items-start gap-4"
      }>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/40 to-yellow-300/20 shadow-[0_0_18px_#eab30855] flex items-center justify-center animate-pulse">
          <Quote className="w-6 h-6 text-yellow-300" />
        </div>
        <div className={
          effect === 'parallax'
            ? "flex-1 overflow-hidden transition-transform duration-700 [transform:translateZ(0)_translateX(0)]"
            : "flex-1 overflow-hidden"
        }>
          <div className="text-sm text-yellow-200/80">سخن بزرگان</div>
          <div className={
            effect === 'parallax'
              ? "mt-1 text-lg leading-7 text-foreground animate-in fade-in [transform:translateY(6px)] shadow-[0_0_18px_#eab30822]"
              : effect === 'flip3d'
              ? "mt-1 text-lg leading-7 text-foreground animate-in fade-in"
              : "mt-1 text-lg leading-7 text-foreground animate-in fade-in slide-in-from-bottom-1"
          }>
            {current.text}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">— {current.author}</div>
          {current.tags && current.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {current.tags.slice(0, 3).map((t, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-[10px] bg-yellow-500/10 text-yellow-200 border border-yellow-500/20">
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}


