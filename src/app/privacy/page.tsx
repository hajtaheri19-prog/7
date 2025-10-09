"use client";

import Header from '@/components/layout/header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Shield, Mail, Lock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function PrivacyPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="glass-effect rounded-3xl p-8 md:p-12 bg-gradient-to-br from-white/70 via-white/60 to-white/70 dark:from-black/40 dark:via-zinc-900/40 dark:to-black/30 border border-blue-500/20 shadow-[0_0_40px_#3b82f622] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-cyan-500/10 animate-pulse" />
            
            <div className="relative z-10">
              <div className="mb-6">
                <Button
                  variant="ghost"
                  className="gap-2 text-foreground/90"
                  onClick={() => router.back()}
                >
                  <ArrowRight className="w-4 h-4" />
                  بازگشت
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/40 to-cyan-500/25 shadow-[0_0_25px_#3b82f666] flex items-center justify-center border border-blue-400/30">
                  <Shield className="w-8 h-8 text-blue-700 dark:text-blue-200 drop-shadow-lg" />
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground text-glow">سیاست حفظ حریم خصوصی</h1>
              </div>

              <ScrollArea className="max-h-[70vh] rounded-md">
                <div className="space-y-6 text-right leading-relaxed text-foreground/90">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-blue-500/30 text-center">
                    <Lock className="w-12 h-12 text-blue-700 dark:text-blue-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-4 text-glow">🔒 حریم خصوصی مثل طلا</h2>
                  </div>

                  <div className="text-lg leading-8 space-y-6">
                    <p className="font-medium text-blue-200/90">
                      در تبدیلا ما به آزادی، آرامش و امنیت کاربرانمان باور داریم و حریم خصوصی را همانند طلا ارزشمند می‌دانیم. رسالت ما ساده و روشن است؛ ارائه ابزارهای آنلاین کاربردی، رایگان و سریع، بی‌آنکه حتی لحظه‌ای از اطلاعات شما برداشت یا ذخیره شود. تمامی خدمات به‌صورت کامل بر بستر کلاینت‌ساید اجرا می‌شوند؛ یعنی هرچه در مرورگر شما رخ می‌دهد همان‌جا باقی می‌ماند و هیچ داده‌ای به سرور یا پایگاه داده‌ای ارسال نمی‌شود. در این مسیر، هیچ فرم ثبت‌نام یا ورود وجود ندارد، هیچ کوکی ردیابی فعال نیست و هیچ‌گونه ابزار تحلیل رفتار کاربر مورد استفاده قرار نمی‌گیرد. حتی آدرس IP یا سابقهٔ فعالیت شما ذخیره نخواهد شد. شما در تبدیلا یک کاربر ناشناس و آزاد هستید و همیشه چنین خواهید ماند. باور ما این است که حریم خصوصی نه‌تنها غیرقابل معامله است، بلکه باید پاک، امن و پایدار بماند. حتی در آینده و با بروزرسانی سرویس‌ها، این ستون اصلی هرگز تغییر نخواهد کرد و اطلاعات شما هیچ‌گاه ذخیره یا فروخته نمی‌شود. این سیاست در چارچوب قوانین جمهوری اسلامی ایران و مقررات بین‌المللی مرتبط تدوین شده و هرگونه تغییر احتمالی، تنها در راستای حفظ کامل حقوق و حریم شخصی کاربران اعمال خواهد شد.
                    </p>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30">
                      <p className="text-xl font-semibold text-yellow-200 text-center">
                        شما در تبدیلا یک کاربر <strong className="text-yellow-300">ناشناس و آزاد</strong> هستید و همیشه خواهید بود.
                      </p>
                    </div>

                    <p>
                      ما معتقدیم که حریم خصوصی مثل طلاست؛ <strong className="text-blue-300">ارزشمند، پاک و غیرقابل معامله</strong>. بنابراین، حتی در آینده و با بروزرسانی سرویس‌ها، ستون اصلی سیاست ما ثابت می‌ماند:
                    </p>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 text-center">
                      <p className="text-2xl font-bold text-blue-700 dark:text-blue-200 text-glow">
                        «ما اطلاعات شما را نمی‌گیریم، ذخیره نمی‌کنیم و به هیچ‌کسی نمی‌دهیم.»
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30 text-center">
                      <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-4">تماس با ما</h3>
                      <p className="mb-4">اگر پرسشی دارید یا می‌خواهید درباره این رویکرد بیشتر بدانید، از طریق ایمیل رسمی ما با تیم پشتیبانی ارتباط بگیرید:</p>
                      <div className="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200 font-bold text-lg">
                        <Mail className="w-5 h-5" />
                        <span>tabdila.ir@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                    <p className="text-xl font-bold text-blue-700 dark:text-blue-300 text-glow">
                      <strong>تبدیلا</strong>، جایی که تخصص و آزادی دست در دست هم می‌دهند.
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


