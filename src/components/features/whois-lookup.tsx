"use client";

import { useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Search } from 'lucide-react';

export default function WhoisLookup() {
  const [domain, setDomain] = useState('example.com');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!domain.trim()) return;
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch(`/api/whois?domain=${encodeURIComponent(domain)}`, { cache: 'no-store' });
      const json = await res.json();
      setOutput(JSON.stringify(json, null, 2));
    } catch (e: any) {
      setOutput(`{\n  "success": false,\n  "error": "${e?.message || 'Unknown error'}"\n}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardContent className="space-y-4">
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-2">
          <Label>دامنه</Label>
          <Input value={domain} onChange={e=>setDomain(e.target.value)} dir="ltr" placeholder="example.com" />
        </div>
        <Button onClick={run} disabled={loading}><Search className="ml-2 h-4 w-4"/>{loading?'در حال جستجو...':'جستجو'}</Button>
      </div>
      <div className="space-y-2">
        <Label>خروجی</Label>
        <Textarea readOnly dir="ltr" className="min-h-[220px] font-mono text-sm" value={output} />
      </div>
    </CardContent>
  );
}


