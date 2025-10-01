
"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Sigma, Clipboard } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

export default function FactorialCalculator() {
  const [number, setNumber] = useState('');
  const { toast } = useToast();

  const factorialResult = useMemo(() => {
    if (number.trim() === '') return null;
    const num = parseInt(number, 10);
    if (isNaN(num)) return "ورودی نامعتبر";
    return calculateFactorial(num);
  }, [number]);
  
  const resultString = useMemo(() => {
      if(factorialResult === null) return "...";
      if(typeof factorialResult === 'string') return factorialResult;
      return factorialResult.toLocaleString('fa-IR');
  }, [factorialResult]);
  
   const copyToClipboard = () => {
    if (!factorialResult || typeof factorialResult !== 'bigint') return;
    navigator.clipboard.writeText(factorialResult.toString());
    toast({
        title: 'کپی شد!',
        description: 'نتیجه فاکتوریل با موفقیت کپی شد.',
    });
  }

  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="factorial-input" className="text-muted-foreground">یک عدد صحیح (بین ۰ تا ۱۰۰) وارد کنید</Label>
        <Input 
          id="factorial-input" 
          type="number" 
          value={number} 
          onChange={(e) => setNumber(e.target.value)} 
          placeholder="۵" 
          className="h-14 text-2xl text-center font-display" 
          min="0"
          max="100"
        />
      </div>
      
      <div className="relative p-4 bg-muted/50 rounded-lg shadow-inner text-center min-h-[6rem]">
         <Button variant="ghost" size="icon" className="absolute top-2 left-2 text-muted-foreground" onClick={copyToClipboard} disabled={!factorialResult || typeof factorialResult !== 'bigint'}>
            <Clipboard className="w-5 h-5"/>
        </Button>
        <p className="text-sm text-muted-foreground">نتیجه (!n)</p>
        <p className="text-2xl font-bold text-primary mt-1 font-mono break-all">{resultString}</p>
      </div>
    </CardContent>
  );
}

const calculateFactorial = (n: number): bigint | string => {
    if (n < 0) return "ورودی نامعتبر";
    if (n === 0) return 1n;
    if (n > 100) return "عدد بسیار بزرگ (بیش از ۱۰۰)";
    let result = 1n;
    for (let i = 2n; i <= BigInt(n); i++) {
        result *= i;
    }
    return result;
};
