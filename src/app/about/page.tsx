import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Calculator, 
  FileText, 
  QrCode, 
  Palette, 
  Shield, 
  Zap, 
  Globe, 
  Heart,
  Users,
  Star,
  Download,
  Smartphone,
  Clock,
  CheckCircle,
  ArrowRight,
  Wrench,
  Image as ImageIcon,
  FileImage,
  Hash,
  KeyRound,
  Text,
  Calendar,
  DollarSign,
  Scale,
  Target,
  Sparkles,
  Crown,
  Rocket,
  Brain,
  Lightbulb,
  Award,
  TrendingUp,
  Lock,
  Eye,
  Search,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import Header from '@/components/layout/header';
import ScrollToTop from '@/components/layout/scroll-to-top';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'درباره تبدیلا',
  description: 'تبدیلا، دستیار هوشمند شما برای انواع محاسبات و تبدیلات روزمره. مجموعه‌ای کامل از ابزارهای آنلاین، رایگان و هوشمند.',
  keywords: [
    'درباره تبدیلا', 'تبدیلا چیست', 'ابزارهای آنلاین', 'محاسبات آنلاین', 
    'تبدیل واحد', 'ابزارهای رایگان', 'سایت ابزار', 'ابزارهای فارسی'
  ],
  openGraph: {
    title: 'درباره تبدیلا | دستیار هوشمند ابزارهای آنلاین',
    description: 'تبدیلا، دستیار هوشمند شما برای انواع محاسبات و تبدیلات روزمره. مجموعه‌ای کامل از ابزارهای آنلاین، رایگان و هوشمند.',
    type: 'website',
  },
};

