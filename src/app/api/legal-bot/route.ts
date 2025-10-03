import { NextRequest, NextResponse } from 'next/server';

// Groq API key (user-provided). Prefer ENV if present.
const GROQ_API_KEY = process.env.GROQ_API_KEY || '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';
// Use a widely available model on Groq
const MODEL = 'llama3-70b-8192';

// Light per-IP rate limiter
const MAX_REQ_PER_HOUR = 20;
const WINDOW_MS = 60 * 60 * 1000;
const ipHits: Map<string, { count: number; resetAt: number }> = new Map();

function clientIp(req: NextRequest) {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.ip || 'unknown';
}

function checkLimit(ip: string) {
  const now = Date.now();
  const rec = ipHits.get(ip);
  if (!rec || now > rec.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (rec.count < MAX_REQ_PER_HOUR) {
    rec.count += 1;
    return { ok: true };
  }
  return { ok: false, retryAfter: Math.ceil((rec.resetAt - now) / 1000) };
}

export async function POST(req: NextRequest) {
  try {
    const ip = clientIp(req);
    const lim = checkLimit(ip);
    if (!lim.ok) {
      return NextResponse.json({ error: 'rate_limited', retry_after: lim.retryAfter }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const prompt = (body?.prompt || '').toString().trim();
    const history = Array.isArray(body?.history) ? body.history : [];
    if (!prompt) return NextResponse.json({ error: 'invalid_prompt' }, { status: 400 });

    const system = `تو یک دستیار حقوقی و مالی ایرانی هستی. پاسخ‌ها:
- دقیق، محترمانه، کوتاه و مرحله‌بندی شده باشد.
- قوانین ایران را در نظر بگیر؛ اگر مطمئن نیستی، عدم قطعیت را ذکر کن و پیشنهاد مراجعه به متخصص بده.
- از ارائه مشاوره غیرقانونی، پیش‌بینی قطعی یا اطلاعات پزشکی خودداری کن.
- اگر سوال مبهم است، چند پرسش روشن‌ساز مطرح کن.`;

    const messages = [
      { role: 'system', content: system },
      ...history,
      { role: 'user', content: prompt }
    ];

    if (!GROQ_API_KEY) {
      return NextResponse.json({ error: 'config_error', message: 'GROQ_API_KEY not set' }, { status: 500 });
    }

    const resp = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.2,
        max_tokens: 800,
        stream: false,
      })
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json({ error: 'upstream_error', status: resp.status, details: text.slice(0, 1000) }, { status: 502 });
    }
    const data = await resp.json();
    const content = data?.choices?.[0]?.message?.content || '';
    return NextResponse.json({ reply: content });
  } catch (err: any) {
    return NextResponse.json({ error: 'server_error', message: err?.message || 'Unknown error' }, { status: 500 });
  }
}


