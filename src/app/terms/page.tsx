"use client";

import Header from '@/components/layout/header';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Mail } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-xl">
          <div className="glass-effect rounded-3xl p-8 md:p-12 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border border-yellow-500/20 shadow-[0_0_40px_#eab30822] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-yellow-500/5 animate-pulse" />
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-yellow-500/50 to-yellow-300/30 shadow-[0_0_25px_#eab30866] flex items-center justify-center border border-yellow-400/30">
                  <FileText className="w-8 h-8 text-yellow-200 drop-shadow-lg" />
                </div>
                <h1 className="text-3xl font-display font-bold text-foreground text-glow">قوانین و مقررات سایت تبدیلا</h1>
              </div>

              <ScrollArea className="max-h-[70vh] rounded-md">
                <div className="space-y-6 text-right leading-relaxed text-foreground/90">
                  <p className="text-lg font-medium text-yellow-200/90 mb-6">
                    به دنیای <strong className="text-yellow-300">تبدیلا</strong> خوش آمدید؛ جایی که سرعت، دقت و آزادی کاربر در اولویت است. استفاده از خدمات و ابزارهای این وب‌سایت به معنی پذیرش کامل شرایط زیر است، زیرا ما معتقدیم که تجربه کاربری باید شفاف، امن و پایدار باشد.
                  </p>

                  <div className="space-y-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20">
                      <h3 className="text-xl font-bold text-green-300 mb-3">۱. رایگان و آزاد</h3>
                      <p>تمامی ابزارهای تبدیلا بدون هزینه و بدون نیاز به ثبت‌نام ارائه می‌شوند. کاربر آزاد است هر ابزار را در هر زمان، بدون محدودیت استفاده کند.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                      <h3 className="text-xl font-bold text-blue-300 mb-3">۲. عدم مسئولیت بابت داده‌ها</h3>
                      <p>از آنجا که ما هیچ اطلاعات شخصی یا غیرشخصی از کاربران جمع‌آوری یا ذخیره نمی‌کنیم، مسئولیتی در قبال نگهداری یا بازیابی داده‌ها وجود ندارد. مسئولیت استفاده صحیح از ابزارها بر عهده کاربر است.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20">
                      <h3 className="text-xl font-bold text-purple-300 mb-3">۳. استفاده قانونی</h3>
                      <p>شما متعهد می‌شوید از ابزارهای ما فقط در چارچوب قوانین جمهوری اسلامی ایران و مقررات بین‌المللی مربوطه استفاده کنید. هرگونه استفاده غیرقانونی یا مغایر با اخلاقیات، ممنوع است.</p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/10 to-rose-500/10 border border-red-500/20">
                      <h3 className="text-xl font-bold text-red-300 mb-3">⚠️ ۴. مالکیت معنوی و ممنوعیت کپی کدها</h3>
                      <p className="font-medium">
                        تمام کدها، طراحی‌ها، رابط کاربری، ابزارها و محتوای سایت <strong className="text-yellow-300">تبدیلا</strong> حاصل تلاش و سرمایه‌گذاری تیم ماست.
                      </p>
                      <p className="mt-2 text-red-200 font-semibold">
                        هرگونه کپی، برداشت، استفاده مجدد یا انتشار کدهای سایت بدون مجوز کتبی از تیم ما <strong>شرعاً حرام، قانوناً جرم و از نظر اخلاقی عملی زشت و ناپسند</strong> محسوب می‌شود و ما حق پیگیری قانونی آن را داریم.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-500/20">
                      <h3 className="text-xl font-bold text-orange-300 mb-3">۵. بروزرسانی خدمات و قوانین</h3>
                      <p>تیم تبدیلا حق دارد در هر زمان ابزارها را بروزرسانی، تغییر یا حذف کند. همچنین نسخه جدید قوانین از طریق همین صفحه در دسترس خواهد بود.</p>
                    </div>

                    <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30 text-center">
                      <h3 className="text-xl font-bold text-yellow-300 mb-4">۶. ارتباط با ما</h3>
                      <p className="mb-4">در صورت وجود هرگونه پرسش، پیشنهاد یا مشکل، فقط از طریق ایمیل رسمی زیر با ما تماس بگیرید:</p>
                      <div className="flex items-center justify-center gap-2 text-yellow-200 font-bold text-lg">
                        <Mail className="w-5 h-5" />
                        <span>tabdila.ir@gmail.com</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mt-8 p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-yellow-300/10 border border-yellow-500/20">
                    <p className="text-xl font-bold text-yellow-300 text-glow">
                      <strong>تبدیلا</strong>، متحد تجربه آزاد، سریع و لوکس آنلاین.
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


