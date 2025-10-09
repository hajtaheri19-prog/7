
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Bell, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PWAInstallPrompt() {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const { toast } = useToast();
  const [isInstalled, setIsInstalled] = useState(false);
  const [hasPrompt, setHasPrompt] = useState(false);
  
  useEffect(() => {
      setIsClient(true);
      try {
        const installed = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || (navigator as any).standalone === true;
        setIsInstalled(!!installed);
      } catch {}
  }, []);

  useEffect(() => {
    if(!isClient) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      // Only suppress within the current session if user clicked "بعداً"
      const dismissedThisSession = sessionStorage.getItem('pwaInstallDismissedSession') === '1';
      if (dismissedThisSession) return;
      const ev = e as BeforeInstallPromptEvent;
      try { (window as any).deferredInstallPrompt = ev; } catch {}
      setInstallPromptEvent(ev);
      setHasPrompt(true);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    const openByEvent = () => setIsVisible(true);
    window.addEventListener('pwa:showInstall', openByEvent as any);
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsVisible(false);
      setInstallPromptEvent(null);
      setHasPrompt(false);
      try { (window as any).deferredInstallPrompt = null; } catch {}
      toast({ title: 'نصب شد ✅', description: 'تبدیلا به صفحه اصلی شما اضافه شد.' });
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('pwa:showInstall', openByEvent as any);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isClient]);

  // Ensure prompt card shows for all visitors (even if event hasn't fired yet)
  useEffect(() => {
    if (!isClient) return;
    const dismissedThisSession = sessionStorage.getItem('pwaInstallDismissedSession') === '1';
    if (!isInstalled && !dismissedThisSession) {
      // Small delay to let beforeinstallprompt fire if possible
      const t = setTimeout(() => setIsVisible(true), 400);
      return () => clearTimeout(t);
    }
  }, [isClient, isInstalled]);

  const handleInstallClick = useCallback(async () => {
    let ev = installPromptEvent || (typeof window !== 'undefined' ? (window as any).deferredInstallPrompt : null);
    if (!ev) {
      toast({ title: 'نصب از مرورگر', description: 'در منوی مرورگر گزینه «Add to Home screen / نصب اپ» را انتخاب کنید.' });
      return;
    }

    ev.prompt();
    const { outcome } = await ev.userChoice;

    if (outcome === 'accepted') {
      toast({ title: 'نصب موفق!', description: 'اپلیکیشن با موفقیت به دستگاه شما اضافه شد.' });
    } else {
       // User dismissed the prompt, don't show it again for a day
       localStorage.setItem('pwaInstallDismissed', Date.now().toString());
    }
    setIsVisible(false);
    setInstallPromptEvent(null);
  }, [installPromptEvent, toast]);
  const handleLater = useCallback(() => {
    // Suppress only for current tab session to satisfy "برای هر کسی که وارد می‌شود نمایش بده"
    sessionStorage.setItem('pwaInstallDismissedSession', '1');
    setIsVisible(false);
  }, []);
  
  // Optional: show a welcome notification if Notification permission is granted
  useEffect(() => {
    if (!isClient) return;
    if ('Notification' in window && Notification.permission === 'default') {
      // Ask once per day
      const key = 'notifPromptAt';
      const last = localStorage.getItem(key);
      const day = 24*60*60*1000;
      if (!last || Date.now() - Number(last) > day) {
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            try { new Notification('تبریک! ✨', { body: 'از این پس اعلان‌های مفید را دریافت خواهید کرد.' }); } catch {}
          }
          localStorage.setItem(key, Date.now().toString());
        });
      }
    }
  }, [isClient]);
  
  if (!isClient || isInstalled || !isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[420px] z-50">
      <div className="glass-effect rounded-2xl border shadow-xl p-4 bg-white/80 dark:bg-black/50">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary">
            <Download className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold text-foreground">نصب تبدیلا</div>
            <div className="text-sm text-muted-foreground mt-1">برای دسترسی سریع‌تر، برنامه را نصب کنید.</div>
            <div className="mt-3 flex items-center gap-2">
              <Button onClick={handleInstallClick} className="h-10 px-4">
                نصب
              </Button>
              <Button variant="secondary" onClick={handleLater} className="h-10 px-4">
                بعداً
              </Button>
              {('Notification' in window) && Notification.permission !== 'granted' && (
                <Button
                  variant="outline"
                  onClick={() => Notification.requestPermission()}
                  className="h-10 px-3"
                >
                  <Bell className="ml-2 h-4 w-4" /> اعلان‌ها
                </Button>
              )}
            </div>
            {!hasPrompt && (
              <div className="text-xs text-muted-foreground mt-2 leading-6">
                <div>اگر پنجره نصب باز نشد:</div>
                <div className="md:hidden">روی منوی مرورگر بزنید و «افزودن به صفحهٔ اصلی» را انتخاب کنید.</div>
                <div className="hidden md:block">در مرورگر دسکتاپ، از منوی ⋮ یا ⋯ گزینه «Install App / نصب اپ» را بزنید.</div>
              </div>
            )}
          </div>
          <button onClick={handleLater} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
