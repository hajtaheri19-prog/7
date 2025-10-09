
'use client';
import { ThemeToggle } from './theme-toggle';
import Image from 'next/image';
import Link from 'next/link';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import { Clock, Download } from 'lucide-react';
import { useIsMobile } from "@/hooks/use-mobile";


const LiveClock = () => {
    const [time, setTime] = useState<Date | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        setTime(new Date()); // Set initial time on client
        const timerId = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, []);

    if (!isClient || !time) {
        // Render a placeholder on the server and during initial client render
        return (
             <div className="flex items-center space-x-2 space-x-reverse bg-background/50 rounded-full px-4 py-2 h-9 w-28">
                <Clock className="w-5 h-5 text-primary" />
            </div>
        );
    }

    const formattedTime = time.toLocaleTimeString('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    return (
        <div className="flex items-center space-x-2 space-x-reverse bg-background/50 rounded-full px-4 py-2">
            <Clock className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-primary text-base font-display font-semibold text-glow">{formattedTime}</span>
        </div>
    );
};

export default function Header() {
  const logo = PlaceHolderImages.find(p => p.id === 'logo');
  
  return (
    <header className="glass-effect rounded-b-3xl p-4 mb-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-primary/10 rounded-full p-2">
            {logo && (
              <Image 
                src={logo.imageUrl}
                width={48}
                height={48}
                alt={logo.description}
                className="animate-float"
                data-ai-hint={logo.imageHint}
              />
            )}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold gradient-text">تبدیلا</h1>
            <p className="text-muted-foreground text-sm font-body hidden sm:block">دستیار هوشمند شما ✨</p>
          </div>
        </Link>
        <div className="flex items-center gap-2">
            <div className="sm:flex">
              <LiveClock />
            </div>
            <button
              onClick={() => {
                try { window.dispatchEvent(new Event('pwa:showInstall')); } catch {}
              }}
              className="hidden sm:inline-flex items-center gap-1 h-9 px-3 rounded-lg border bg-white/70 dark:bg-black/30 text-foreground hover:bg-white/90 transition"
              title="نصب تبدیلا"
            >
              <Download className="w-4 h-4" /> نصب
            </button>
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
