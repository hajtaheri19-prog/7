"use client";

import Header from '@/components/layout/header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { FileText, Mail, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function TermsPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="glass-effect rounded-3xl p-8 md:p-12 bg-gradient-to-br from-white/70 via-white/60 to-white/70 dark:from-black/40 dark:via-zinc-900/40 dark:to-black/30 border border-yellow-500/20 shadow-[0_0_40px_#eab30822] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 via-transparent to-yellow-500/10 animate-pulse" />
            
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
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-500/40 to-yellow-300/25 shadow-[0_0_25px_#eab30866] flex items-center justify-center border border-yellow-400/30">
                  <FileText className="w-8 h-8 text-yellow-700 dark:text-yellow-200 drop-shadow-lg" />
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground text-glow">قوانین و مقررات سایت تبدیلا</h1>
              </div>

              <div className="space-y-6 text-right leading-relaxed text-foreground/90">
                  <p className="text-lg font-medium text-yellow-700/90 dark:text-yellow-200/90 mb-6">
                    به دنیای <strong className="text-yellow-300">تبدیلا</strong> خوش آمدید؛ جایی که سرعت، دقت و آزادی کاربر در اولویت قرار دارد. استفاده از خدمات و ابزارهای این وب‌سایت به معنی پذیرش کامل شرایط زیر است. تیم ما باور دارد که تجربه کاربری باید شفاف، امن و پایدار باشد، بنابراین مطالعه دقیق این مقررات پیش از استفاده ضروری است.
                  </p>

                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <h3 className="text-xl font-bold text-green-700 dark:text-green-300 mb-3">۱. رایگان و بدون ثبت‌نام</h3>
                      <p>تمامی ابزارهای تبدیلا به‌صورت کاملاً رایگان و بدون نیاز به ثبت‌نام در دسترس کاربران قرار دارد. کاربر آزاد است هر ابزار را در هر زمان و بدون محدودیت استفاده کند.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                      <h3 className="text-xl font-bold text-blue-700 dark:text-blue-300 mb-3">۲. عدم جمع‌آوری داده و عدم مسئولیت نگهداری</h3>
                      <p>ما هیچ‌گونه اطلاعات شخصی یا غیرشخصی از کاربران جمع‌آوری یا ذخیره نمی‌کنیم. بنابراین مسئولیتی در قبال نگهداری، بازیابی یا پشتیبانی داده‌های استفاده‌شده یا تولیدشده توسط ابزارها نداریم. استفاده صحیح و مسئولانه از ابزارها بر عهده کاربر است.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20">
                      <h3 className="text-xl font-bold text-purple-700 dark:text-purple-300 mb-3">۳. استفاده قانونی</h3>
                      <p>کاربر متعهد می‌شود خدمات و ابزارهای این سایت را تنها در چارچوب قوانین و مقررات جاری جمهوری اسلامی ایران و قواعد بین‌المللی مرتبط استفاده نماید. هرگونه استفاده غیرقانونی یا مغایر با اخلاقیات، اکیداً ممنوع بوده و پیگیری قانونی خواهد داشت.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20">
                      <h3 className="text-xl font-bold text-red-700 dark:text-red-300 mb-3">۴. مالکیت معنوی و کپی‌رایت</h3>
                      <p className="font-medium">تمام کدها، طراحی‌ها، رابط کاربری، ابزارها و محتوای این وب‌سایت متعلق به تیم <strong className="text-yellow-300">تبدیلا</strong> است و تحت قوانین مالکیت فکری و کپی‌رایت حمایت می‌شود.</p>
                      <p className="mt-2 text-red-200 font-semibold">هرگونه کپی، برداشت، بازنشر، تغییر یا استفاده مجدد از کدها و محتوای سایت بدون مجوز کتبی از تیم ما <strong>شرعاً حرام، قانوناً جرم و از نظر اخلاقی عملی ناپسند</strong> محسوب می‌شود. تیم تبدیلا حق پیگیری حقوقی و قضایی چنین تخلفاتی را برای خود محفوظ می‌دارد.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
                      <h3 className="text-xl font-bold text-orange-700 dark:text-orange-300 mb-3">۵. تغییرات و به‌روزرسانی‌ها</h3>
                      <p>تیم تبدیلا حق دارد در هر زمان، بدون اطلاع قبلی، ابزارها، خدمات و رابط کاربری را تغییر، به‌روزرسانی یا حذف نماید. همچنین ممکن است مفاد این قوانین به‌روزرسانی شود و نسخه اصلاح‌شده بلافاصله پس از انتشار بر روی سایت، لازم‌الاجرا خواهد بود. ادامه استفاده شما از خدمات به معنی پذیرش کامل تغییرات خواهد بود.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500/10 to-red-500/10 border border-rose-500/20">
                      <h3 className="text-xl font-bold text-rose-700 dark:text-rose-300 mb-3">۶. سوءاستفاده و محدودیت دسترسی</h3>
                      <p>در صورت مشاهده هرگونه استفاده غیرقانونی، سوءاستفاده یا اقداماتی که باعث آسیب به عملکرد وب‌سایت یا حقوق سایر کاربران شود، تیم تبدیلا می‌تواند دسترسی کاربر خاطی را به‌صورت موقت یا دائم قطع نماید.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
                      <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-3">۷. قانون حاکم و مرجع رسیدگی</h3>
                      <p>این وب‌سایت تحت قوانین جمهوری اسلامی ایران فعالیت می‌کند. هرگونه اختلاف ناشی از استفاده از خدمات، ابتدا از طریق مذاکره دوستانه حل خواهد شد و در صورت عدم توافق، مراجع قانونی صالح در ایران مرجع رسیدگی خواهند بود.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30 text-center">
                      <h3 className="text-xl font-bold text-yellow-700 dark:text-yellow-300 mb-4">تماس با ما</h3>
                      <p className="mb-4">در صورت مشاهده هرگونه پرسش، پیشنهاد یا مشکل، فقط از طریق ایمیل رسمی زیر با ما تماس بگیرید:</p>
                      <div className="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200 font-bold text-lg">
                        <Mail className="w-5 ه-5" />
                        <span>tabdila.ir@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-8 پ-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-yellow-300/10 border border-yellow-500/20">
                    <p className="text-xl font-bold text-yellow-700 dark:text-yellow-300 text-glow">
                      <strong>تبدیلا</strong>، متحد تجربه آزاد، سریع و لوکس آنلاین.
                    </p>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}


