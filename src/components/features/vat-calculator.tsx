"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Percent } from 'lucide-react';
import { Slider } from '../ui/slider';

// Helper function to format numbers with commas
const formatNumberWithCommas = (value: string): string => {
  const num = parseInt(value.replace(/,/g, ''), 10);
  return isNaN(num) ? '' : num.toLocaleString('en-US');
};

// Helper function to remove commas
const unformatNumber = (value: string): number => {
  return parseFloat(value.replace(/,/g, ''));
};

export default function VatCalculator() {
  const [baseAmount, setBaseAmount] = useState('');
  const [vatRate, setVatRate] = useState(10); // Default VAT rate in Iran for 1403

  const handleBaseAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBaseAmount(formatNumberWithCommas(e.target.value));
  };

  const { vatAmount, totalAmount, hasValues } = useMemo(() => {
    const amount = unformatNumber(baseAmount || '0');
    if (isNaN(amount) || amount <= 0) {
      return { vatAmount: 0, totalAmount: 0, hasValues: false };
    }
    
    const calculatedVat = amount * (vatRate / 100);
    const calculatedTotal = amount + calculatedVat;
    
    return {
      vatAmount: calculatedVat,
      totalAmount: calculatedTotal,
      hasValues: true
    };
  }, [baseAmount, vatRate]);
  
  const formatNumber = (num: number) => {
    if (isNaN(num)) return '۰';
    return Math.round(num).toLocaleString('fa-IR');
  };

  return (
    <CardContent className="flex flex-col gap-6">
      <div className="space-y-2">
        <Label htmlFor="baseAmount" className="text-muted-foreground">مبلغ پایه (تومان)</Label>
        <Input 
          id="baseAmount" 
          type="text" 
          value={baseAmount} 
          onChange={handleBaseAmountChange} 
          placeholder="۱,۰۰۰,۰۰۰" 
          className="h-12 text-lg text-center font-display" 
          dir="ltr"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="vatRate" className="text-muted-foreground">نرخ ارزش افزوده</Label>
          <span className="font-mono text-primary text-lg">{vatRate}%</span>
        </div>
        <Slider
          id="vatRate"
          value={[vatRate]}
          onValueChange={(val) => setVatRate(val[0])}
          min={0}
          max={25}
          step={1}
        />
      </div>

      {hasValues ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-muted/50 rounded-lg shadow-inner">
                  <p className="text-sm text-muted-foreground">مبلغ ارزش افزوده</p>
                  <p className="text-2xl font-bold text-primary mt-1 font-display">{formatNumber(vatAmount)}</p>
                  <p className="text-xs text-muted-foreground">تومان</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg shadow-inner">
                  <p className="text-sm text-muted-foreground">مبلغ نهایی (با احتساب ارزش افزوده)</p>
                  <p className="text-2xl font-bold text-foreground mt-1 font-display">{formatNumber(totalAmount)}</p>
                  <p className="text-xs text-muted-foreground">تومان</p>
              </div>
          </div>
      ) : (
            <div className="flex items-center justify-center text-muted-foreground h-24 bg-muted/30 rounded-lg">
              <p>مبلغ پایه را برای محاسبه وارد کنید.</p>
          </div>
      )}
    </CardContent>
  );
}