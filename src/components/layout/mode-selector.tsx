"use client";

import React from 'react';
import { Button } from '@/components/ui/button';

type Mode = 'full' | 'categories';

export default function ModeSelector({ onSelect }: { onSelect: (m: Mode) => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-hidden">
      {/* Particle Glow */}
      <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(circle_at_center,white,transparent_70%)]">
        <div className="absolute -inset-40 animate-[spin_30s_linear_infinite] opacity-30" style={{ background: 'radial-gradient(600px 600px at 50% 50%, rgba(234,179,8,0.15), transparent 60%)' }} />
      </div>
      <div className="glass-effect rounded-3xl p-6 w-[90%] max-w-lg bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0">
        <h3 className="text-xl font-display text-foreground text-center">انتخاب شیوه نمایش</h3>
        <p className="text-sm text-muted-foreground text-center mt-2">یکی از حالت‌ها را برای صفحه اصلی انتخاب کنید. هر زمان قابل تغییر است.</p>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button onClick={(e) => { const btn = e.currentTarget; btn.animate([{ boxShadow:'0 0 0 0 rgba(234,179,8,0.6)'}, { boxShadow:'0 0 0 20px rgba(234,179,8,0)' }], { duration: 600 }); onSelect('full'); }} className="rounded-2xl border border-yellow-500/30 p-5 hover:bg-yellow-500/10 transition relative overflow-hidden">
            <div className="text-yellow-300 font-semibold">نمای کامل</div>
            <div className="text-xs text-muted-foreground mt-1">همه ابزارها با توضیحات</div>
          </button>
          <button onClick={(e) => { const btn = e.currentTarget; btn.animate([{ boxShadow:'0 0 0 0 rgba(234,179,8,0.6)'}, { boxShadow:'0 0 0 20px rgba(234,179,8,0)' }], { duration: 600 }); onSelect('categories'); }} className="rounded-2xl border border-yellow-500/30 p-5 hover:bg-yellow-500/10 transition relative overflow-hidden">
            <div className="text-yellow-300 font-semibold">فقط دسته‌بندی‌ها</div>
            <div className="text-xs text-muted-foreground mt-1">نمای ساده و سریع</div>
          </button>
        </div>
        <div className="mt-5 text-center">
          <Button variant="ghost" onClick={() => onSelect('full')} className="text-xs">بعداً انتخاب می‌کنم</Button>
        </div>
      </div>
    </div>
  );
}


