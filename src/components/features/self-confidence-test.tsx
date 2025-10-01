"use client";

import { useMemo, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

const QUESTIONS = [
  'در جمع‌ها با اطمینان صحبت می‌کنم',
  'نظراتم را بدون ترس مطرح می‌کنم',
  'از اشتباه کردن نمی‌ترسم',
  'به توانایی‌هایم باور دارم',
  'برای رسیدن به اهدافم پیگیر هستم',
  'نقد دیگران اعتماد به نفسم را از بین نمی‌برد',
  'از خودم تصویر مثبتی دارم',
  'در تصمیم‌گیری قاطع هستم',
];

export default function SelfConfidenceTest() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const score = useMemo(() => Object.values(answers).reduce((a, b) => a + (b || 0), 0), [answers]);
  const level = useMemo(() => {
    if (score <= 8) return 'پایین';
    if (score <= 16) return 'متوسط';
    return 'بالا';
  }, [score]);
  const progress = useMemo(() => Math.round((Object.keys(answers).length / QUESTIONS.length) * 100), [answers]);
  return (
    <CardContent className="space-y-6">
      {!started ? (
        <div className="space-y-4 text-center">
          <div className="text-sm text-muted-foreground">این تست شامل ۸ سؤال است. هر سؤال را از ۰ تا ۳ امتیاز دهید.</div>
          <button className="h-10 px-6 rounded-md bg-primary text-primary-foreground" onClick={()=>setStarted(true)}>شروع تست</button>
        </div>
      ) : (
        <>
          <Progress value={progress} className="h-2" />
          <div className="text-sm text-muted-foreground">۰ تا ۳ امتیاز بدهید (۰=اصلاً، ۳=کاملاً).</div>
          <div className="space-y-3">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="space-y-1">
                <Label>{i + 1}. {q}</Label>
                <RadioGroup className="flex gap-4" value={String(answers[i] ?? '')} onValueChange={(v)=>setAnswers(prev=>({ ...prev, [i]: Number(v) }))}>
                  {[0,1,2,3].map(v => (
                    <div key={v} className="flex items-center gap-2">
                      <RadioGroupItem id={`c${i}-${v}`} value={String(v)} />
                      <Label htmlFor={`c${i}-${v}`}>{v}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <div className="text-sm">امتیاز: <b>{score}</b> – سطح اعتماد به نفس: <b>{level}</b></div>
        </>
      )}
    </CardContent>
  );
}


