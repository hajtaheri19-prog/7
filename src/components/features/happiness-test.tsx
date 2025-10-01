"use client";

import { useMemo, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

const QUESTIONS = [
  'اغلب احساس رضایت از زندگی دارم',
  'برای آینده انگیزه و امید دارم',
  'روابط اجتماعی من رضایت‌بخش است',
  'در روز انرژی کافی دارم',
  'در برابر مشکلات انعطاف‌پذیرم',
  'قدردان داشته‌هایم هستم',
  'معمولاً احساس شادی می‌کنم',
  'به‌خوبی هیجاناتم را مدیریت می‌کنم',
  'به خودم و توانایی‌هایم باور دارم',
  'معنای روشنی برای زندگی‌ام می‌بینم',
];

export default function HappinessTest() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const score = useMemo(() => Object.values(answers).reduce((a, b) => a + (b || 0), 0), [answers]);
  const level = useMemo(() => {
    if (score <= 10) return 'پایین';
    if (score <= 20) return 'متوسط';
    return 'بالا';
  }, [score]);
  const progress = useMemo(() => Math.round((Object.keys(answers).length / QUESTIONS.length) * 100), [answers]);
  return (
    <CardContent className="space-y-6">
      {!started ? (
        <div className="space-y-4 text-center">
          <div className="text-sm text-muted-foreground">این تست شامل ۱۰ سؤال است. هر سؤال را از ۰ تا ۳ امتیاز دهید.</div>
          <button className="h-10 px-6 rounded-md bg-primary text-primary-foreground" onClick={()=>setStarted(true)}>شروع تست</button>
        </div>
      ) : (
        <>
          <Progress value={progress} className="h-2" />
          <div className="text-sm text-muted-foreground">برای هر مورد ۰ تا ۳ امتیاز بدهید (۰=اصلاً، ۳=کاملاً).</div>
          <div className="space-y-3">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="space-y-1">
                <Label>{i + 1}. {q}</Label>
                <RadioGroup className="flex gap-4" value={String(answers[i] ?? '')} onValueChange={(v)=>setAnswers(prev=>({ ...prev, [i]: Number(v) }))}>
                  {[0,1,2,3].map(v => (
                    <div key={v} className="flex items-center gap-2">
                      <RadioGroupItem id={`h${i}-${v}`} value={String(v)} />
                      <Label htmlFor={`h${i}-${v}`}>{v}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <div className="text-sm">امتیاز: <b>{score}</b> – سطح شادی: <b>{level}</b></div>
        </>
      )}
    </CardContent>
  );
}


