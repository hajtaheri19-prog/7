"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Eye, Grid, Aperture } from 'lucide-react';

function SnellenChart() {
  const lines = [
    'E',
    'F P',
    'T O Z',
    'L P E D',
    'P E C F D',
    'E D F C Z P',
    'F E L O P Z D',
  ];
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-6">
      {lines.map((text, idx) => (
        <div
          key={idx}
          className="font-bold text-center tracking-[0.15em]"
          style={{ fontSize: `${2.2 - idx * 0.2}rem` }}
        >
          {text}
        </div>
      ))}
      <p className="text-sm text-muted-foreground mt-4">در فاصله مناسب از صفحه، سطرها را بخوانید.</p>
    </div>
  );
}

function AstigmatismTest() {
  return (
    <div className="flex flex-col items-center justify-center py-6">
      <div className="relative w-72 h-72 rounded-full bg-background/50 border border-yellow-500/30 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <div
            key={i}
            className="absolute inset-0"
            style={{ transform: `rotate(${(360 / 24) * i}deg)` }}
          >
            <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-foreground/70" />
          </div>
        ))}
        <div className="absolute inset-8 rounded-full border border-yellow-500/30" />
      </div>
      <p className="text-sm text-muted-foreground mt-4">اگر برخی خطوط تیره‌تر به نظر می‌رسند، احتمال آستیگماتیسم وجود دارد.</p>
    </div>
  );
}

export default function VipVisionTest() {
  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/35 via-zinc-900/35 to-black/25">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-yellow-500/40 bg-gradient-to-br from-yellow-500/30 to-yellow-300/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-yellow-100" />
          </div>
          <div>
            <CardTitle className="font-display text-xl">تست بینایی VIP</CardTitle>
            <p className="text-sm text-muted-foreground">مجموعه تست‌ها با ظاهر طلایی و مدرن</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="snellen" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 gap-2 bg-background/40">
            <TabsTrigger value="snellen" className="data-[state=active]:bg-yellow-500/20">
              <Grid className="w-4 h-4 ml-2" /> چارت Snellen
            </TabsTrigger>
            <TabsTrigger value="astig" className="data-[state=active]:bg-yellow-500/20">
              <Aperture className="w-4 h-4 ml-2" /> آستیگماتیسم
            </TabsTrigger>
          </TabsList>
          <TabsContent value="snellen">
            <SnellenChart />
          </TabsContent>
          <TabsContent value="astig">
            <AstigmatismTest />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}


