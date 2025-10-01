"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function UTMBuilder() {
  const { toast } = useToast();
  const [base, setBase] = useState('');
  const [source, setSource] = useState('');
  const [medium, setMedium] = useState('');
  const [campaign, setCampaign] = useState('');
  const [term, setTerm] = useState('');
  const [content, setContent] = useState('');

  const buildUrl = () => {
    if (!base) return '';
    const url = new URL(base);
    const params = url.searchParams;
    if (source) params.set('utm_source', source);
    if (medium) params.set('utm_medium', medium);
    if (campaign) params.set('utm_campaign', campaign);
    if (term) params.set('utm_term', term);
    if (content) params.set('utm_content', content);
    url.search = params.toString();
    return url.toString();
  };

  const finalUrl = buildUrl();

  const copy = () => {
    if (!finalUrl) return;
    navigator.clipboard.writeText(finalUrl);
    toast({ title: 'کپی شد', description: 'لینک UTM در کلیپ‌بورد کپی شد.' });
  };

  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>آدرس پایه</Label>
          <Input placeholder="https://example.com/page" value={base} onChange={e=>setBase(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>utm_source</Label>
          <Input value={source} onChange={e=>setSource(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>utm_medium</Label>
          <Input value={medium} onChange={e=>setMedium(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>utm_campaign</Label>
          <Input value={campaign} onChange={e=>setCampaign(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>utm_term (اختیاری)</Label>
          <Input value={term} onChange={e=>setTerm(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>utm_content (اختیاری)</Label>
          <Input value={content} onChange={e=>setContent(e.target.value)} />
        </div>
      </div>
      <div className="space-y-2">
        <Label>لینک نهایی</Label>
        <div className="flex items-center gap-2">
          <Input readOnly value={finalUrl} dir="ltr" />
          <Button variant="outline" onClick={copy}><Copy className="ml-2 h-4 w-4"/>کپی</Button>
        </div>
      </div>
    </CardContent>
  );
}


