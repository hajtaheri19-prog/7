"use client";

import { useMemo, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function WhatsAppLink() {
  const { toast } = useToast();
  const [phone, setPhone] = useState('');
  const [text, setText] = useState('سلام');

  const link = useMemo(() => {
    const p = phone.replace(/[^\d]/g, '');
    if (!p) return '';
    const url = new URL(`https://wa.me/${p}`);
    if (text) url.searchParams.set('text', text);
    return url.toString();
  }, [phone, text]);

  const copy = () => {
    if (!link) return;
    navigator.clipboard.writeText(link);
    toast({ title: 'کپی شد', description: 'لینک واتساپ کپی شد.' });
  };

  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>شماره (بین‌المللی بدون 0)</Label>
          <Input placeholder="98912xxxxxxx" value={phone} onChange={e=>setPhone(e.target.value)} dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>متن (اختیاری)</Label>
          <Input value={text} onChange={e=>setText(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>لینک</Label>
        <div className="flex items-center gap-2">
          <Input readOnly value={link} dir="ltr" />
          <Button variant="outline" onClick={copy}><Copy className="ml-2 h-4 w-4"/>کپی</Button>
          {link && <a href={link} target="_blank" rel="noopener noreferrer"><Button><LinkIcon className="ml-2 h-4 w-4"/>بازکردن</Button></a>}
        </div>
      </div>
    </CardContent>
  );
}


