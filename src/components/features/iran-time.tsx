"use client";

import { useEffect, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

export default function IranTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now ? new Intl.DateTimeFormat('fa-IR', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Tehran', hour12: false }).format(now) : '—';
  const date = now ? new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', calendar: 'persian', timeZone: 'Asia/Tehran' }).format(now) : '—';

  return (
    <CardContent className="space-y-3 text-center">
      <Label className="text-muted-foreground">ساعت و تاریخ ایران (تهران)</Label>
      <div className="text-4xl font-bold font-display">{time}</div>
      <div className="text-lg">{date}</div>
    </CardContent>
  );
}