export default function AboutPage() {
  const tools = [
    {
      icon: Calculator,
      name: "محاسبه‌گر پیشرفته",
      description: "ماشین حساب کامل با قابلیت‌های پیشرفته ریاضی",
      category: "محاسبات"
    },
    {
      icon: FileText,
      name: "تبدیل واحدها",
      description: "تبدیل انواع واحدهای اندازه‌گیری، وزن، طول، حجم و...",
      category: "تبدیلات"
    },
    {
      icon: QrCode,
      name: "تولید QR Code",
      description: "ایجاد کدهای QR برای متن، لینک، و اطلاعات",
      category: "کدگذاری"
    },
    {
      icon: FileImage,
      name: "تبدیل PDF",
      description: "تبدیل PDF به عکس و برعکس با کیفیت بالا",
      category: "فایل‌ها"
    },
    {
      icon: Eye,
      name: "تشخیص متن (OCR)",
      description: "استخراج متن از تصاویر با هوش مصنوعی",
      category: "هوش مصنوعی"
    },
    {
      icon: Palette,
      name: "انتخاب رنگ",
      description: "ابزار انتخاب رنگ با کدهای HEX، RGB و HSL",
      category: "طراحی"
    },
    {
      icon: KeyRound,
      name: "تولید رمز عبور",
      description: "ایجاد رمزهای امن و قوی برای حساب‌های کاربری",
      category: "امنیت"
    },
    {
      icon: Text,
      name: "ابزارهای متن",
      description: "تعداد کاراکتر، خلاصه‌سازی، تبدیل حروف و...",
      category: "متن"
    },
    {
      icon: Calendar,
      name: "تبدیل تاریخ",
      description: "تبدیل تاریخ شمسی، میلادی و قمری",
      category: "تاریخ"
    },
    {
      icon: DollarSign,
      name: "قیمت ارز و طلا",
      description: "نرخ لحظه‌ای ارزهای خارجی و قیمت طلا",
      category: "مالی"
    },
    {
      icon: Scale,
      name: "محاسبه BMI",
      description: "محاسبه شاخص توده بدنی و وضعیت سلامت",
      category: "سلامت"
    },
    {
      icon: Hash,
      name: "محاسبه درصد",
      description: "محاسبه درصد، تخفیف، افزایش و کاهش",
      category: "محاسبات"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "سرعت بالا",
      description: "همه ابزارها با سرعت بالا و بدون تأخیر کار می‌کنند"
    },
    {
      icon: Shield,
      title: "امنیت کامل",
      description: "تمام اطلاعات شما محفوظ است و هیچ داده‌ای ذخیره نمی‌شود"
    },
    {
      icon: Globe,
      title: "رایگان و آنلاین",
      description: "استفاده از تمام ابزارها کاملاً رایگان و بدون نیاز به ثبت‌نام"
    },
    {
      icon: Smartphone,
      title: "سازگار با موبایل",
      description: "طراحی ریسپانسیو که روی همه دستگاه‌ها عالی کار می‌کند"
    },
    {
      icon: Download,
      title: "قابل نصب",
      description: "امکان نصب به عنوان اپلیکیشن روی موبایل و دسکتاپ"
    },
    {
      icon: Heart,
      title: "ساخته شده با عشق",
      description: "توسط تیم ایرانی برای کاربران فارسی‌زبان طراحی شده"
    }
  ];

  const stats = [
    { number: "50+", label: "ابزار کاربردی" },
    { number: "100%", label: "رایگان" },
    { number: "24/7", label: "در دسترس" },
    { number: "0", label: "نیاز به ثبت‌نام" }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl">
          
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <Crown className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">درباره تبدیلا</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              تبدیلا، دستیار هوشمند شما برای انواع محاسبات و تبدیلات روزمره است. 
              مجموعه‌ای کامل از ابزارهای آنلاین، رایگان و هوشمند که زندگی دیجیتال شما را ساده‌تر می‌کند.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.number}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Mission */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Target className="w-6 h-6 text-primary" />
                مأموریت ما
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg leading-relaxed text-muted-foreground">
                هدف ما ایجاد پلتفرمی است که تمام ابزارهای مورد نیاز کاربران فارسی‌زبان را در یک مکان جمع‌آوری کند. 
                ما معتقدیم که دسترسی آسان به ابزارهای کاربردی می‌تواند زندگی روزمره را ساده‌تر و کارآمدتر کند. 
                همه ابزارهای ما رایگان، سریع و بدون نیاز به ثبت‌نام در دسترس هستند.
              </p>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
              <Sparkles className="w-8 h-8 text-primary" />
              ویژگی‌های کلیدی
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <Card key={index} className="p-6">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <feature.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-muted-foreground">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tools */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8 flex items-center justify-center gap-3">
              <Wrench className="w-8 h-8 text-primary" />
              ابزارهای موجود
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool, index) => (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <tool.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg">{tool.name}</h3>
                          <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm">{tool.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Technology */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Brain className="w-6 h-6 text-primary" />
                فناوری‌های استفاده شده
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  "Next.js 14", "React 18", "TypeScript", "Tailwind CSS",
                  "PDF.js", "Tesseract.js", "QR Code", "PWA",
                  "Firebase", "Vercel", "Responsive Design", "Modern Web APIs"
                ].map((tech, index) => (
                  <Badge key={index} variant="outline" className="p-2 text-center">
                    {tech}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Security */}
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-primary" />
                حریم خصوصی و امنیت
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">هیچ داده‌ای ذخیره نمی‌شود</h4>
                    <p className="text-muted-foreground">تمام پردازش‌ها در مرورگر شما انجام می‌شود</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">نیاز به ثبت‌نام نیست</h4>
                    <p className="text-muted-foreground">بلافاصله پس از ورود به سایت می‌توانید از ابزارها استفاده کنید</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">امنیت بالا</h4>
                    <p className="text-muted-foreground">استفاده از آخرین استانداردهای امنیتی وب</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold">کد منبع باز</h4>
                    <p className="text-muted-foreground">کدهای سایت در GitHub در دسترس است</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Call to Action */}
          <Card className="text-center p-8 mb-12">
            <CardContent className="p-0">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Rocket className="w-8 h-8 text-primary" />
                <h2 className="text-2xl font-bold">آماده استفاده هستید؟</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                همین حالا شروع کنید و از ابزارهای تبدیلا استفاده کنید
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg">
                  <Link href="/">
                    <ArrowRight className="w-4 h-4 mr-2" />
                    شروع کنید
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/quotes">
                    <BookOpen className="w-4 h-4 mr-2" />
                    سخن بزرگان
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="w-6 h-6 text-primary" />
                تماس با ما
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <h4 className="font-semibold mb-2">پیشنهادات و انتقادات</h4>
                <p className="text-muted-foreground mb-4">
                  نظرات و پیشنهادات شما برای بهبود سایت بسیار ارزشمند است
                </p>
                <Button asChild variant="outline">
                  <Link href="/feedback">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    ارسال نظر
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

        </div>
      </main>
      <ScrollToTop />
    </div>
  );
}
