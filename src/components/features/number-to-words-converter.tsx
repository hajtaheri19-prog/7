
"use client";

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SpellCheck, Clipboard } from 'lucide-react';
import { Label } from '../ui/label';
import { numToWords, numToWordsEn } from '@/lib/utils';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

type Language = 'fa' | 'en';

export default function NumberToWordsConverter() {
  const [number, setNumber] = useState('');
  const [language, setLanguage] = useState<Language>('fa');
  const { toast } = useToast();

  const words = useMemo(() => {
    if (number.trim() === '') return 'لطفا یک عدد وارد کنید.';
    if (language === 'fa') {
        return numToWords(number);
    } else {
        return numToWordsEn(number);
    }
  }, [number, language]);

  const copyToClipboard = () => {
    if (!words || words === 'لطفا یک عدد وارد کنید.') return;
    navigator.clipboard.writeText(words);
    toast({
        title: 'کپی شد!',
        description: 'نتیجه با موفقیت در کلیپ‌بورد کپی شد.',
    });
  }

  return (
    <CardContent className="flex flex-col gap-4">
       <div className="flex items-center justify-center p-1 bg-muted rounded-lg w-full max-w-sm mx-auto">
            {(['fa', 'en'] as Language[]).map((lang) => (
            <Button 
                key={lang}
                onClick={() => setLanguage(lang)} 
                variant={language === lang ? 'default' : 'ghost'}
                className={`w-full ${language === lang ? '' : 'text-muted-foreground'}`}
            >
                {lang === 'fa' ? 'فارسی' : 'انگلیسی'}
            </Button>
            ))}
        </div>
      <div className="space-y-2">
        <Label htmlFor="number-to-words-input" className="text-muted-foreground">عدد را وارد کنید</Label>
        <Input 
          id="number-to-words-input" 
          type="number"
          value={number} 
          onChange={(e) => setNumber(e.target.value)} 
          placeholder="۱۳۷۵"
          className="h-12 text-lg text-center"
        />
      </div>
      
      <div className="relative p-4 bg-muted/50 rounded-lg shadow-inner text-center min-h-[80px] flex items-center justify-center">
            <Button variant="ghost" size="icon" className="absolute top-2 left-2 text-muted-foreground" onClick={copyToClipboard} disabled={!words || words === 'لطفا یک عدد وارد کنید.'}>
                <Clipboard className="w-5 h-5"/>
            </Button>
            <p className="text-lg font-medium text-primary">{words}</p>
      </div>
    </CardContent>
  );
}
