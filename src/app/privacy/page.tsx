"use client";

import Header from '@/components/layout/header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Shield, Mail, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="glass-effect rounded-3xl p-8 md:p-12 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border border-blue-500/20 shadow-[0_0_40px_#3b82f622] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-transparent to-cyan-500/5 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500/50 to-cyan-500/30 shadow-[0_0_25px_#3b82f666] flex items-center justify-center border border-blue-400/30">
                  <Shield className="w-8 h-8 text-blue-200 drop-shadow-lg" />
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground text-glow">سیاست حفظ حریم خصوصی</h1>
              </div>

              <ScrollArea className="max-h-[70vh] rounded-md">
                <div className="space-y-6 text-right leading-relaxed text-foreground/90">
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-blue-500/30 text-center">
                    <Lock className="w-12 h-12 text-blue-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-blue-300 mb-4 text-glow">🔒 حریم خصوصی مثل طلا</h2>
                  </div>

                  <div className="text-lg leading-8 space-y-6">
                    <p className="font-medium text-blue-200/90">
                      در <strong className="text-blue-300">تبدیلا</strong> ما به آزادی و آرامش کاربرانمان ایمان داریم. رسالت ما ساده است: ارائه ابزارهای آنلاین کاربردی، رایگان و سریع، بدون آنکه لحظه‌ای از اطلاعات شما برداشت یا ذخیره شود.
                    </p>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30">
                      <h3 className="text-xl font-bold text-green-300 mb-3 flex items-center gap-2">
                        ✅ تضمین کلاینت‌ساید
                      </h3>
                      <p>
                        تمام خدمات ما به‌صورت کاملاً <strong className="text-green-200">کلاینت‌ساید</strong> اجرا می‌شوند؛ یعنی آنچه در مرورگر شما اتفاق می‌افتد، همان‌جا باقی می‌ماند و در هیچ پایگاه داده‌ای ثبت نمی‌شود.
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 text-center">
                        <h4 className="font-bold text-red-300 mb-2">❌ هیچ فرم ثبت‌نامی</h4>
                        <p className="text-sm">ورود یا ثبت‌نام وجود ندارد</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20 text-center">
                        <h4 className="font-bold text-orange-300 mb-2">❌ هیچ کوکی ردیابی</h4>
                        <p className="text-sm">ابزار تحلیل رفتاری فعال نیست</p>
                      </div>
                      <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 text-center">
                        <h4 className="font-bold text-purple-300 mb-2">❌ هیچ ذخیره‌سازی</h4>
                        <p className="text-sm">آدرس IP یا سابقه فعالیت ثبت نمی‌شود</p>
                      </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30">
                      <p className="text-xl font-semibold text-yellow-200 text-center">
                        شما در تبدیلا یک کاربر <strong className="text-yellow-300">ناشناس و آزاد</strong> هستید و همیشه خواهید بود.
                      </p>
                    </div>

                    <p>
                      ما معتقدیم که حریم خصوصی مثل طلاست؛ <strong className="text-blue-300">ارزشمند، پاک و غیرقابل معامله</strong>. بنابراین، حتی در آینده و با بروزرسانی سرویس‌ها، ستون اصلی سیاست ما ثابت می‌ماند:
                    </p>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/40 text-center">
                      <p className="text-2xl font-bold text-blue-200 text-glow">
                        «ما اطلاعات شما را نمی‌گیریم، ذخیره نمی‌کنیم و به هیچ‌کسی نمی‌دهیم.»
                      </p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30 text-center">
                      <h3 className="text-xl font-bold text-yellow-300 mb-4">تماس با ما</h3>
                      <p className="mb-4">اگر پرسشی دارید یا می‌خواهید درباره این رویکرد بیشتر بدانید، از طریق ایمیل رسمی ما با تیم پشتیبانی ارتباط بگیرید:</p>
                      <div className="flex items-center justify-center gap-2 text-yellow-200 font-bold text-lg">
                        <Mail className="w-5 h-5" />
                        <span>tabdila.ir@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-8 p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                    <p className="text-xl font-bold text-blue-300 text-glow">
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


