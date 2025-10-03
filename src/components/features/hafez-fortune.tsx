"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Copy, Download, Heart, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Interface for Hafez fortune data
interface HafezFortune {
  id: number;
  poem: string;
  continuation: string;
  meaning: string;
  interpretation: string;
}

export default function HafezFortune() {
  const [currentFortune, setCurrentFortune] = useState<HafezFortune | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fortuneHistory, setFortuneHistory] = useState<HafezFortune[]>([]);
  const [hafezFortunes, setHafezFortunes] = useState<HafezFortune[]>([]);
  
  const { toast } = useToast();

  // Load on demand from API backed by content folder (single source of truth)
  useEffect(() => {
    setHafezFortunes([]);
  }, []);

  const getRandomFortune = () => {
    setIsLoading(true);
    (async () => {
      try {
        const res = await fetch('/api/hafez', { cache: 'no-store' });
        if (!res.ok) throw new Error('network');
        const fortune = await res.json() as HafezFortune;
        setCurrentFortune(fortune);
        setFortuneHistory(prev => [fortune, ...prev.slice(0, 4)]);
        toast({ title: "فال جدید", description: "فال حافظ برای شما آماده شد" });
      } catch (e) {
        toast({ title: "خطا", description: "امکان دریافت فال وجود ندارد", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    })();
  };

  const copyFortune = async () => {
    if (!currentFortune) return;
    
    const fortuneText = `${currentFortune.poem}\n${currentFortune.continuation}\n\nتفسیر: ${currentFortune.interpretation}`;
    
    try {
      await navigator.clipboard.writeText(fortuneText);
      toast({
        title: "کپی شد",
        description: "فال حافظ کپی شد",
      });
    } catch (error) {
      toast({
        title: "خطا در کپی",
        description: "امکان کپی وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const downloadFortune = () => {
    if (!currentFortune) return;
    
    const fortuneText = `فال حافظ - ${new Date().toLocaleDateString('fa-IR')}\n\n${currentFortune.poem}\n${currentFortune.continuation}\n\nتفسیر: ${currentFortune.interpretation}`;
    
    const blob = new Blob([fortuneText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fale-hafez-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "دانلود شد",
      description: "فال حافظ دانلود شد",
    });
  };

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="glass-effect rounded-2xl p-5 mb-4 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/40 to-pink-500/20 shadow-[0_0_18px_#a855f755] flex items-center justify-center">
            <Heart className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="text-lg font-display font-semibold text-foreground">فال حافظ</div>
            <div className="text-sm text-foreground/70">فال‌گیری با اشعار زیبای حافظ شیرازی</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Get Fortune Button */}
        <div className="text-center">
          <Button 
            onClick={getRandomFortune}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold h-14 px-8 text-lg"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                در حال فال‌گیری...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                فال بگیر
              </>
            )}
          </Button>
        </div>

        {/* Current Fortune */}
        <AnimatePresence>
          {currentFortune && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Poem */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-purple-500/30">
                <div className="text-center space-y-4">
                  <div className="text-2xl font-bold text-purple-200 mb-4">
                    فال شماره {currentFortune.id}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-xl font-bold text-foreground leading-relaxed">
                      {currentFortune.poem}
                    </div>
                    <div className="text-lg text-purple-300 leading-relaxed">
                      {currentFortune.continuation}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interpretation */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30">
                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-green-300 flex items-center gap-2">
                    <Sparkles className="w-5 h-5" />
                    تفسیر فال
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    {currentFortune.interpretation}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 justify-center">
                <Button
                  onClick={copyFortune}
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  کپی فال
                </Button>
                <Button
                  onClick={downloadFortune}
                  variant="outline"
                  className="border-pink-500/30 hover:bg-pink-500/20"
                >
                  <Download className="w-4 h-4 mr-2" />
                  دانلود
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Fortune History */}
        {fortuneHistory.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-purple-300 text-center">
              فال‌های اخیر
            </h3>
            <div className="space-y-2">
              {fortuneHistory.map((fortune, index) => (
                <motion.div
                  key={fortune.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-3 rounded-xl bg-black/20 border border-purple-500/20 cursor-pointer hover:border-purple-500/40 transition-all"
                  onClick={() => setCurrentFortune(fortune)}
                >
                  <div className="text-sm text-purple-200">
                    فال شماره {fortune.id}
                  </div>
                  <div className="text-xs text-foreground/70 truncate">
                    {fortune.poem}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!currentFortune && (
          <div className="text-center py-8 text-foreground/60 space-y-2">
            <Heart className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <p>برای گرفتن فال حافظ روی دکمه بالا کلیک کنید</p>
            <p className="text-sm">اشعار زیبا و تفسیرهای معنوی حافظ شیرازی</p>
          </div>
        )}

        {/* Information */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
          <h4 className="text-sm font-bold text-yellow-300 mb-2">درباره فال حافظ:</h4>
          <ul className="text-xs text-foreground/70 space-y-1">
            <li>• حافظ شیرازی از بزرگترین شاعران فارسی است</li>
            <li>• فال حافظ سنتی دیرینه در فرهنگ ایرانی است</li>
            <li>• اشعار حافظ پر از معانی عمیق و حکمت است</li>
            <li>• فال‌گیری با نیت خالص و قلب پاک انجام دهید</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}