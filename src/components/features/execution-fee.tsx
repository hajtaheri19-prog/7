"use client";

import { useMemo, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

// نمونه ساده برای محاسبه نیم عشر دولتی (۵٪ از محکوم به)
export default function ExecutionFee() {
  const [amount, setAmount] = useState<string>('100000000');
  const fee = useMemo(()=>{
    const a = Number((amount||'').replace(/[^\d.]/g,''))||0;
    return a * 0.05;
  }, [amount]);
  return (
    <CardContent className="space-y-3">
      <div className="space-y-2">
        <Label>محکوم‌به (ریال)</Label>
        <Input value={amount} onChange={e=>setAmount(e.target.value)} dir="ltr" />
      </div>
      <div className="space-y-1">
        <Label className="text-muted-foreground">نیم عشر دولتی (ریال)</Label>
        <div className="text-2xl font-bold">{Math.round(fee).toLocaleString('fa-IR')}</div>
      </div>
    </CardContent>
  );
}


