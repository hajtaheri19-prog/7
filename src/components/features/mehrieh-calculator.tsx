"use client";

import { useMemo, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

function toIR(n: number) { return Math.round(n).toLocaleString('fa-IR'); }

export default function MehriehCalculator() {
  const [coins, setCoins] = useState<string>('110');
  const [coinPrice, setCoinPrice] = useState<string>('408000000');
  const [includePenalty, setIncludePenalty] = useState<boolean>(false);
  const [penaltyPercent, setPenaltyPercent] = useState<string>('0');

  const total = useMemo(() => {
    const c = Number((coins||'').replace(/[^\d.]/g,'')) || 0;
    const p = Number((coinPrice||'').replace(/[^\d.]/g,'')) || 0;
    let t = c * p;
    if (includePenalty) {
      const perc = Number((penaltyPercent||'').replace(/[^\d.]/g,'')) || 0;
      t = t * (1 + perc/100);
    }
    return t;
  }, [coins, coinPrice, includePenalty, penaltyPercent]);

  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label>تعداد سکه (امامی)</Label>
          <Input value={coins} onChange={e=>setCoins(e.target.value)} dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>قیمت هر سکه (ریال)</Label>
          <Input value={coinPrice} onChange={e=>setCoinPrice(e.target.value)} dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>جریمه/افزایش (٪ اختیاری)</Label>
          <Input value={penaltyPercent} onChange={e=>setPenaltyPercent(e.target.value)} dir="ltr" disabled={!includePenalty} />
          <div className="text-xs text-muted-foreground">برای لحاظ کردن، عدد بالایی را تنظیم کنید.</div>
        </div>
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <Label className="text-muted-foreground">مبلغ کل (ریال)</Label>
          <div className="text-2xl font-bold">{toIR(total)}</div>
        </div>
        <div className="space-y-1">
          <Label className="text-muted-foreground">مبلغ کل (تومان)</Label>
          <div className="text-2xl font-bold">{toIR(total/10)}</div>
        </div>
      </div>
    </CardContent>
  );
}


