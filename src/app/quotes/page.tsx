"use client";

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ModeSelector from '@/components/layout/mode-selector';

type QuoteItem = { id: number; author: string; text: string; tags?: string[]; category?: string };

function useInfiniteScroll(callback: () => void) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const node = sentinelRef.current; if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) callback();
      });
    }, { rootMargin: '400px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, [callback]);
  return { sentinelRef };
}

export default function QuotesPage() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<'direct' | 'categories' | null>(null);
  const [all, setAll] = useState<QuoteItem[]>([]);
  const [visible, setVisible] = useState(30);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = window.localStorage.getItem('quotesMode') as 'direct' | 'categories' | null;
      if (saved) setMode(saved);
    } catch {}
    fetch('/data/quotes.json').then(r => r.json()).then((data: QuoteItem[]) => setAll(data || [])).catch(()=>setAll([]));
  }, []);

  const categories = useMemo(() => {
    const map = new Map<string, number>();
    all.forEach(q => (q.tags || []).forEach(t => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries()).sort((a,b) => b[1]-a[1]).slice(0, 24).map(([name, count]) => ({ name, count }));
  }, [all]);

  const filtered = useMemo(() => {
    let res = all;
    if (query.trim()) {
      const q = query.trim();
      res = res.filter(i => i.text.includes(q) || i.author.includes(q));
    }
    if (category) {
      res = res.filter(i => (i.tags || []).includes(category));
    }
    return res;
  }, [all, query, category]);

  const { sentinelRef } = useInfiniteScroll(() => setVisible(v => Math.min(v + 30, filtered.length)));

  const list = filtered.slice(0, visible);

  const handleSelectMode = (m: 'full' | 'categories') => {
    const mapped = m === 'full' ? 'direct' : 'categories';
    setMode(mapped);
    try { window.localStorage.setItem('quotesMode', mapped); } catch {}
  };

  if (!mounted) {
    return <div className="p-4 sm:p-6 lg:p-8"><div className="glass-effect rounded-3xl p-6 mb-6 animate-pulse" /></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {!mode && (
        <ModeSelector onSelect={handleSelectMode} />
      )}

      <div className="mx-auto max-w-screen-xl space-y-6">
        <div className="glass-effect rounded-3xl p-4 md:p-6 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0">
          <div className="flex flex-col md:flex-row gap-3 items-stretch">
            <Input placeholder="جستجو در جملات یا نویسنده..." value={query} onChange={(e)=>{ setQuery(e.target.value); setVisible(30); }} />
            <Button variant="secondary" onClick={()=>{ setQuery(''); setCategory(null); setVisible(30); }}>پاک کردن فیلتر</Button>
          </div>
        </div>

        {mode !== 'categories' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {list.map((q) => (
              <Card key={q.id} className="glass-effect p-5 bg-black/30 border-yellow-500/20 animate-in fade-in">
                <div className="text-foreground leading-7">{q.text}</div>
                <div className="mt-2 text-xs text-muted-foreground">— {q.author}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {(q.tags || []).slice(0,3).map((t, i) => (
                    <button key={i} onClick={()=>{ setCategory(t); setMode('categories'); setVisible(30); }} className="px-2 py-0.5 rounded-full text-[10px] bg-yellow-500/10 text-yellow-200 border border-yellow-500/20">#{t}</button>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        )}

        {mode === 'categories' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((c) => (
                <a key={c.name} href={`/quotes/${encodeURIComponent(c.name)}`} className="glass-effect rounded-2xl p-4 text-center bg-black/30 border-yellow-500/20 hover:bg-yellow-500/10 transition">
                  <div className="text-sm font-semibold text-foreground">{c.name}</div>
                  <div className="text-xs text-muted-foreground mt-1">{c.count} جمله</div>
                </a>
              ))}
            </div>
            {category && (
              <div className="text-xs text-yellow-200/80">فیلتر فعال: #{category}</div>
            )}
          </div>
        )}

        <div ref={sentinelRef} />
      </div>
    </div>
  );
}


