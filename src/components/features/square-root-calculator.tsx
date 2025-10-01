"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Clipboard } from 'lucide-react';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SquareRootCalculator() {
  const [number, setNumber] = useState('');
  const { toast } = useToast();

  const sqrtResult = useMemo(() => {
    if (number.trim() === '') return null;
    const num = parseFloat(number);
    if (isNaN(num)) return "ورودی نامعتبر";
    if (num < 0) return "عدد منفی جذر حقیقی ندارد";
    return Math.sqrt(num);
  }, [number]);
  
  const resultString = useMemo(() => {
      if(sqrtResult === null) return "...";
      if(typeof sqrtResult === 'string') return sqrtResult;
      // Format to show more precision for non-integers
      return sqrtResult.toLocaleString('fa-IR', { maximumFractionDigits: 10 });
  }, [sqrtResult]);
  
   const copyToClipboard = () => {
    if (!sqrtResult || typeof sqrtResult !== 'number') return;
    navigator.clipboard.writeText(sqrtResult.toString());
    toast({
        title: 'کپی شد!',
        description: 'نتیجه جذر با موفقیت کپی شد.',
    });
  }

  return (
    <CardContent className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="sqrt-input" className="text-muted-foreground">یک عدد وارد کنید</Label>
        <Input 
          id="sqrt-input" 
          type="number" 
          value={number} 
          onChange={(e) => setNumber(e.target.value)} 
          placeholder="۲۵" 
          className="h-14 text-2xl text-center font-display" 
          min="0"
        />
      </div>
      
      <div className="relative p-4 bg-muted/50 rounded-lg shadow-inner text-center min-h-[6rem]">
         <Button variant="ghost" size="icon" className="absolute top-2 left-2 text-muted-foreground" onClick={copyToClipboard} disabled={!sqrtResult || typeof sqrtResult !== 'number'}>
            <Clipboard className="w-5 h-5"/>
        </Button>
        <p className="text-sm text-muted-foreground">نتیجه (√n)</p>
        <p className="text-2xl font-bold text-primary mt-1 font-mono break-all">{resultString}</p>
      </div>
    </CardContent>
  );
}