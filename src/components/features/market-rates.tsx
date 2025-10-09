"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Bitcoin, Gem, Coins, DollarSign, TrendingUp, Flame } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Search, ExternalLink } from "lucide-react";

type MarketItem = { name: string; price: string; change?: string };

async function fetchServerData(): Promise<MarketItem[]> {
  // Try primary endpoint (/api/market-rates), on failure fallback to /api/live-prices
  try {
    const res = await fetch('/api/market-rates', { cache: 'no-store' });
    if (!res.ok) throw new Error('fetch failed');
    const json = await res.json();
    if (!json?.ok) throw new Error(String(json?.error || 'bad response'));
    return json.data as MarketItem[];
  } catch {
    const res2 = await fetch('/api/live-prices', { cache: 'no-store' });
    if (!res2.ok) throw new Error('fetch failed');
    const json2 = await res2.json();
    if (!json2?.success || !json2?.data) throw new Error(String(json2?.error || 'bad response'));
    const items: MarketItem[] = Object.entries(json2.data as Record<string, { price: string; change: string | null }>).
      map(([key, v]) => ({ name: key, price: v.price, change: v.change || undefined }));
    return items;
  }
}

export default function MarketRates(): JSX.Element {
  const [items, setItems] = useState<MarketItem[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return items;
    try {
      const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
      return items.filter((i) => regex.test(i.name));
    } catch {
      return items;
    }
  }, [items, query]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      let data = await fetchServerData();
      if (!data || data.length === 0) {
        // Try TGJU route as last fallback (card list)
        try {
          const r = await fetch('/api/tgju', { cache: 'no-store' });
          if (r.ok) {
            const j = await r.json();
            if (Array.isArray(j?.data)) {
              data = (j.data as any[]).map((x) => ({ name: x.title, price: x.price, change: x.change })) as MarketItem[];
            }
          }
        } catch {}
      }
      if (!data || data.length === 0) throw new Error('داده‌ای یافت نشد');
      setItems(data);
      setLastUpdated(Date.now());
    } catch (e: any) {
      setError(e?.message || "خطا در دریافت داده");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, 60000);
    return () => clearInterval(id);
  }, []);

  const goldGlow = "shadow-[0_0_40px_#facc1522] border-yellow-500/30";
  const headerBg = "bg-gradient-to-br from-yellow-500/15 via-amber-400/10 to-yellow-300/15";
  const ringGold = "focus:ring-yellow-500/40";

  const getChangeClass = (change?: string) => {
    if (!change) return "text-muted-foreground";
    const c = change.replace(/\s/g,"");
    if (c.startsWith("-") || /▼|down|کاه/.test(c)) return "text-rose-400";
    if (c.startsWith("+") || /▲|up|افز/.test(c)) return "text-emerald-400";
    return "text-muted-foreground";
  };

  const getUnitForName = (name: string): string => {
    const n = name.trim();
    // Stock indices
    if (/شاخص/i.test(n) || /بورس/i.test(n) || /فرابورس/i.test(n)) return "شاخص";
    // USD-based items (explicit): Bitcoin, Brent, Ounce
    if (/\bbitcoin\b/i.test(n) || /بیت\s*کو?ی?ن/i.test(n)) return "دلار";
    if (/brent/i.test(n) || /نفت\s*برنت/i.test(n)) return "دلار";
    if (/\bounce\b/i.test(n) || /انس/i.test(n)) return "دلار";
    // Explicit Rial group
    if (/سکه\s*امامی/i.test(n) || /emami/i.test(n)) return "ریال";
    if (/طلای?\s*18|گرم\s*18|18\s*عیار|gold\s*18/i.test(n)) return "ریال";
    if (/tether|usdt|تتر/i.test(n)) return "ریال";
    if (/^\s*دلار\s*$/i.test(n) || /^\s*dollar\s*$/i.test(n)) return "ریال";
    // Default
    return "ریال";
  };

  const getIconData = (name: string): { icon: React.ReactNode; lightBg: string; darkBg: string; ring: string } => {
    const n = name.trim();
    if (/\bbitcoin\b/i.test(n) || /بیت\s*کو?ی?ن/i.test(n)) return { icon: <Bitcoin className="w-5 h-5 text-orange-700 dark:text-orange-200" />, lightBg: "bg-orange-50", darkBg: "bg-gradient-to-br from-orange-500/30 to-amber-400/20", ring: "ring-orange-200 dark:ring-white/20" };
    if (/brent/i.test(n) || /نفت\s*برنت/i.test(n)) return { icon: <Flame className="w-5 h-5 text-blue-700 dark:text-blue-200" />, lightBg: "bg-sky-50", darkBg: "bg-gradient-to-br from-sky-500/30 to-blue-400/20", ring: "ring-sky-200 dark:ring-white/20" };
    if (/سکه\s*امامی/i.test(n) || /emami/i.test(n)) return { icon: <Coins className="w-5 h-5 text-amber-700 dark:text-amber-200" />, lightBg: "bg-amber-50", darkBg: "bg-gradient-to-br from-amber-500/30 to-yellow-400/20", ring: "ring-amber-200 dark:ring-white/20" };
    if (/انس|ounce/i.test(n)) return { icon: <Gem className="w-5 h-5 text-yellow-700 dark:text-yellow-200" />, lightBg: "bg-yellow-50", darkBg: "bg-gradient-to-br from-yellow-500/30 to-amber-400/20", ring: "ring-yellow-200 dark:ring-white/20" };
    if (/طلای?\s*18|18\s*عیار|gold\s*18/i.test(n)) return { icon: <Gem className="w-5 h-5 text-yellow-700 dark:text-yellow-200" />, lightBg: "bg-yellow-50", darkBg: "bg-gradient-to-br from-yellow-500/30 to-amber-400/20", ring: "ring-yellow-200 dark:ring-white/20" };
    if (/tether|usdt|تتر|dollar|دلار/i.test(n)) return { icon: <DollarSign className="w-5 h-5 text-emerald-700 dark:text-emerald-200" />, lightBg: "bg-emerald-50", darkBg: "bg-gradient-to-br from-emerald-500/30 to-teal-400/20", ring: "ring-emerald-200 dark:ring-white/20" };
    if (/شاخص|بورس|فرابورس/i.test(n)) return { icon: <TrendingUp className="w-5 h-5 text-pink-700 dark:text-pink-200" />, lightBg: "bg-pink-50", darkBg: "bg-gradient-to-br from-pink-500/30 to-rose-400/20", ring: "ring-pink-200 dark:ring-white/20" };
    return { icon: <TrendingUp className="w-5 h-5 text-primary" />, lightBg: "bg-primary/10", darkBg: "bg-gradient-to-br from-primary/20 to-accent/10", ring: "ring-primary/30" };
  };

  return (
    <div dir="rtl" className={`relative rounded-3xl border ${goldGlow} glass-effect overflow-hidden`}>
      <div className={`absolute inset-0 ${headerBg} animate-pulse dark:opacity-100 opacity-60`} />
      <div className="relative">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-500/40 to-yellow-300/20 border border-yellow-400/40 shadow-[0_0_25px_#facc1566] flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <div>
              <CardTitle className="text-2xl font-display text-foreground drop-shadow">نرخ بازار (لحظه‌ای)</CardTitle>
              <div className="mt-1 text-xs text-muted-foreground">
                {lastUpdated ? `آخرین بروزرسانی: ${new Date(lastUpdated).toLocaleTimeString('fa-IR')}` : 'در حال بروزرسانی...'}
              </div>
            </div>
            <Badge variant="secondary" className="ml-2 bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border border-yellow-400/30">VIP</Badge>
          </div>
          <div className="flex items-center gap-2">
            <a
              href="https://www.iranjib.ir/showgroup/23/realtime_price/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
              title="منبع: ایران‌جیب"
            >
              منبع <ExternalLink className="w-4 h-4" />
            </a>
            <button
              className={`inline-flex items-center gap-1 text-sm px-3 py-2 rounded-md border border-yellow-500/30 bg-white/50 dark:bg-black/30 hover:bg-yellow-500/10 transition ${ringGold}`}
              onClick={load}
              disabled={loading}
              title="به‌روزرسانی"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
              بروزرسانی
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 pb-6">
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی آیتم..."
              className="pr-9 bg-white/60 dark:bg-black/30 border border-yellow-500/30 rounded-xl placeholder-muted-foreground"
            />
            <button
              onClick={() => { try { window.dispatchEvent(new Event('pwa:showInstall')); } catch {} }}
              className="absolute left-2 top-1/2 -translate-y-1/2 text-xs px-3 py-1.5 rounded-lg border bg-white/70 dark:bg-black/30 hover:bg-white/90 text-foreground"
            >
              نصب اپ
            </button>
          </div>
          {error && (
            <div className="text-sm text-rose-400">❌ {error}</div>
          )}
          <div className="rounded-2xl border border-yellow-500/30 bg-white/50 dark:bg-black/20 backdrop-blur-sm overflow-hidden">
            <ScrollArea className="max-h-[60vh]">
              <table className="w-full text-sm">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-foreground">
                    <th className="text-right p-3 font-semibold">آیتم</th>
                    <th className="text-right p-3 font-semibold">قیمت</th>
                    <th className="text-right p-3 font-semibold">واحد</th>
                    <th className="text-right p-3 font-semibold">تغییر</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((it, idx) => (
                    <tr key={idx} className="border-t border-yellow-500/20 hover:bg-yellow-500/5 transition-colors">
                      <td className="p-3 whitespace-pre-wrap text-foreground/90">
                        {(() => { const d = getIconData(it.name); return (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-md border mr-2 align-middle ${d.lightBg} dark:${d.darkBg} border-black/10 dark:border-white/10 shadow-sm ring-1 ${d.ring} dark:bg-white/10 dark:shadow-[0_0_0_1px_rgba(255,255,255,0.08)] transition-colors`}> 
                            {d.icon}
                          </span>
                        ); })()}
                        {it.name}
                      </td>
                      <td className="p-3 font-bold text-foreground drop-shadow num-farsi">{it.price}</td>
                      <td className="p-3 text-muted-foreground">{getUnitForName(it.name)}</td>
                      <td className={`p-3 font-medium ${getChangeClass(it.change)}`}>{it.change || "-"}</td>
                    </tr>
                  ))}
                  {!loading && filtered.length === 0 && (
                    <tr>
                      <td className="p-6 text-center text-yellow-200/70" colSpan={4}>موردی یافت نشد</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </ScrollArea>
          </div>
          <div className="text-xs text-muted-foreground">
            بروزرسانی خودکار هر ۶۰ ثانیه. در صورت مسدود بودن منبع، از مسیر جایگزین استفاده می‌شود.
          </div>
        </CardContent>
        {loading && (
          <div className="absolute inset-0 bg-white/50 dark:bg-black/30 backdrop-blur-sm flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-yellow-400/70 border-t-transparent animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}


