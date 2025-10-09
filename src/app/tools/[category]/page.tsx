"use client";

import React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/header';

// Duplicate lightweight category registry from homepage to avoid importing big components
import { BrainCircuit, FlaskConical, CalendarClock, Wallet, Gamepad2, User, ArrowLeft, Heart } from 'lucide-react';

type Tool = { id: string; title: string; icon: React.ReactNode; isWip?: boolean; isExternal?: boolean; href?: string };
type ToolCategory = { title: string; icon: React.ReactNode; tools: Tool[] };

const registry: ToolCategory[] = [
  { title: 'ابزارهای هوش مصنوعی', icon: <BrainCircuit className="h-6 w-6 text-primary-foreground" />, tools: [
    { id: 'text-summarizer', title: 'خلاصه‌ساز هوشمند متن', icon: <span /> },
    { id: 'legal-financial-chatbot', title: 'چت‌بات حقوقی و مالی', icon: <span /> },
    { id: 'social-post-generator', title: 'تولید پست شبکه‌های اجتماعی', icon: <span /> },
    { id: 'ocr-extractor', title: 'استخراج متن از تصویر و PDF', icon: <span /> },
    { id: 'contract-generator', title: 'مولد قرارداد هوشمند', icon: <span />, isWip: true },
    { id: 'pdf-word-converter', title: 'تبدیل PDF به Word (و بالعکس)', icon: <span /> },
    { id: 'pdf-image-converter', title: 'تبدیل PDF به عکس (و برعکس)', icon: <span /> },
  ]},
  { title: 'مبدل‌ها', icon: <FlaskConical className="h-6 w-6 text-primary-foreground" />, tools: [
    { id: 'unit-converter', title: 'تبدیل واحد (طول، وزن، دما)', icon: <span /> },
    { id: 'currency-converter', title: 'تبدیل ارزهای رایج', icon: <span /> },
    { id: 'date-converter', title: 'تبدیل تاریخ شمسی و میلادی', icon: <span /> },
    { id: 'rial-toman-converter', title: 'تبدیل ریال و تومان', icon: <span /> },
    { id: 'number-to-words', title: 'تبدیل عدد به حروف', icon: <span /> },
    { id: 'number-system', title: 'تبدیل ارقام فارسی و انگلیسی', icon: <span /> },
    { id: 'binary-converter', title: 'تبدیل متن و باینری', icon: <span /> },
    { id: 'base-converter', title: 'مبدل مبنای اعداد', icon: <span /> },
    { id: 'color-converter', title: 'مبدل رنگ (HEX, RGB, HSL)', icon: <span /> },
    { id: 'base64-converter', title: 'تبدیل متن و فایل به Base64', icon: <span /> },
  ]},
  { title: 'ابزارهای زمان و تاریخ', icon: <CalendarClock className="h-6 w-6 text-primary-foreground" />, tools: [
    { id: 'age-calculator', title: 'محاسبه دقیق سن', icon: <span /> },
    { id: 'stopwatch', title: 'کرونومتر حرفه‌ای', icon: <span /> },
    { id: 'countdown-timer', title: 'تایمر شمارش معکوس', icon: <span /> },
    { id: 'events-calendar', title: 'تقویم مناسبت‌های ایران', icon: <span /> },
    { id: 'iran-time', title: 'ساعت و تاریخ ایران', icon: <span /> },
    { id: 'online-alarm', title: 'تنظیم زنگ هشدار آنلاین', icon: <span /> },
  ]},
  { title: 'محاسبات عمومی و مالی', icon: <Wallet className="h-6 w-6 text-primary-foreground" />, tools: [
    { id: 'gpa-calculator', title: 'معدل‌سنج هوشمند', icon: <span /> },
    { id: 'market-rates', title: 'نرخ بازار (لحظه‌ای)', icon: <span /> },
    { id: 'crypto-converter', title: 'نرخ لحظه‌ای ارز دیجیتال', icon: <span /> },
    { id: 'loan-calculator', title: 'محاسبه اقساط وام', icon: <span /> },
    { id: 'deposit-calculator', title: 'محاسبه سود سپرده', icon: <span /> },
    { id: 'savings-calculator', title: 'محاسبه‌گر پس‌انداز', icon: <span /> },
    { id: 'percentage-calculator', title: 'محاسبه درصد', icon: <span /> },
    { id: 'vat-calculator', title: 'محاسبه ارزش افزوده', icon: <span /> },
    { id: 'women-health', title: 'ماشین حساب سلامت بانوان', icon: <span />, isWip: true },
    { id: 'morse-converter', title: 'مبدل متن ↔ مورس', icon: <span /> },
    { id: 'invoice-generator', title: 'فاکتورساز حرفه‌ای', icon: <span /> },
    { id: 'gold-coin-calculator', title: 'محاسبه‌گر طلا و سکه', icon: <span /> },
    { id: 'factorial-calculator', title: 'محاسبه فاکتوریل (!n)', icon: <span /> },
    { id: 'square-root-calculator', title: 'محاسبه جذر (√n)', icon: <span /> },
    { id: 'mehrieh-calculator', title: 'محاسبه مهریه به نرخ روز', icon: <span /> },
    { id: 'execution-fee', title: 'محاسبه نیم عشر دولتی', icon: <span /> },
    { id: 'attorney-fee', title: 'محاسبه حق‌الوکاله', icon: <span /> },
  ]},
  { title: 'سرگرمی و بازی', icon: <Gamepad2 className="h-6 w-6 text-primary-foreground" />, tools: [
    { id: 'tic-tac-toe', title: 'بازی دوز (Tic-Tac-Toe)', icon: <span /> },
    { id: 'guess-the-number', title: 'حدس عدد', icon: <span /> },
    { id: 'memory-game', title: 'بازی حافظه', icon: <span /> },
    { id: '2048', title: 'بازی 2048', icon: <span /> },
  ]},
  { title: 'ابزارهای کاربردی', icon: <User className="h-6 w-6 text-primary-foreground" />, tools: [
    { id: 'sheba-converter', title: 'تبدیل شماره حساب/شبا', icon: <span /> },
    { id: 'national-id-validator', title: 'اعتبارسنجی کد ملی', icon: <span /> },
    { id: 'link-shortener', title: 'کوتاه کننده لینک', icon: <span /> },
    { id: 'vehicle-plate-identifier', title: 'پلاک‌یاب خودرو', icon: <span /> },
    { id: 'random-number', title: 'تولید عدد تصادفی', icon: <span /> },
    { id: 'password-generator', title: 'تولید رمز عبور قوی', icon: <span /> },
    { id: 'qr-code-generator', title: 'ساخت کد QR', icon: <span /> },
    { id: 'qr-code-reader', title: 'خواندن کد QR', icon: <span /> },
    { id: 'image-optimizer', title: 'کاهش حجم تصویر', icon: <span /> },
    { id: 'text-analyzer', title: 'تحلیلگر متن آنلاین', icon: <span /> },
    { id: 'space-remover', title: 'حذف فواصل اضافه', icon: <span /> },
    { id: 'distance-calculator', title: 'محاسبه مسافت بین شهرها', icon: <span /> },
    { id: 'signature-generator', title: 'تولید امضای دیجیتال', icon: <span /> },
    { id: 'robots-txt-generator', title: 'Robots.txt ساز', icon: <span /> },
    { id: 'ip-detector', title: 'تشخیص IP و موقعیت', icon: <span /> },
    { id: 'lottery-tool', title: 'ابزار قرعه کشی آنلاین', icon: <span /> },
    { id: 'post-tracker', title: 'پیگیری مرسوله پستی', icon: <span />, isExternal: true, href: 'https://tracking.post.ir/' },
    { id: 'whois-lookup', title: 'استعلام WHOIS دامنه', icon: <span /> },
    { id: 'favicon-generator', title: 'سازنده فاوآیکن', icon: <span /> },
    { id: 'utm-builder', title: 'سازنده لینک UTM', icon: <span /> },
    { id: 'whatsapp-link', title: 'سازنده لینک واتساپ', icon: <span /> },
    { id: 'lorem-ipsum', title: 'تولید متن لورم ایپسوم', icon: <span /> },
  ]},
  { title: 'فال و طالع‌بینی', icon: <Heart className="h-6 w-6 text-primary-foreground" />, tools: [
    { id: 'hafez-fortune', title: 'فال حافظ', icon: <span /> },
  ]},
];

