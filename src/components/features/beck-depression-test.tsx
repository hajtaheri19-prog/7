"use client";

import { useMemo, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Progress } from '@/components/ui/progress';

const QUESTIONS = [
  'احساس غمگینی می‌کنم',
  'بدبین شده‌ام',
  'احساس شکست می‌کنم',
  'از خودم ناراضی‌ام',
  'احساس گناه می‌کنم',
  'انتظار مجازات دارم',
  'از خودم متنفرم',
  'خودم را سرزنش می‌کنم',
  'به فکر خودکشی بوده‌ام',
  'بیش‌ازحد گریه می‌کنم',
  'بدخلق و عصبی هستم',
  'علاقه‌ام به دیگران کم شده',
  'تصمیم‌گیری برایم سخت است',
  'احساس بی‌ارزشی می‌کنم',
  'انرژی ندارم',
  'اختلال خواب دارم',
  'زود خسته می‌شوم',
  'اشتهایم کاهش یافته',
  'وزنم کم شده',
  'نگران سلامتی‌ام هستم',
  'میل جنسی‌ام کاهش یافته',
];

export default function BeckDepressionTest() {
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const score = useMemo(() => Object.values(answers).reduce((a, b) => a + (b || 0), 0), [answers]);

  const interpretation = useMemo(() => {
    if (!submitted) return '';
    if (score <= 13) return 'حداقل افسردگی (۰–۱۳)';
    if (score <= 19) return 'افسردگی خفیف (۱۴–۱۹)';
    if (score <= 28) return 'افسردگی متوسط (۲۰–۲۸)';
    return 'افسردگی شدید (۲۹–۶۳)';
  }, [score, submitted]);

  const progress = useMemo(() => Math.round((Object.keys(answers).length / QUESTIONS.length) * 100), [answers]);
  return (
    <CardContent className="space-y-6">
      {!started ? (
        <div className="space-y-4 text-center">
          <div className="text-sm text-muted-foreground">این تست شامل ۲۱ سؤال است. به هر سؤال از ۰ تا ۳ پاسخ دهید.</div>
          <button className="h-10 px-6 rounded-md bg-primary text-primary-foreground" onClick={()=>{ setStarted(true); setSubmitted(false); }}>شروع تست</button>
        </div>
      ) : (
        <>
          <Progress value={progress} className="h-2" />
          <div className="space-y-4">
            {QUESTIONS.map((q, i) => (
              <div key={i} className="space-y-2">
                <Label>{i + 1}. {q}</Label>
                <RadioGroup className="flex gap-4" value={String(answers[i] ?? '')} onValueChange={(v)=>setAnswers(prev=>({ ...prev, [i]: Number(v) }))}>
                  {[0,1,2,3].map(v => (
                    <div key={v} className="flex items-center gap-2">
                      <RadioGroupItem id={`q${i}-${v}`} value={String(v)} />
                      <Label htmlFor={`q${i}-${v}`}>{v}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button className="h-10 px-6 rounded-md bg-primary text-primary-foreground" onClick={()=>setSubmitted(true)} disabled={submitted}>محاسبه نمره</button>
            {submitted && (
              <div className="text-sm">نمره شما: <b>{score}</b> – {interpretation}</div>
            )}
          </div>
        </>
      )}
    </CardContent>
  );
}


