"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import VipVisionTest from '@/components/features/vip-vision-test';
import ColorVisionTest from '@/components/features/color-vision-test';
import HearingTest from '@/components/features/hearing-test';
import { Eye, Crown, Sparkles } from 'lucide-react';

export default function VisionTestHub() {
  const [mode, setMode] = useState<'standard' | 'vip' | null>(null);

  if (mode === 'vip') {
    return <VipVisionTest />;
  }

  if (mode === 'standard') {
    return (
      <div className="space-y-6">
        <ColorVisionTest />
        <HearingTest />
      </div>
    );
  }

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/35 via-zinc-900/35 to-black/25">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl border border-yellow-500/40 bg-gradient-to-br from-yellow-500/30 to-yellow-300/20 flex items-center justify-center">
            <Eye className="w-5 h-5 text-yellow-100" />
          </div>
          <div>
            <CardTitle className="font-display text-xl">مرکز تست بینایی</CardTitle>
            <p className="text-sm text-muted-foreground">انتخاب کنید: حالت استاندارد یا VIP</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button onClick={() => setMode('standard')} variant="outline" className="h-14 rounded-2xl border-yellow-500/30">
            <Eye className="w-5 h-5 ml-2" /> حالت استاندارد
          </Button>
          <Button onClick={() => setMode('vip')} className="h-14 rounded-2xl bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-black font-bold">
            <Crown className="w-5 h-5 ml-2" /> حالت VIP <Sparkles className="w-4 h-4 mr-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}