export default function CategoryPage() {
  const params = useParams();
  const router = useRouter();
  const name = decodeURIComponent(String(params?.category || ''));
  const category = registry.find(c => c.title === name);
  const [q, setQ] = React.useState('');
  const filtered = React.useMemo(() => {
    if (!category) return [] as Tool[];
    const t = (q || '').trim();
    if (!t) return category.tools;
    const norm = t.replace(/\s+/g, '');
    return category.tools.filter(tool =>
      tool.title.replace(/\s+/g, '').includes(norm) || tool.id.includes(norm)
    );
  }, [category, q]);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-2xl space-y-6">
          <div className="glass-effect rounded-3xl p-6 md:p-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/80 to-accent/80 rounded-xl flex items-center justify-center">
                {category?.icon || <span />}
              </div>
              <h1 className="text-2xl font-display font-bold text-foreground">{category ? category.title : 'دسته‌بندی'}</h1>
            </div>
            <Button variant="secondary" onClick={() => router.push('/') }>
              بازگشت به خانه
              <ArrowLeft className="mr-2 h-5 w-5" />
            </Button>
          </div>

          {!category ? (
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="text-xl">دسته‌بندی یافت نشد</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">لطفاً از فهرست دسته‌بندی‌ها در صفحه اصلی انتخاب کنید.</p>
              </CardContent>
            </Card>
          ) : (
            <>
            <div className="glass-effect rounded-2xl p-4 md:p-5">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="جستجو میان ابزارهای این دسته..."
                className="w-full bg-background/60 border border-border/50 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(tool => {
                const isDisabled = tool.isWip;
                if (tool.isExternal) {
                  return (
                    <a key={tool.id} href={tool.href} target="_blank" rel="noopener noreferrer" className="block">
                      <Card className="glass-effect card-hover">
                        <CardHeader>
                          <CardTitle className="text-lg font-display flex items-center justify-between">
                            <span>{tool.title}</span>
                            <span className="text-xs text-muted-foreground">مشاهده</span>
                          </CardTitle>
                        </CardHeader>
                      </Card>
                    </a>
                  );
                }
                return (
                  <Link
                    key={tool.id}
                    href={`/tool/${tool.id}`}
                    className={`block ${isDisabled ? 'pointer-events-none opacity-60' : ''}`}
                  >
                    <Card className="glass-effect card-hover">
                      <CardHeader>
                        <CardTitle className="text-lg font-display flex items-center justify-between">
                          <span>{tool.title}</span>
                          {isDisabled && <span className="text-xs text-muted-foreground">به‌زودی</span>}
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  </Link>
                );
              })}
            </div>
            {filtered.length === 0 && (
              <div className="text-center text-sm text-muted-foreground">نتیجه‌ای برای «{q}» یافت نشد.</div>
            )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}


