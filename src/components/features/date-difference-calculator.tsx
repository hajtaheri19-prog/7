"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, Clock, RefreshCw, Copy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Persian months
const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

// Persian weekdays
const PERSIAN_WEEKDAYS = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'
];

// Gregorian months
const GREGORIAN_MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Gregorian weekdays
const GREGORIAN_WEEKDAYS = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export default function DateDifferenceCalculator() {
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [time1, setTime1] = useState('');
  const [time2, setTime2] = useState('');
  const [calendarType, setCalendarType] = useState<'gregorian' | 'persian'>('gregorian');
  const [results, setResults] = useState<any>(null);
  
  const { toast } = useToast();

  // Persian calendar conversion functions (simplified)
  const isLeapPersianYear = (year: number): boolean => {
    const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
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
      gy = 621;
    } else {
      gy = 1600;
    }
    
    jy += 1595;
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
    
    let gy2 = gm > 2 ? gy + 1 : gy;
    
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

  const parseDate = (dateStr: string, timeStr: string, isPersian: boolean): Date | null => {
    try {
      if (isPersian) {
        const [year, month, day] = dateStr.split('-').map(Number);
        if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
        
        const gregorianDate = persianToGregorian(year, month, day);
        
        if (timeStr) {
          const [hours, minutes] = timeStr.split(':').map(Number);
          if (!isNaN(hours) && !isNaN(minutes)) {
            gregorianDate.setHours(hours, minutes, 0, 0);
          }
        }
        
        return gregorianDate;
      } else {
        const date = new Date(`${dateStr}T${timeStr || '00:00'}`);
        return isNaN(date.getTime()) ? null : date;
      }
    } catch (error) {
      return null;
    }
  };

  const calculateDifference = () => {
    if (!date1 || !date2) {
      toast({
        title: "تاریخ‌ها ناقص",
        description: "لطفاً هر دو تاریخ را وارد کنید",
        variant: "destructive"
      });
      return;
    }

    const dateObj1 = parseDate(date1, time1, calendarType === 'persian');
    const dateObj2 = parseDate(date2, time2, calendarType === 'persian');

    if (!dateObj1 || !dateObj2) {
      toast({
        title: "تاریخ نامعتبر",
        description: "لطفاً تاریخ‌های معتبر وارد کنید",
        variant: "destructive"
      });
      return;
    }

    // Ensure date1 is earlier than date2
    const [earlierDate, laterDate] = dateObj1 <= dateObj2 ? [dateObj1, dateObj2] : [dateObj2, dateObj1];

    const diffMs = laterDate.getTime() - earlierDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30.44); // Average days per month
    const diffYears = Math.floor(diffDays / 365.25); // Average days per year

    // Calculate precise years, months, days
    let preciseYears = laterDate.getFullYear() - earlierDate.getFullYear();
    let preciseMonths = laterDate.getMonth() - earlierDate.getMonth();
    let preciseDays = laterDate.getDate() - earlierDate.getDate();

    if (preciseDays < 0) {
      preciseMonths--;
      const lastMonth = new Date(laterDate.getFullYear(), laterDate.getMonth(), 0);
      preciseDays += lastMonth.getDate();
    }

    if (preciseMonths < 0) {
      preciseYears--;
      preciseMonths += 12;
    }

    // Convert to Persian dates for display
    const persian1 = gregorianToPersian(earlierDate);
    const persian2 = gregorianToPersian(laterDate);

    setResults({
      earlier: {
        gregorian: {
          date: earlierDate.toLocaleDateString('en-US'),
          time: earlierDate.toLocaleTimeString('en-US', { hour12: false }),
          weekday: GREGORIAN_WEEKDAYS[earlierDate.getDay()],
          month: GREGORIAN_MONTHS[earlierDate.getMonth()]
        },
        persian: {
          date: `${persian1.year}/${persian1.month.toString().padStart(2, '0')}/${persian1.day.toString().padStart(2, '0')}`,
          time: earlierDate.toLocaleTimeString('fa-IR', { hour12: false }),
          weekday: PERSIAN_WEEKDAYS[(earlierDate.getDay() + 1) % 7],
          month: PERSIAN_MONTHS[persian1.month - 1]
        }
      },
      later: {
        gregorian: {
          date: laterDate.toLocaleDateString('en-US'),
          time: laterDate.toLocaleTimeString('en-US', { hour12: false }),
          weekday: GREGORIAN_WEEKDAYS[laterDate.getDay()],
          month: GREGORIAN_MONTHS[laterDate.getMonth()]
        },
        persian: {
          date: `${persian2.year}/${persian2.month.toString().padStart(2, '0')}/${persian2.day.toString().padStart(2, '0')}`,
          time: laterDate.toLocaleTimeString('fa-IR', { hour12: false }),
          weekday: PERSIAN_WEEKDAYS[(laterDate.getDay() + 1) % 7],
          month: PERSIAN_MONTHS[persian2.month - 1]
        }
      },
      differences: {
        milliseconds: diffMs,
        seconds: diffSeconds,
        minutes: diffMinutes,
        hours: diffHours,
        days: diffDays,
        weeks: diffWeeks,
        months: diffMonths,
        years: diffYears,
        precise: {
          years: preciseYears,
          months: preciseMonths,
          days: preciseDays
        }
      },
      isReversed: dateObj1 > dateObj2
    });
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "کپی شد",
        description: `${label} کپی شد`,
      });
    } catch (error) {
      toast({
        title: "خطا در کپی",
        description: "امکان کپی وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setDate1('');
    setDate2('');
    setTime1('');
    setTime2('');
    setResults(null);
  };

  const setCurrentDate = () => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const time = now.toTimeString().split(' ')[0].substring(0, 5);
    
    if (calendarType === 'persian') {
      const persian = gregorianToPersian(now);
      const persianDate = `${persian.year}-${persian.month.toString().padStart(2, '0')}-${persian.day.toString().padStart(2, '0')}`;
      setDate2(persianDate);
      setTime2(time);
    } else {
      setDate2(today);
      setTime2(time);
    }
  };

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="glass-effect rounded-2xl p-5 mb-4 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/40 to-pink-500/20 shadow-[0_0_18px_#a855f755] flex items-center justify-center">
            <Calendar className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="text-lg font-display font-semibold text-foreground">محاسبه اختلاف تاریخ</div>
            <div className="text-sm text-foreground/70">محاسبه دقیق فاصله بین دو تاریخ شمسی یا میلادی</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Calendar Type Selection */}
        <div className="flex gap-4 justify-center">
          <Button
            variant={calendarType === 'gregorian' ? 'default' : 'outline'}
            onClick={() => setCalendarType('gregorian')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            میلادی
          </Button>
          <Button
            variant={calendarType === 'persian' ? 'default' : 'outline'}
            onClick={() => setCalendarType('persian')}
            className="flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            شمسی
          </Button>
        </div>

        {/* Date Inputs */}
        <div className="space-y-6">
          {/* First Date */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-purple-300">تاریخ اول</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>تاریخ {calendarType === 'persian' ? 'شمسی' : 'میلادی'}</Label>
                <Input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="text-center"
                />
              </div>
              <div className="space-y-2">
                <Label>زمان (اختیاری)</Label>
                <Input
                  type="time"
                  value={time1}
                  onChange={(e) => setTime1(e.target.value)}
                  className="text-center"
                />
              </div>
            </div>
          </div>

          {/* Second Date */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-bold text-purple-300">تاریخ دوم</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>تاریخ {calendarType === 'persian' ? 'شمسی' : 'میلادی'}</Label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={date2}
                    onChange={(e) => setDate2(e.target.value)}
                    className="text-center flex-1"
                  />
                  <Button onClick={setCurrentDate} variant="outline" size="sm">
                    <Clock className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>زمان (اختیاری)</Label>
                <Input
                  type="time"
                  value={time2}
                  onChange={(e) => setTime2(e.target.value)}
                  className="text-center"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center">
          <Button 
            onClick={calculateDifference} 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold h-12 px-8"
          >
            <Calendar className="w-5 h-5 mr-2" />
            محاسبه اختلاف
          </Button>
        </div>

        {/* Results */}
        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-purple-300">نتایج محاسبه</h3>
                <Button onClick={resetForm} variant="outline" size="sm">
                  <RefreshCw className="w-4 h-4 mr-1" />
                  پاک کردن
                </Button>
              </div>

              {/* Date Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Earlier Date */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/15 to-cyan-500/15 border border-blue-500/30">
                  <div className="text-center space-y-2">
                    <h4 className="text-sm font-bold text-blue-300">تاریخ اول</h4>
                    <div className="text-lg font-bold text-foreground">
                      {calendarType === 'persian' ? results.earlier.persian.date : results.earlier.gregorian.date}
                    </div>
                    <div className="text-sm text-foreground/70">
                      {calendarType === 'persian' ? results.earlier.persian.time : results.earlier.gregorian.time}
                    </div>
                    <div className="text-xs text-blue-200">
                      {calendarType === 'persian' ? results.earlier.persian.weekday : results.earlier.gregorian.weekday}
                    </div>
                  </div>
                </div>

                {/* Later Date */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30">
                  <div className="text-center space-y-2">
                    <h4 className="text-sm font-bold text-green-300">تاریخ دوم</h4>
                    <div className="text-lg font-bold text-foreground">
                      {calendarType === 'persian' ? results.later.persian.date : results.later.gregorian.date}
                    </div>
                    <div className="text-sm text-foreground/70">
                      {calendarType === 'persian' ? results.later.persian.time : results.later.gregorian.time}
                    </div>
                    <div className="text-xs text-green-200">
                      {calendarType === 'persian' ? results.later.persian.weekday : results.later.gregorian.weekday}
                    </div>
                  </div>
                </div>
              </div>

              {/* Precise Difference */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-purple-500/30">
                <div className="text-center space-y-4">
                  <h4 className="text-lg font-bold text-purple-300">اختلاف دقیق</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-200">
                        {results.differences.precise.years}
                      </div>
                      <div className="text-sm text-foreground/70">سال</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-200">
                        {results.differences.precise.months}
                      </div>
                      <div className="text-sm text-foreground/70">ماه</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-200">
                        {results.differences.precise.days}
                      </div>
                      <div className="text-sm text-foreground/70">روز</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Differences */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: 'روز', value: results.differences.days, color: 'blue' },
                  { label: 'هفته', value: results.differences.weeks, color: 'green' },
                  { label: 'ماه', value: results.differences.months, color: 'yellow' },
                  { label: 'سال', value: results.differences.years, color: 'red' },
                  { label: 'ساعت', value: results.differences.hours, color: 'purple' },
                  { label: 'دقیقه', value: results.differences.minutes, color: 'pink' },
                  { label: 'ثانیه', value: results.differences.seconds, color: 'cyan' },
                  { label: 'میلی‌ثانیه', value: results.differences.milliseconds, color: 'orange' }
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 rounded-xl bg-black/20 border border-primary/20 text-center"
                  >
                    <div className={`text-2xl font-bold text-${item.color}-300`}>
                      {item.value.toLocaleString()}
                    </div>
                    <div className="text-xs text-foreground/70">{item.label}</div>
                  </motion.div>
                ))}
              </div>

              {/* Copy Results */}
              <div className="text-center">
                <Button
                  onClick={() => copyToClipboard(
                    `اختلاف بین ${results.earlier.persian.date} و ${results.later.persian.date}: ${results.differences.precise.years} سال، ${results.differences.precise.months} ماه، ${results.differences.precise.days} روز`,
                    'نتایج'
                  )}
                  variant="outline"
                  className="border-purple-500/30 hover:bg-purple-500/20"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  کپی نتایج
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!results && (
          <div className="text-center py-8 text-foreground/60 space-y-2">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <p>تاریخ‌های مورد نظر را وارد کنید</p>
            <p className="text-sm">محاسبه دقیق اختلاف بین دو تاریخ شمسی یا میلادی</p>
          </div>
        )}

        {/* Information */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
          <h4 className="text-sm font-bold text-yellow-300 mb-2">راهنما:</h4>
          <ul className="text-xs text-foreground/70 space-y-1">
            <li>• محاسبه دقیق بر اساس تقویم شمسی و میلادی</li>
            <li>• شامل محاسبه سال‌های کبیسه</li>
            <li>• نمایش نتایج در واحدهای مختلف (روز، هفته، ماه، سال)</li>
            <li>• پشتیبانی از زمان دقیق (ساعت و دقیقه)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
