"use client";

import Header from '@/components/layout/header';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-lg glass-effect rounded-3xl p-6 md:p-8">
          <h1 className="text-2xl font-display font-bold mb-4">سیاست حفظ حریم خصوصی</h1>
          <ScrollArea className="max-h-[70vh] rounded-md">
            <div className="space-y-4 text-right leading-relaxed p-1 pr-3">
              <p>حفظ حریم خصوصی شما برای ما اهمیت دارد. داده‌های شخصی بدون اجازه شما جمع‌آوری نمی‌شود.</p>
              <p>برخی قابلیت‌ها ممکن است از سرویس‌های شخص ثالث استفاده کنند و تابع قوانین آن‌ها باشند.</p>
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}


