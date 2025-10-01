"use client"

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Loader, Sparkles } from 'lucide-react';

export default function Loading() {
  const logo = PlaceHolderImages.find(p => p.id === 'logo');

  return (
    <div className="relative gradient-bg flex items-center justify-center min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 animate-pulse opacity-20">
        <svg width="100%" height="100%">
          <defs>
            <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
          <circle cx="15%" cy="20%" r="120" fill="url(#g)" />
          <circle cx="85%" cy="30%" r="160" fill="url(#g)" />
          <circle cx="50%" cy="80%" r="180" fill="url(#g)" />
        </svg>
      </div>
      <div className="text-center p-8 glass-effect rounded-3xl shadow-2xl flex flex-col items-center gap-5 backdrop-blur-md">
        {logo && (
          <Image
            src={logo.imageUrl}
            width={80}
            height={80}
            alt="لوگوی تبدیلا"
            className="animate-float"
            data-ai-hint={logo.imageHint}
          />
        )}
        <div className="w-64 h-2 rounded-full bg-background/40 overflow-hidden">
          <div className="h-full w-1/3 bg-primary animate-[progress_1.6s_ease-in-out_infinite] rounded-full" />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>در حال آماده‌سازی تجربه شما...</span>
        </div>
        <style jsx>{`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(30%); }
            100% { transform: translateX(120%); }
          }
        `}</style>
      </div>
    </div>
  );
}
