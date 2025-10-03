"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, Copy, RefreshCw, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Persian months
const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Gregorian months
const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function TimestampConverter() {
  const [activeTab, setActiveTab] = useState('timestamp-to-date');
  const [timestamp, setTimestamp] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [gregorianTime, setGregorianTime] = useState('');
  const [persianYear, setPersianYear] = useState('');
  const [persianMonth, setPersianMonth] = useState('');
  const [persianDay, setPersianDay] = useState('');
  const [persianTime, setPersianTime] = useState('');
  const [results, setResults] = useState<any>(null);
  
  const { toast } = useToast();

  // Persian calendar conversion functions
  const isLeapPersianYear = (year: number): boolean => {
    const breaks = [
      -61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210,
      1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178
    ];
    
    let jp = breaks[0];
    let jump = 0;
    for (let j = 1; j < breaks.length; j++) {
      const jm = breaks[j];
      jump = jm - jp;
      if (year < jm) break;
      jp = jm;
    }
    
    let n = year - jp;
    if (n < jump) {
      if (jump - n < 6) n = n - jump + ((jump + 4) / 6) * 6;
      const leap = ((n + 1) % 33) % 4;
      if (jump === 33 && leap === 1) return true;
      return leap === 1;
    }
    return false;
  };

  const persianToGregorian = (jy: number, jm: number, jd: number): Date => {
    let gy, gm, gd;
    
    if (jy <= 979) {
      cy = 1595;
      gy = 621;
    } else {
      cy = 1355;
      gy = 1600;
    }
    
    jy += 1595 - cy;
    let days = 365 * jy + Math.floor((jy / 33)) * 8 + Math.floor(((jy % 33) + 3) / 4);
    
    for (let i = 0; i < jm; i++) {
      if (i < 6) days += 31;
      else days += 30;
    }
    
    days += jd;
    
    gy += 400 * Math.floor(days / 146097);
    days %= 146097;
    
    let leap = true;
    if (days >= 36525) {
      days--;
      gy += 100 * Math.floor(days / 36524);
      days %= 36524;
      if (days >= 365) days++;
      else leap = false;
    }
    
    gy += 4 * Math.floor(days / 1461);
    days %= 1461;
    
    if (days >= 366) {
      leap = false;
      days--;
      gy += Math.floor(days / 365);
      days = days % 365;
    }
    
    gd = days + 1;
    
    const sal_a = leap ? [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335, 366]
                      : [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
    
    gm = 0;
    for (let i = 0; i < 13; i++) {
      if (gd <= sal_a[i]) {
        gm = i;
        break;
      }
    }
    
    if (gm > 1) gd = gd - sal_a[gm - 1];
    
    return new Date(gy, gm - 1, gd);
  };

  const gregorianToPersian = (date: Date): { year: number, month: number, day: number } => {
    let gy = date.getFullYear();
    const gm = date.getMonth() + 1;
    const gd = date.getDate();
    
    let jy, jm, jd;
    
    if (gy <= 1600) {
      jy = 0;
      gy -= 621;
    } else {
      jy = 979;
      gy -= 1600;
    }
    
    if (gm > 2) {
      gy2 = gy + 1;
    } else {
      gy2 = gy;
    }
    
    let days = 365 * gy + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) - 80 + gd;
    
    const sal_a = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    if (gm > 2) {
      days += sal_a[gm - 1];
    } else {
      days += sal_a[gm - 1] - 1;
    }
    
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    
    if (days >= 366) {
      jy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    
    if (days < 186) {
      jm = 1 + Math.floor(days / 31);
      jd = 1 + (days % 31);
    } else {
      jm = 7 + Math.floor((days - 186) / 30);
      jd = 1 + ((days - 186) % 30);
    }
    
    return { year: jy, month: jm, day: jd };
  };

  // Helper variables for conversion
  let cy: number, gy2: number;

  const convertTimestampToDate = () => {
    try {
      const ts = parseInt(timestamp);
      if (isNaN(ts)) {
        toast({
          title: "خطا در تایم‌استمپ",
          description: "لطفاً عدد معتبر وارد کنید",
          variant: "destructive"
        });
        return;
      }

      // Convert timestamp to date (handle both seconds and milliseconds)
      const date = new Date(ts > 1e10 ? ts : ts * 1000);
      
      if (isNaN(date.getTime())) {
        toast({
          title: "تایم‌استمپ نامعتبر",
          description: "تایم‌استمپ وارد شده معتبر نیست",
          variant: "destructive"
        });
        return;
      }

      // Convert to Persian date
      const persian = gregorianToPersian(date);
      
      setResults({
        type: 'timestamp-to-date',
        timestamp: ts,
        gregorian: {
          date: date.toLocaleDateString('en-US'),
          time: date.toLocaleTimeString('en-US', { hour12: false }),
          full: date.toLocaleString('en-US'),
          iso: date.toISOString(),
          weekday: date.toLocaleDateString('en-US', { weekday: 'long' })
        },
        persian: {
          date: `${persian.year}/${persian.month.toString().padStart(2, '0')}/${persian.day.toString().padStart(2, '0')}`,
          time: date.toLocaleTimeString('fa-IR', { hour12: false }),
          full: `${persian.day} ${PERSIAN_MONTHS[persian.month - 1]} ${persian.year}`,
          weekday: date.toLocaleDateString('fa-IR', { weekday: 'long' })
        },
        unix: Math.floor(date.getTime() / 1000),
        milliseconds: date.getTime()
      });

    } catch (error) {
      toast({
        title: "خطا در تبدیل",
        description: "امکان تبدیل تایم‌استمپ وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const convertGregorianToTimestamp = () => {
    try {
      if (!gregorianDate || !gregorianTime) {
        toast({
          title: "اطلاعات ناقص",
          description: "لطفاً تاریخ و زمان را کامل وارد کنید",
          variant: "destructive"
        });
        return;
      }

      const date = new Date(`${gregorianDate}T${gregorianTime}`);
      
      if (isNaN(date.getTime())) {
        toast({
          title: "تاریخ نامعتبر",
          description: "تاریخ یا زمان وارد شده معتبر نیست",
          variant: "destructive"
        });
        return;
      }

      const persian = gregorianToPersian(date);
      
      setResults({
        type: 'gregorian-to-timestamp',
        gregorian: {
          input: `${gregorianDate} ${gregorianTime}`,
          date: date.toLocaleDateString('en-US'),
          time: date.toLocaleTimeString('en-US', { hour12: false }),
          iso: date.toISOString()
        },
        persian: {
          date: `${persian.year}/${persian.month.toString().padStart(2, '0')}/${persian.day.toString().padStart(2, '0')}`,
          full: `${persian.day} ${PERSIAN_MONTHS[persian.month - 1]} ${persian.year}`
        },
        unix: Math.floor(date.getTime() / 1000),
        milliseconds: date.getTime()
      });

    } catch (error) {
      toast({
        title: "خطا در تبدیل",
        description: "امکان تبدیل تاریخ میلادی وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const convertPersianToTimestamp = () => {
    try {
      const year = parseInt(persianYear);
      const month = parseInt(persianMonth);
      const day = parseInt(persianDay);
      
      if (isNaN(year) || isNaN(month) || isNaN(day) || 
          month < 1 || month > 12 || day < 1 || day > 31) {
        toast({
          title: "تاریخ نامعتبر",
          description: "لطفاً تاریخ شمسی معتبر وارد کنید",
          variant: "destructive"
        });
        return;
      }

      if (!persianTime) {
        toast({
          title: "زمان وارد نشده",
          description: "لطفاً زمان را وارد کنید",
          variant: "destructive"
        });
        return;
      }

      const gregorianDate = persianToGregorian(year, month - 1, day);
      const [hours, minutes] = persianTime.split(':').map(Number);
      
      if (isNaN(hours) || isNaN(minutes)) {
        toast({
          title: "زمان نامعتبر",
          description: "لطفاً زمان را به فرمت HH:MM وارد کنید",
          variant: "destructive"
        });
        return;
      }

      gregorianDate.setHours(hours, minutes, 0, 0);
      
      setResults({
        type: 'persian-to-timestamp',
        persian: {
          input: `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')} ${persianTime}`,
          date: `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}`,
          full: `${day} ${PERSIAN_MONTHS[month - 1]} ${year}`
        },
        gregorian: {
          date: gregorianDate.toLocaleDateString('en-US'),
          time: gregorianDate.toLocaleTimeString('en-US', { hour12: false }),
          iso: gregorianDate.toISOString()
        },
        unix: Math.floor(gregorianDate.getTime() / 1000),
        milliseconds: gregorianDate.getTime()
      });

    } catch (error) {
      toast({
        title: "خطا در تبدیل",
        description: "امکان تبدیل تاریخ شمسی وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "کپی شد",
        description: `${label} کپی شد: ${text}`,
      });
    } catch (error) {
      toast({
        title: "خطا در کپی",
        description: "امکان کپی وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const getCurrentTimestamp = () => {
    const now = Date.now();
    setTimestamp(Math.floor(now / 1000).toString());
  };

  const resetForm = () => {
    setTimestamp('');
    setGregorianDate('');
    setGregorianTime('');
    setPersianYear('');
    setPersianMonth('');
    setPersianDay('');
    setPersianTime('');
    setResults(null);
  };

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="glass-effect rounded-2xl p-5 mb-4 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/40 to-red-500/20 shadow-[0_0_18px_#ea580c55] flex items-center justify-center">
            <Hash className="w-5 h-5 text-orange-300" />
          </div>
          <div>
            <div className="text-lg font-display font-semibold text-foreground">مبدل تایم‌استمپ</div>
            <div className="text-sm text-foreground/70">تبدیل بین تایم‌استمپ و تاریخ شمسی/میلادی</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="timestamp-to-date" className="text-xs">تایم‌استمپ → تاریخ</TabsTrigger>
            <TabsTrigger value="gregorian-to-timestamp" className="text-xs">میلادی → تایم‌استمپ</TabsTrigger>
            <TabsTrigger value="persian-to-timestamp" className="text-xs">شمسی → تایم‌استمپ</TabsTrigger>
          </TabsList>

          {/* Timestamp to Date */}
          <TabsContent value="timestamp-to-date" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>تایم‌استمپ یونیکس</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={timestamp}
                    onChange={(e) => setTimestamp(e.target.value)}
                    placeholder="1640995200"
                    className="flex-1"
                  />
                  <Button onClick={getCurrentTimestamp} variant="outline" size="sm">
                    <Clock className="w-4 h-4" />
                  </Button>
                </div>
                <div className="text-xs text-foreground/60">
                  تایم‌استمپ یونیکس (ثانیه یا میلی‌ثانیه از 1 ژانویه 1970)
                </div>
              </div>
              
              <Button onClick={convertTimestampToDate} className="w-full bg-gradient-to-r from-orange-500 to-red-500">
                تبدیل به تاریخ
              </Button>
            </div>
          </TabsContent>

          {/* Gregorian to Timestamp */}
          <TabsContent value="gregorian-to-timestamp" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>تاریخ میلادی</Label>
                  <Input
                    type="date"
                    value={gregorianDate}
                    onChange={(e) => setGregorianDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>زمان</Label>
                  <Input
                    type="time"
                    value={gregorianTime}
                    onChange={(e) => setGregorianTime(e.target.value)}
                  />
                </div>
              </div>
              
              <Button onClick={convertGregorianToTimestamp} className="w-full bg-gradient-to-r from-blue-500 to-purple-500">
                تبدیل به تایم‌استمپ
              </Button>
            </div>
          </TabsContent>

          {/* Persian to Timestamp */}
          <TabsContent value="persian-to-timestamp" className="space-y-4">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="space-y-2">
                  <Label>سال</Label>
                  <Input
                    type="number"
                    value={persianYear}
                    onChange={(e) => setPersianYear(e.target.value)}
                    placeholder="1402"
                  />
                </div>
                <div className="space-y-2">
                  <Label>ماه</Label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={persianMonth}
                    onChange={(e) => setPersianMonth(e.target.value)}
                    placeholder="12"
                  />
                </div>
                <div className="space-y-2">
                  <Label>روز</Label>
                  <Input
                    type="number"
                    min="1"
                    max="31"
                    value={persianDay}
                    onChange={(e) => setPersianDay(e.target.value)}
                    placeholder="29"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>زمان</Label>
                <Input
                  type="time"
                  value={persianTime}
                  onChange={(e) => setPersianTime(e.target.value)}
                />
              </div>
              
              <Button onClick={convertPersianToTimestamp} className="w-full bg-gradient-to-r from-green-500 to-emerald-500">
                تبدیل به تایم‌استمپ
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-orange-300">نتایج تبدیل</h3>
                <Button onClick={resetForm} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  پاک کردن
                </Button>
              </div>

              {/* Unix Timestamp */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/15 to-red-500/15 border border-orange-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-orange-300">تایم‌استمپ یونیکس (ثانیه)</span>
                  <Button 
                    onClick={() => copyToClipboard(results.unix.toString(), 'تایم‌استمپ')}
                    variant="ghost" 
                    size="sm"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-2xl font-bold text-foreground font-mono">
                  {results.unix.toLocaleString()}
                </div>
              </div>

              {/* Milliseconds */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/15 to-pink-500/15 border border-red-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-red-300">تایم‌استمپ (میلی‌ثانیه)</span>
                  <Button 
                    onClick={() => copyToClipboard(results.milliseconds.toString(), 'میلی‌ثانیه')}
                    variant="ghost" 
                    size="sm"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="text-xl font-bold text-foreground font-mono">
                  {results.milliseconds.toLocaleString()}
                </div>
              </div>

              {/* Gregorian Date */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-blue-300">تاریخ میلادی</span>
                  <Button 
                    onClick={() => copyToClipboard(results.gregorian.iso, 'تاریخ میلادی')}
                    variant="ghost" 
                    size="sm"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-foreground">
                    {results.gregorian.date} {results.gregorian.time}
                  </div>
                  {results.gregorian.iso && (
                    <div className="text-sm text-foreground/70 font-mono">
                      ISO: {results.gregorian.iso}
                    </div>
                  )}
                  {results.gregorian.weekday && (
                    <div className="text-sm text-blue-200">
                      {results.gregorian.weekday}
                    </div>
                  )}
                </div>
              </div>

              {/* Persian Date */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-green-300">تاریخ شمسی</span>
                  <Button 
                    onClick={() => copyToClipboard(results.persian.full, 'تاریخ شمسی')}
                    variant="ghost" 
                    size="sm"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-bold text-foreground">
                    {results.persian.full}
                  </div>
                  <div className="text-sm text-foreground/70 font-mono">
                    {results.persian.date} {results.persian.time}
                  </div>
                  {results.persian.weekday && (
                    <div className="text-sm text-green-200">
                      {results.persian.weekday}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!results && (
          <div className="text-center py-8 text-foreground/60 space-y-2">
            <Hash className="w-12 h-12 mx-auto mb-4 text-orange-400" />
            <p>یکی از تب‌ها را انتخاب کنید و اطلاعات را وارد کنید</p>
            <p className="text-sm">تبدیل دقیق بین تایم‌استمپ یونیکس و تاریخ‌های شمسی و میلادی</p>
          </div>
        )}

        {/* Information */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
          <h4 className="text-sm font-bold text-yellow-300 mb-2">راهنما:</h4>
          <ul className="text-xs text-foreground/70 space-y-1">
            <li>• تایم‌استمپ یونیکس: تعداد ثانیه‌ها از 1 ژانویه 1970 (UTC)</li>
            <li>• تایم‌استمپ میلی‌ثانیه: برای JavaScript و برخی API ها</li>
            <li>• تبدیل شمسی دقیق بر اساس الگوریتم کاظم زاده</li>
            <li>• همه محاسبات بر اساس منطقه زمانی ایران (UTC+3:30)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
