"use client";

import { useMemo, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// مدل نمونه: درصدی از خواسته با کف/سقف ساده (برای نمایش) – قابل تنظیم با فرمول واقعی
export default function AttorneyFee() {
  const [claim, setClaim] = useState<string>('500000000');
  const fee = useMemo(()=>{
    const a = Number((claim||'').replace(/[^\d.]/g,''))||0;
    let f = a * 0.07; // 7%
    if (f < 3000000) f = 3000000;
    return f;
  }, [claim]);
  return (
    <CardContent className="space-y-3">
      <div className="space-y-2">
        <Label>مبلغ خواسته (ریال)</Label>
        <Input value={claim} onChange={e=>setClaim(e.target.value)} dir="ltr" />
      </div>
      <div className="space-y-1">
        <Label className="text-muted-foreground">حق‌الوکاله پیشنهادی (ریال)</Label>
        <div className="text-2xl font-bold">{Math.round(fee).toLocaleString('fa-IR')}</div>
      </div>
    </CardContent>
  );
}


