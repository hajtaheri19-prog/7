"use client";

import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CalendarDays, HeartPulse, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { gregorianToJalali } from '@/lib/date-converter';

type Trimester = 1 | 2 | 3;

function formatDateDual(d: Date) {
  const g = new Intl.DateTimeFormat('fa-IR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
  }).format(d);
  const j = gregorianToJalali(d);
  const jStr = `${j.jy}/${String(j.jm).padStart(2, '0')}/${String(j.jd).padStart(2, '0')}`;
  return { gregorianFa: g, jalali: jStr };
}

function daysBetween(a: Date, b: Date) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const start = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const end = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((end - start) / msPerDay);
}

function addDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function clamp(n: number, min: number, max: number) { return Math.min(max, Math.max(min, n)); }

function getTrimesterByWeek(week: number): Trimester {
  if (week < 13) return 1;
  if (week < 27) return 2;
  return 3;
}

function percentagePregnancy(weeks: number, days: number) {
  const totalDays = clamp(weeks * 7 + days, 0, 280);
  return Math.round((totalDays / 280) * 100);
}

function ringColorByPercent(p: number) {
  if (p < 34) return 'stroke-emerald-400';
  if (p < 67) return 'stroke-amber-400';
  return 'stroke-rose-400';
}

function predictCycles(lmp: Date, avgCycle: number, monthsAhead = 3) {
  const cycles: { start: Date; end: Date }[] = [];
  const avgPeriodLength = 5; // days highlighted for period
  let start = new Date(lmp);
  const limit = addDays(new Date(lmp), monthsAhead * 31);
  while (start <= limit) {
    const end = addDays(start, avgPeriodLength - 1);
    cycles.push({ start: new Date(start), end });
    start = addDays(start, avgCycle);
  }
  return cycles;
}

