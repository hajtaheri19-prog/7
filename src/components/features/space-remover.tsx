"use client";

import { useState, useMemo } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Eraser, Clipboard, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label';

export default function SpaceRemover() {
  const [text, setText] = useState('');
  const { toast } = useToast();

  const processedText = useMemo(() => {
    // Replace multiple spaces/newlines with a single space, then trim
    return text.replace(/\s+/g, ' ').trim();
  }, [text]);
  
  const copyToClipboard = () => {
    if (!processedText) return;
    navigator.clipboard.writeText(processedText);
    toast({ title: 'کپی شد!', description: 'متن بدون فواصل اضافه کپی شد.' });
  };
  
  const clearText = () => {
      setText('');
  }

  return (
    <CardContent className="space-y-4">
       <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="input-text" className="text-muted-foreground">متن ورودی</Label>
                <Button variant="ghost" size="icon" onClick={clearText} disabled={!text} className="text-muted-foreground hover:text-destructive">
                    <Trash2 className="w-5 h-5"/>
                </Button>
            </div>
            <Textarea
              id="input-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="متن خود را با فواصل اضافه اینجا وارد کنید..."
              className="min-h-[150px]"
            />
       </div>

      <div className="space-y-2">
            <div className="flex justify-between items-center">
                <Label htmlFor="output-text" className="text-muted-foreground">متن خروجی</Label>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} disabled={!processedText} className="text-muted-foreground hover:text-primary">
                    <Clipboard className="w-5 h-5"/>
                </Button>
            </div>
            <Textarea
              id="output-text"
              readOnly
              value={processedText}
              placeholder="متن اصلاح شده در اینجا نمایش داده می‌شود..."
              className="min-h-[150px] bg-muted/50"
            />
       </div>
    </CardContent>
  );
}