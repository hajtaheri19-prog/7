"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  BookOpen, 
  Eye, 
  Zap, 
  TrendingUp, 
  Target,
  Timer,
  FileText,
  BarChart3,
  Users
} from 'lucide-react';

// تنظیمات سرعت خواندن
const readingSpeeds = {
  slow: { wpm: 150, label: 'آهسته', description: 'خواندن دقیق و عمیق' },
  normal: { wpm: 200, label: 'عادی', description: 'سرعت معمول خواندن' },
  fast: { wpm: 300, label: 'سریع', description: 'خواندن سریع و مروری' },
  expert: { wpm: 400, label: 'متخصص', description: 'خواندن حرفه‌ای' }
};

interface ReadingStats {
  wordCount: number;
  characterCount: number;
  readingTime: number;
  readingTimeFormatted: string;
  speed: string;
  insights: string[];
}

export default function ReadingTimeCalculator() {
  const [text, setText] = useState<string>('');
  const [speed, setSpeed] = useState<string>('normal');
  const [stats, setStats] = useState<ReadingStats | null>(null);

  // تابع شمارش کلمات فارسی (بهبود یافته)
  const countWords = (text: string): number => {
    if (!text.trim()) return 0;
    
    // حذف فاصله‌های اضافی و تقسیم بر فاصله
    const words = text
      .trim()
      .replace(/\s+/g, ' ') // جایگزینی فاصله‌های متعدد با یک فاصله
      .split(' ')
      .filter(word => {
        // حذف کلمات خالی و کاراکترهای خاص
        const cleanWord = word.replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF\w]/g, '');
        return cleanWord.length > 0;
      });
    
    return words.length;
  };

  // تابع شمارش کاراکترها
  const countCharacters = (text: string): number => {
    return text.replace(/\s/g, '').length; // حذف فاصله‌ها
  };

  // تابع محاسبه زمان خواندن
  const calculateReadingTime = (wordCount: number, wpm: number): number => {
    return wordCount / wpm;
  };

  // تابع فرمت کردن زمان
  const formatReadingTime = (timeInMinutes: number): string => {
    if (timeInMinutes < 1) {
      const seconds = Math.round(timeInMinutes * 60);
      return `${seconds} ثانیه`;
    } else if (timeInMinutes < 60) {
      const minutes = Math.round(timeInMinutes);
      return `${minutes} دقیقه`;
    } else {
      const hours = Math.floor(timeInMinutes / 60);
      const minutes = Math.round(timeInMinutes % 60);
      if (minutes === 0) {
        return `${hours} ساعت`;
      }
      return `${hours} ساعت و ${minutes} دقیقه`;
    }
  };

  // تابع تولید بینش‌ها (بهبود یافته)
  const generateInsights = (wordCount: number, readingTime: number, speed: string): string[] => {
    const insights: string[] = [];
    
    if (wordCount === 0) {
      return ['متن خالی است'];
    }
    
    // بینش‌های طول متن
    if (wordCount < 50) {
      insights.push('متن کوتاه - مناسب برای خواندن سریع');
    } else if (wordCount < 200) {
      insights.push('متن متوسط - زمان مناسبی برای مطالعه');
    } else if (wordCount < 500) {
      insights.push('متن طولانی - نیاز به تمرکز بیشتر');
    } else if (wordCount < 1000) {
      insights.push('متن بسیار طولانی - بهتر است در چند بخش مطالعه شود');
    } else {
      insights.push('متن فوق‌العاده طولانی - نیاز به برنامه‌ریزی دقیق');
    }
    
    // بینش‌های زمان خواندن
    if (readingTime < 1) {
      insights.push('زمان خواندن کمتر از یک دقیقه');
    } else if (readingTime < 5) {
      insights.push('زمان خواندن مناسب برای مطالعه سریع');
    } else if (readingTime < 15) {
      insights.push('زمان خواندن متوسط - نیاز به برنامه‌ریزی');
    } else if (readingTime < 30) {
      insights.push('زمان خواندن طولانی - بهتر است در چند جلسه مطالعه شود');
    } else {
      insights.push('زمان خواندن بسیار طولانی - نیاز به استراحت بین جلسات');
    }
    
    // بینش‌های سرعت خواندن
    const speedInfo = readingSpeeds[speed as keyof typeof readingSpeeds];
    insights.push(`با سرعت ${speedInfo.label} (${speedInfo.wpm} کلمه/دقیقه)`);
    
    // بینش‌های اضافی
    if (wordCount > 100 && readingTime > 10) {
      insights.push('توصیه: برای مطالعه بهتر، متن را به بخش‌های کوچک‌تر تقسیم کنید');
    }
    
    if (readingTime > 20) {
      insights.push('توصیه: برای حفظ تمرکز، هر 15-20 دقیقه استراحت کنید');
    }
    
    return insights;
  };

  // محاسبه آمار
  const calculateStats = () => {
    if (!text.trim()) {
      setStats(null);
      return;
    }

    const wordCount = countWords(text);
    const characterCount = countCharacters(text);
    const speedInfo = readingSpeeds[speed as keyof typeof readingSpeeds];
    const readingTime = calculateReadingTime(wordCount, speedInfo.wpm);
    const readingTimeFormatted = formatReadingTime(readingTime);
    const insights = generateInsights(wordCount, readingTime, speed);

    setStats({
      wordCount,
      characterCount,
      readingTime,
      readingTimeFormatted,
      speed: speedInfo.label,
      insights
    });
  };

  useEffect(() => {
    calculateStats();
  }, [text, speed]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-300/20 rounded-xl flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.2)] border border-blue-500/30">
            <BookOpen className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">محاسبه زمان خواندن متن</h2>
        </div>
        <p className="text-muted-foreground">محاسبه دقیق زمان مورد نیاز برای خواندن متن شما</p>
      </div>

      {/* Input Form */}
      <Card className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-black/30 via-zinc-900/30 to-black/20 border border-primary/20 shadow-[0_0_30px_hsl(var(--primary)/0.1)]">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm font-medium text-foreground">متن مورد نظر</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="متن خود را اینجا بنویسید..."
              className="min-h-[200px] bg-background/50 border-primary/30 focus:border-primary/50 resize-none"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="speed" className="text-sm font-medium text-foreground">سرعت خواندن</Label>
            <Select value={speed} onValueChange={setSpeed}>
              <SelectTrigger className="bg-background/50 border-primary/30 focus:border-primary/50">
                <SelectValue placeholder="انتخاب سرعت خواندن" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(readingSpeeds).map(([key, value]) => (
                  <SelectItem key={key} value={key}>
                    <div className="flex flex-col">
                      <span className="font-medium">{value.label}</span>
                      <span className="text-xs text-muted-foreground">{value.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results */}
      {stats && (
        <div className="space-y-6">
          {/* Main Result */}
          <Card className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-blue-500/10 border border-blue-500/20 shadow-[0_0_30px_#3b82f622]">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-6 h-6 text-blue-400" />
                <h3 className="text-xl font-bold text-foreground">زمان خواندن</h3>
              </div>
              
              <div className="space-y-3">
                <div className="text-3xl font-bold text-blue-400">
                  {stats.readingTimeFormatted}
                </div>
                <div className="text-sm text-muted-foreground">
                  با سرعت {stats.speed} ({readingSpeeds[speed as keyof typeof readingSpeeds].wpm} کلمه/دقیقه)
                </div>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <Card className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.1)]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">آمار متن</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">کلمات</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {stats.wordCount.toLocaleString('fa-IR')}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">کاراکترها</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {stats.characterCount.toLocaleString('fa-IR')}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-primary/10">
                  <div className="flex items-center gap-2">
                    <Timer className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">زمان</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    {stats.readingTimeFormatted}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Insights */}
          <Card className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-green-500/10 via-emerald-500/5 to-green-500/10 border border-green-500/20 shadow-[0_0_30px_#10b98122]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <h3 className="text-lg font-semibold text-foreground">بینش‌ها و توصیه‌ها</h3>
              </div>
              
              <div className="space-y-2">
                {stats.insights.map((insight, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-background/30 rounded-lg border border-green-500/10">
                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 shrink-0" />
                    <span className="text-sm text-foreground">{insight}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Reading Speed Comparison */}
          <Card className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-purple-500/10 via-violet-500/5 to-purple-500/10 border border-purple-500/20 shadow-[0_0_30px_#8b5cf622]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold text-foreground">مقایسه سرعت‌های مختلف</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(readingSpeeds).map(([key, value]) => {
                  const time = calculateReadingTime(stats.wordCount, value.wpm);
                  const formatted = formatReadingTime(time);
                  const isSelected = key === speed;
                  
                  return (
                    <div 
                      key={key}
                      className={`p-3 rounded-lg border transition-all ${
                        isSelected 
                          ? 'bg-purple-500/20 border-purple-500/40 shadow-[0_0_15px_#8b5cf644]' 
                          : 'bg-background/30 border-purple-500/10 hover:border-purple-500/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm">{value.label}</div>
                          <div className="text-xs text-muted-foreground">{value.wpm} کلمه/دقیقه</div>
                        </div>
                        <div className="text-sm font-semibold text-purple-400">{formatted}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}