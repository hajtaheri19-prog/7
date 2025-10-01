"use client";

import Header from '@/components/layout/header';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-screen-lg glass-effect rounded-3xl p-6 md:p-8">
          <h1 className="text-2xl font-display font-bold mb-4">قوانین و مقررات</h1>
          <ScrollArea className="max-h-[70vh] rounded-md">
            <div className="space-y-4 text-right leading-relaxed p-1 pr-3">
              <p>استفاده از این وب‌سایت به منزله پذیرش قوانین ذیل است.</p>
              <p>تمام ابزارها برای استفاده شخصی و قانونی طراحی شده‌اند. هرگونه استفاده غیرقانونی ممنوع است.</p>
              <p>حقوق مادی و معنوی محتوا و کدها متعلق به «تبدیلا» است.</p>
            </div>
          </ScrollArea>
        </div>
      </main>
    </div>
  );
}


