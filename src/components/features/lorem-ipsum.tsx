"use client";

import { useMemo, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, RefreshCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function generateLorem(words: number): string {
  const dict = 'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است'.split(' ');
  const out: string[] = [];
  for (let i = 0; i < words; i++) out.push(dict[Math.floor(Math.random()*dict.length)]);
  return out.join(' ');
}

export default function LoremIpsum() {
  const { toast } = useToast();
  const [words, setWords] = useState(50);
  const [seed, setSeed] = useState(0);
  const text = useMemo(()=>generateLorem(words + seed % 3), [words, seed]);

  const copy = () => {
    navigator.clipboard.writeText(text);
    toast({ title: 'کپی شد', description: 'متن تولیدی کپی شد.' });
  };

  return (
    <CardContent className="space-y-4">
      <div className="flex items-end gap-4">
        <div className="space-y-2">
          <Label>تعداد کلمات</Label>
          <Input type="number" min={5} max={2000} value={words} onChange={e=>setWords(parseInt(e.target.value||'0')||0)} />
        </div>
        <Button variant="ghost" onClick={()=>setSeed(s=>s+1)}><RefreshCcw className="ml-2 h-4 w-4"/>تازه‌سازی</Button>
        <Button variant="outline" onClick={copy}><Copy className="ml-2 h-4 w-4"/>کپی</Button>
      </div>
      <Textarea readOnly className="min-h-[200px]" value={text} />
    </CardContent>
  );
}


