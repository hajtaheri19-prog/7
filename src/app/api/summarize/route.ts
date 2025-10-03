import { NextRequest, NextResponse } from 'next/server';

// Use env if available; otherwise fall back to provided key (user-supplied)
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBLI1Ha6lGcmQbCesD2Mu-QoaTKMDyyS_c';
// Prefer the latest alias for better availability
const MODEL = 'gemini-1.5-flash-latest';

// Simple in-memory per-IP rate limit (resets on cold start)
const RATE_LIMIT_COUNT = 5; // max requests
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const ipToHits: Map<string, { count: number; resetAt: number }> = new Map();

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.ip || 'unknown';
}

function checkRateLimit(ip: string): { ok: boolean; retryAfter?: number } {
  const now = Date.now();
  const rec = ipToHits.get(ip);
  if (!rec || now > rec.resetAt) {
    ipToHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { ok: true };
  }
  if (rec.count < RATE_LIMIT_COUNT) {
    rec.count += 1;
    return { ok: true };
  }
  return { ok: false, retryAfter: Math.max(0, rec.resetAt - now) };
}

export async function POST(req: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json({ error: 'config_error', message: 'GEMINI_API_KEY not set' }, { status: 500 });
    }
    const ip = getClientIp(req);
    const rl = checkRateLimit(ip);
    if (!rl.ok) {
      const secs = Math.ceil((rl.retryAfter || 0) / 1000);
      return NextResponse.json({ error: 'rate_limited', retry_after: secs }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const text: string = (body?.text || '').toString();
    if (!text || text.length < 100) {
      return NextResponse.json({ error: 'invalid_text', message: 'حداقل ۱۰۰ کاراکتر لازم است.' }, { status: 400 });
    }
    if (text.length > 10000) {
      return NextResponse.json({ error: 'too_long', message: 'حداکثر طول متن ۱۰٬۰۰۰ کاراکتر است.' }, { status: 413 });
    }

    const prompt = `خلاصه‌ای دقیق، ساختارمند و روان از متن زیر ارائه بده. حداکثر ۵-۷ خط، به زبان متن ورودی.
===
${text}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          role: 'user',
          parts: [{ text: prompt }]
        }]
      })
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json({ error: 'upstream_error', status: resp.status, details: errText.slice(0, 1000) }, { status: 502 });
    }

    const data = await resp.json();
    const summary: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
    if (!summary) {
      return NextResponse.json({ error: 'no_output' }, { status: 500 });
    }

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: 'server_error', message: error?.message || 'Unknown error' }, { status: 500 });
  }
}


