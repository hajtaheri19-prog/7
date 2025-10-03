"use client";

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingDown, Calculator, DollarSign, BarChart3 } from 'lucide-react';

// داده‌های تورم ایران (شاخص CPI)
const inflationData = {
  1390: 100,
  1391: 115,
  1392: 135,
  1393: 160,
  1394: 190,
  1395: 236,
  1396: 255,
  1397: 300,
  1398: 370,
  1399: 460,
  1400: 550,
  1401: 680,
  1402: 800,
  1403: 950,
  1404: 1100
};

// قیمت‌های نمونه برای مثال‌های ملموس
const samplePrices = {
  pizza: { 1395: 25000, 1404: 250000 },
  gas: { 1395: 800, 1404: 8000 },
  phone: { 1395: 1500000, 1404: 15000000 },
  bread: { 1395: 2000, 1404: 20000 },
  taxi: { 1395: 5000, 1404: 50000 }
};

interface InflationResult {
  todayValue: number;
  changePercent: number;
  powerDrop: number;
  examples: {
    pizza: { then: number; now: number };
    gas: { then: number; now: number };
    phone: { then: number; now: number };
    bread: { then: number; now: number };
    taxi: { then: number; now: number };
  };
}

export default function InflationCalculator() {
  const [amount, setAmount] = useState<string>('500000');
  const [pastYear, setPastYear] = useState<string>('1395');
  const [currentYear, setCurrentYear] = useState<string>('1404');
  const [result, setResult] = useState<InflationResult | null>(null);

  const calculateInflation = () => {
    const amountNum = parseFloat(amount);
    const pastCPI = inflationData[pastYear as unknown as keyof typeof inflationData];
    const currentCPI = inflationData[currentYear as unknown as keyof typeof inflationData];

    if (!pastCPI || !currentCPI || isNaN(amountNum)) {
      setResult(null);
      return;
    }

    // فرمول محاسبه ارزش امروز
    const todayValue = amountNum * (currentCPI / pastCPI);
    
    // درصد تغییر قدرت خرید
    const changePercent = ((currentCPI - pastCPI) / pastCPI) * 100;
    const powerDrop = ((pastCPI - currentCPI) / pastCPI) * 100;

    // مثال‌های ملموس
    const examples = {
      pizza: {
        then: amountNum / samplePrices.pizza[pastYear as unknown as keyof typeof samplePrices.pizza],
        now: todayValue / samplePrices.pizza[currentYear as unknown as keyof typeof samplePrices.pizza]
      },
      gas: {
        then: amountNum / samplePrices.gas[pastYear as unknown as keyof typeof samplePrices.gas],
        now: todayValue / samplePrices.gas[currentYear as unknown as keyof typeof samplePrices.gas]
      },
      phone: {
        then: amountNum / samplePrices.phone[pastYear as unknown as keyof typeof samplePrices.phone],
        now: todayValue / samplePrices.phone[currentYear as unknown as keyof typeof samplePrices.phone]
      },
      bread: {
        then: amountNum / samplePrices.bread[pastYear as unknown as keyof typeof samplePrices.bread],
        now: todayValue / samplePrices.bread[currentYear as unknown as keyof typeof samplePrices.bread]
      },
      taxi: {
        then: amountNum / samplePrices.taxi[pastYear as unknown as keyof typeof samplePrices.taxi],
        now: todayValue / samplePrices.taxi[currentYear as unknown as keyof typeof samplePrices.taxi]
      }
    };

    setResult({
      todayValue,
      changePercent,
      powerDrop,
      examples
    });
  };

  useEffect(() => {
    if (amount && pastYear && currentYear) {
      calculateInflation();
    }
  }, [amount, pastYear, currentYear]);

  const years = Object.keys(inflationData).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-300/20 rounded-xl flex items-center justify-center shadow-[0_0_20px_hsl(var(--primary)/0.2)] border border-yellow-500/30">
            <Calculator className="w-6 h-6 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">ماشین شهودی تبدیل ارزش پول</h2>
        </div>
        <p className="text-muted-foreground">محاسبه اثر تورم بر قدرت خرید پول شما</p>
      </div>

      {/* Input Form */}
      <Card className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-black/30 via-zinc-900/30 to-black/20 border border-primary/20 shadow-[0_0_30px_hsl(var(--primary)/0.1)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-foreground">مبلغ (تومان)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="500000"
              className="bg-background/50 border-primary/30 focus:border-primary/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pastYear" className="text-sm font-medium text-foreground">سال گذشته</Label>
            <Select value={pastYear} onValueChange={setPastYear}>
              <SelectTrigger className="bg-background/50 border-primary/30 focus:border-primary/50">
                <SelectValue placeholder="انتخاب سال" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentYear" className="text-sm font-medium text-foreground">سال امروز</Label>
            <Select value={currentYear} onValueChange={setCurrentYear}>
              <SelectTrigger className="bg-background/50 border-primary/30 focus:border-primary/50">
                <SelectValue placeholder="انتخاب سال" />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Main Result */}
          <Card className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-yellow-500/10 border border-yellow-500/20 shadow-[0_0_30px_#eab30822]">
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <TrendingDown className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold text-foreground">نتیجه محاسبه</h3>
              </div>
              
              <div className="space-y-3">
                <div className="text-2xl font-bold text-yellow-400">
                  {result.todayValue.toLocaleString()} تومان
                </div>
                <div className="text-sm text-muted-foreground">
                  ارزش امروز {parseFloat(amount).toLocaleString()} تومان در سال {pastYear}
                </div>
                <div className="text-lg font-semibold text-red-400">
                  کاهش قدرت خرید: {Math.abs(result.powerDrop).toFixed(1)}%
                </div>
              </div>
            </div>
          </Card>

          {/* Real-world Examples */}
          <Card className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 border border-primary/20 shadow-[0_0_20px_hsl(var(--primary)/0.1)]">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">مثال‌های ملموس</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-primary/10">
                    <span className="text-sm font-medium">🍕 پیتزا</span>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">سپس: {result.examples.pizza.then.toFixed(1)} عدد</div>
                      <div className="text-sm text-foreground">حالا: {result.examples.pizza.now.toFixed(1)} عدد</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-primary/10">
                    <span className="text-sm font-medium">⛽ بنزین</span>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">سپس: {result.examples.gas.then.toFixed(0)} لیتر</div>
                      <div className="text-sm text-foreground">حالا: {result.examples.gas.now.toFixed(0)} لیتر</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-primary/10">
                    <span className="text-sm font-medium">📱 گوشی</span>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">سپس: {result.examples.phone.then.toFixed(2)} عدد</div>
                      <div className="text-sm text-foreground">حالا: {result.examples.phone.now.toFixed(2)} عدد</div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-primary/10">
                    <span className="text-sm font-medium">🍞 نان</span>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">سپس: {result.examples.bread.then.toFixed(0)} عدد</div>
                      <div className="text-sm text-foreground">حالا: {result.examples.bread.now.toFixed(0)} عدد</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-background/30 rounded-lg border border-primary/10">
                    <span className="text-sm font-medium">🚕 تاکسی</span>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">سپس: {result.examples.taxi.then.toFixed(0)} سفر</div>
                      <div className="text-sm text-foreground">حالا: {result.examples.taxi.now.toFixed(0)} سفر</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Impact Statement */}
          <Card className="glass-effect rounded-2xl p-6 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-red-500/10 border border-red-500/20 shadow-[0_0_30px_#ef444422]">
            <div className="text-center space-y-3">
              <div className="text-lg font-semibold text-foreground">
                💡 تأثیر تورم بر زندگی شما
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                پول شما در سال {pastYear} معادل <span className="font-semibold text-foreground">{parseFloat(amount).toLocaleString()} تومان</span> بود که 
                می‌توانست <span className="font-semibold text-yellow-400">{result.examples.pizza.then.toFixed(1)} عدد پیتزا</span> بخرد. 
                امروز این پول فقط <span className="font-semibold text-red-400">{result.examples.pizza.now.toFixed(1)} عدد پیتزا</span> می‌خرد.
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}