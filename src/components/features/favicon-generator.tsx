"use client";

import { useRef, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Download, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function FaviconGenerator() {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [bg, setBg] = useState('#00000000');
  const [size, setSize] = useState(256);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] || null;
    setFile(f);
  };

  const render = async () => {
    if (!file) return;
    const img = new Image();
    img.src = URL.createObjectURL(file);
    await new Promise(r => { img.onload = () => r(null); });
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    canvas.width = canvas.height = size;
    ctx.clearRect(0,0,size,size);
    if (bg) {
      ctx.fillStyle = bg;
      ctx.fillRect(0,0,size,size);
    }
    const scale = Math.min(size / img.width, size / img.height);
    const w = img.width * scale;
    const h = img.height * scale;
    const x = (size - w)/2;
    const y = (size - h)/2;
    ctx.drawImage(img, x, y, w, h);
    URL.revokeObjectURL(img.src);
    toast({ title: 'آماده شد', description: 'پیش‌نمایش فاوآیکن آماده است.' });
  };

  const download = () => {
    const canvas = canvasRef.current!;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'favicon.png';
    a.click();
  };

  return (
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="space-y-2">
          <Label>آپلود تصویر</Label>
          <Input type="file" accept="image/*" onChange={onFile} />
        </div>
        <div className="space-y-2">
          <Label>رنگ پس‌زمینه (اختیاری)</Label>
          <Input value={bg} onChange={e=>setBg(e.target.value)} placeholder="#00000000" dir="ltr" />
        </div>
        <div className="space-y-2">
          <Label>اندازه خروجی</Label>
          <Input type="number" value={size} onChange={e=>setSize(parseInt(e.target.value||'256')||256)} />
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={render} disabled={!file}><Upload className="ml-2 h-4 w-4"/>رندر پیش‌نمایش</Button>
        <Button onClick={download} variant="outline"><Download className="ml-2 h-4 w-4"/>دانلود PNG</Button>
      </div>
      <div className="rounded-lg border p-3 bg-muted/30">
        <canvas ref={canvasRef} className="mx-auto block" width={256} height={256} />
      </div>
    </CardContent>
  );
}


