"use client";

import React from 'react';
import Image from 'next/image';
import { Loader2, Sparkles } from 'lucide-react';

export default function SplashScreen() {
  const [show, setShow] = React.useState<boolean>(false);

  React.useEffect(() => {
    const key = 'splash_shown_once';
    const already = typeof window !== 'undefined' ? sessionStorage.getItem(key) : '1';
    if (!already) {
      setShow(true);
      const t = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem(key, '1');
      }, 2500);
      return () => clearTimeout(t);
    }
    setShow(false);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/95 backdrop-blur-md">
      <div className="text-center p-8 glass-effect rounded-3xl shadow-2xl flex flex-col items-center gap-6 border border-white/10">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 rounded-full blur-lg animate-pulse" />
          <Image src="/icons/icon-192.png" width={96} height={96} alt="لوگو" className="relative z-10 drop-shadow-2xl" />
          <div className="absolute -top-2 -right-2">
            <Sparkles className="w-5 h-5 text-yellow-400 animate-spin" />
          </div>
        </div>
        <div className="flex items-center gap-3 text-2xl font-bold text-primary text-glow">
          <Loader2 className="animate-spin w-7 h-7" />
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">تبدیلا</span>
        </div>
        <div className="w-64 h-2 bg-muted/30 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}


