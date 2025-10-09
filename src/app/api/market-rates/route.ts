import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

type MarketItem = { name: string; price: string; change?: string };

const TARGET = 'https://www.iranjib.ir/showgroup/23/realtime_price/';
const SOURCES = [
  (u: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(u)}`,
  (u: string) => `https://thingproxy.freeboard.io/fetch/${encodeURIComponent(u)}`,
  // Try direct as a fallback in case proxies throttle
  (u: string) => u,
];

function parseIranJib(html: string): MarketItem[] {
  const $ = cheerio.load(html);
  const data: MarketItem[] = [];
  $('table.items_table tr')
    .not('.header')
    .not('.catsection')
    .each((_, el) => {
      const cols = $(el).find('td');
      if (cols.length >= 3) {
        const name = $(cols[0]).text().trim();
        const price = $(cols[1]).text().trim();
        const change = $(cols[2]).text().trim();
        if (name && price) data.push({ name, price, change });
      }
    });
  return data;
}

export async function GET() {
  let lastError: any = null;
  for (const wrap of SOURCES) {
    try {
      const url = wrap(TARGET);
      const res = await fetch(url, {
        cache: 'no-store',
        // Set headers to mimic a real browser to reduce blocking
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36',
          'Accept-Language': 'fa-IR,fa;q=0.9,en-US;q=0.6',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      } as RequestInit);
      if (!res.ok) throw new Error(String(res.status));
      const html = await res.text();
      if (!html || html.length < 500) throw new Error('empty');
      const data = parseIranJib(html);
      if (data.length === 0) throw new Error('no rows parsed');
      return NextResponse.json({ ok: true, data });
    } catch (e) {
      lastError = e;
    }
  }
  return NextResponse.json(
    { ok: false, error: String(lastError?.message || lastError || 'fetch failed') },
    { status: 502 }
  );
}