export default function WomenHealthCalculator() {
  const [lmp, setLmp] = useState<string>(''); // Last Menstrual Period (YYYY-MM-DD)
  const [avgCycle, setAvgCycle] = useState<string>('28');

  const cycleNum = useMemo(() => {
    const n = parseInt(avgCycle || '0', 10);
    return Number.isFinite(n) && n > 0 ? n : 28;
  }, [avgCycle]);

  const warnings = useMemo(() => {
    const list: string[] = [];
    if (cycleNum < 21 || cycleNum > 35) {
      list.push('طول سیکل خارج از محدوده معمول (۲۱ تا ۳۵ روز) است. لطفاً با پزشک مشورت کنید.');
    }
    return list;
  }, [cycleNum]);

  const computations = useMemo(() => {
    if (!lmp) return null;
    const lmpDate = new Date(lmp);
    if (isNaN(lmpDate.getTime())) return null;

    // Naegele’s rule adjusted by cycle length: EDD = LMP + 280 + (cycleLen - 28)
    const dueDate = addDays(lmpDate, 280 + (cycleNum - 28));
    const today = new Date();

    // Conception date approx: LMP + (cycleLen - 14)
    const conception = addDays(lmpDate, cycleNum - 14);

    // Gestational age today from LMP
    const passedDays = clamp(daysBetween(lmpDate, today), 0, 280);
    const gaWeeks = Math.floor(passedDays / 7);
    const gaDays = passedDays % 7;
    const pct = percentagePregnancy(gaWeeks, gaDays);
    const trimester = getTrimesterByWeek(gaWeeks);

    // Remaining countdown
    const remainingDays = clamp(daysBetween(today, dueDate), 0, 280);

    // Cycle projections
    const cycles = predictCycles(lmpDate, cycleNum, 4);

    return {
      lmpDate,
      dueDate,
      conception,
      gaWeeks,
      gaDays,
      pct,
      trimester,
      remainingDays,
      cycles
    };
  }, [lmp, cycleNum]);

  const ring = useMemo(() => {
    const pct = computations?.pct ?? 0;
    const size = 140;
    const stroke = 10;
    const r = (size - stroke) / 2;
    const c = 2 * Math.PI * r;
    const dash = (pct / 100) * c;
    return { size, stroke, r, c, dash, pct };
  }, [computations]);

  const dueDual = computations ? formatDateDual(computations.dueDate) : null;
  const lmpDual = computations ? formatDateDual(computations.lmpDate) : null;
  const concDual = computations ? formatDateDual(computations.conception) : null;

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-500/40 to-yellow-300/20 shadow-[0_0_20px_#eab30855] flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-yellow-400 drop-shadow" />
            </div>
            <span className="text-lg font-display">ماشین حساب سلامت بانوان</span>
          </div>
          <div className="text-xs text-yellow-300/80">Gold • Black • Glass</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="lmp" className="text-muted-foreground">تاریخ اولین روز آخرین قاعدگی (LMP)</Label>
            <Input id="lmp" type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="h-12" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="cycle" className="text-muted-foreground">میانگین طول سیکل (روز)</Label>
            <Input id="cycle" type="number" min="15" max="60" value={avgCycle} onChange={(e) => setAvgCycle(e.target.value)} className="h-12" />
          </div>
          <div className="flex items-end">
            <Button className="w-full h-12 bg-yellow-500/90 hover:bg-yellow-500 text-black font-semibold">محاسبه</Button>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-2">
            <Info className="w-5 h-5 shrink-0 mt-0.5" />
            <div className="space-y-1">
              {warnings.map((w, i) => (<p key={i}>{w}</p>))}
            </div>
          </div>
        )}

        {/* Results */}
        {computations && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Due date card */}
            <div className={cn("glass-effect rounded-2xl p-5 bg-black/30 border border-yellow-500/20",
              "transition-all duration-500 ease-out animate-in fade-in zoom-in")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-yellow-300">
                  <CalendarDays className="w-5 h-5" />
                  <span className="font-semibold">تاریخ تقریبی زایمان</span>
                </div>
                <span className="text-xs text-yellow-200/70">EDD</span>
              </div>
              <div className="mt-3 space-y-1">
                <div className="text-lg">{dueDual?.gregorianFa}</div>
                <div className="text-sm text-muted-foreground">شمسی: {dueDual?.jalali}</div>
              </div>
              <div className="mt-4 text-sm text-foreground">
                {computations.remainingDays > 0 ? (
                  <span>تا زایمان حدود <b className="text-yellow-300">{computations.remainingDays}</b> روز باقی مانده است.</span>
                ) : (
                  <span>تاریخ تخمینی زایمان فرارسیده است.</span>
                )}
              </div>
            </div>

            {/* Gestational age progress ring */}
            <div className="glass-effect rounded-2xl p-5 bg-black/30 border border-yellow-500/20 flex items-center gap-5">
              <div className="relative" style={{ width: ring.size, height: ring.size }}>
                <svg width={ring.size} height={ring.size} viewBox={`0 0 ${ring.size} ${ring.size}`}>
                  <circle cx={ring.size/2} cy={ring.size/2} r={ring.r} strokeWidth={ring.stroke} className="stroke-zinc-700/50" fill="none" />
                  <circle cx={ring.size/2} cy={ring.size/2} r={ring.r} strokeWidth={ring.stroke} fill="none"
                    className={cn(ringColorByPercent(ring.pct), "drop-shadow-[0_0_12px_rgba(234,179,8,0.35)]")}
                    strokeDasharray={`${ring.dash} ${ring.c}`} strokeLinecap="round"
                    transform={`rotate(-90 ${ring.size/2} ${ring.size/2})`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-2xl font-bold text-yellow-300">{ring.pct}%</div>
                  <div className="text-xs text-muted-foreground">پیشرفت</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-lg">سن بارداری: {computations.gaWeeks} هفته و {computations.gaDays} روز</div>
                <div className="text-sm text-muted-foreground">سه‌ماهه: {computations.trimester}</div>
                <div className="text-sm text-muted-foreground">تاریخ احتمالی لقاح: {concDual?.gregorianFa}</div>
              </div>
            </div>

            {/* Cycles */}
            <div className="glass-effect rounded-2xl p-5 bg-black/30 border border-yellow-500/20">
              <div className="flex items-center gap-2 text-yellow-300">
                <HeartPulse className="w-5 h-5" />
                <span className="font-semibold">الگوی سیکل‌ها (۴ دوره آینده)</span>
              </div>
              <ScrollArea className="mt-3 h-48 rounded-md border border-yellow-500/10">
                <ul className="divide-y divide-yellow-500/10">
                  {computations.cycles.map((c, idx) => {
                    const g1 = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(c.start);
                    const g2 = new Intl.DateTimeFormat('fa-IR', { year: 'numeric', month: 'long', day: 'numeric' }).format(c.end);
                    const j1o = gregorianToJalali(c.start); const j1 = `${j1o.jy}/${String(j1o.jm).padStart(2,'0')}/${String(j1o.jd).padStart(2,'0')}`;
                    const j2o = gregorianToJalali(c.end); const j2 = `${j2o.jy}/${String(j2o.jm).padStart(2,'0')}/${String(j2o.jd).padStart(2,'0')}`;
                    return (
                      <li key={idx} className="p-3 flex items-center justify-between">
                        <div>
                          <div className="text-sm">{g1} تا {g2}</div>
                          <div className="text-xs text-muted-foreground">شمسی: {j1} تا {j2}</div>
                        </div>
                        <div className="text-xs text-yellow-300/80">میانگین سیکل: {cycleNum} روز</div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


