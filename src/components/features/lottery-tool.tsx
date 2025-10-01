
"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Dices, Trophy, Users, Copy, Trash2, Volume2, Palette } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

const shuffleArray = (array: string[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export default function LotteryTool() {
  const [participants, setParticipants] = useState('');
  const [winnerCount, setWinnerCount] = useState('1');
  const [winners, setWinners] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rollingName, setRollingName] = useState<string | null>(null);
  const [enableSound, setEnableSound] = useState(true);
  const [theme, setTheme] = useState<'gold' | 'neon' | 'classic'>('gold');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

  const parsedList = useMemo(() => participants.split('\n').map(p => p.trim()).filter(Boolean), [participants]);

  const playDing = () => {
    if (!enableSound) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'triangle';
      o.frequency.value = 880;
      o.connect(g);
      g.connect(ctx.destination);
      o.start();
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
      o.stop(ctx.currentTime + 0.4);
    } catch {}
  };

  const launchConfetti = () => {
    const root = containerRef.current;
    if (!root) return;
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      const size = 6 + Math.random() * 6;
      piece.style.position = 'fixed';
      piece.style.top = '-10px';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.width = `${size}px`;
      piece.style.height = `${size * (0.4 + Math.random())}px`;
      piece.style.background = ['#FFD166', '#06D6A0', '#EF476F', '#118AB2'][Math.floor(Math.random() * 4)];
      piece.style.opacity = `${0.7 + Math.random() * 0.3}`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      piece.style.zIndex = '9999';
      document.body.appendChild(piece);
      const duration = 1500 + Math.random() * 1500;
      const translateX = (Math.random() * 2 - 1) * 200;
      piece.animate(
        [
          { transform: piece.style.transform, top: '-10px' },
          { transform: `translate(${translateX}px, ${window.innerHeight + 20}px) rotate(${360 * (Math.random() > 0.5 ? 1 : -1)}deg)` },
        ],
        { duration, easing: 'ease-out' }
      );
      setTimeout(() => piece.remove(), duration);
    }
  };

  const handleDraw = async () => {
    const count = parseInt(winnerCount, 10);
    if (parsedList.length === 0) {
      toast({ title: 'خطا', description: 'لیست شرکت‌کنندگان نمی‌تواند خالی باشد.', variant: 'destructive' });
      return;
    }
    if (isNaN(count) || count <= 0) {
      toast({ title: 'خطا', description: 'تعداد برنده‌ها باید یک عدد معتبر بزرگتر از صفر باشد.', variant: 'destructive' });
      return;
    }
    if (count > parsedList.length) {
      toast({ title: 'خطا', description: 'تعداد برنده‌ها نمی‌تواند بیشتر از تعداد شرکت‌کنندگان باشد.', variant: 'destructive' });
      return;
    }

    setIsDrawing(true);
    setWinners([]);
    let pool = [...parsedList];

    for (let k = 0; k < count; k++) {
      // rolling animation ~2s
      await new Promise<void>((resolve) => {
        const start = performance.now();
        const interval = setInterval(() => {
          setRollingName(pool[Math.floor(Math.random() * pool.length)]);
          if (performance.now() - start > 1600) {
            clearInterval(interval);
            resolve();
          }
        }, 60);
      });

      // pick winner
      pool = shuffleArray(pool);
      const picked = pool.shift()!;
      setWinners((prev) => [...prev, picked]);
      setRollingName(null);
      playDing();
      launchConfetti();
      await new Promise((r) => setTimeout(r, 400));
    }

    setIsDrawing(false);
    toast({ title: 'قرعه‌کشی انجام شد!', description: `${count} برنده انتخاب شد.` });
  };

  const copyToClipboard = () => {
    if (winners.length === 0) return;
    const textToCopy = winners.join('\n');
    navigator.clipboard.writeText(textToCopy);
    toast({
        title: 'کپی شد!',
        description: 'لیست برنده‌ها با موفقیت کپی شد.',
    });
  }
  
  const handleClear = () => {
      setParticipants('');
      setWinners([]);
  }

  return (
    <CardContent className="space-y-6" ref={containerRef}>
      <style>{`
        .lottery-hero {
          background: ${theme === 'gold' ? 'linear-gradient(135deg, rgba(255,215,0,0.15), rgba(255,255,255,0))' : theme === 'neon' ? 'linear-gradient(135deg, rgba(0,255,200,0.12), rgba(255,0,200,0.08))' : 'linear-gradient(135deg, rgba(120,120,120,0.12), rgba(255,255,255,0))'};
          border: 1px solid hsl(var(--border));
        }
      `}</style>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
            <div className='flex justify-between items-center'>
                <Label htmlFor="participants" className="text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4"/>
                    شرکت‌کنندگان (هر کدام در یک خط)
                </Label>
                 <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={handleClear} disabled={!participants} title="پاک کردن لیست">
                    <Trash2 className="w-5 h-5"/>
                </Button>
            </div>
            <Textarea
                id="participants"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="حسین
علی
زهرا
..."
                className="min-h-[200px] text-base"
            />
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 lottery-hero rounded-xl p-3">
            <div className="space-y-1">
              <Label htmlFor="winner-count" className="text-muted-foreground">تعداد برنده‌ها</Label>
              <Input
                id="winner-count"
                type="number"
                value={winnerCount}
                onChange={(e) => setWinnerCount(e.target.value)}
                min="1"
                className="h-12 text-xl text-center font-display"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground flex items-center gap-2"><Palette className="w-4 h-4"/> تم</Label>
              <div className="flex gap-2">
                <Button variant={theme==='gold'?'default':'outline'} onClick={()=>setTheme('gold')}>طلایی</Button>
                <Button variant={theme==='neon'?'default':'outline'} onClick={()=>setTheme('neon')}>نئونی</Button>
                <Button variant={theme==='classic'?'default':'outline'} onClick={()=>setTheme('classic')}>کلاسیک</Button>
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">شرکت‌کننده‌ها: {parsedList.length.toLocaleString('fa-IR')}</div>
              <Button variant="ghost" size="icon" onClick={()=>setEnableSound(s=>!s)} title={enableSound? 'صدا فعال است' : 'صدا غیرفعال است'}>
                <Volume2 className={`w-5 h-5 ${enableSound? 'text-primary':'text-muted-foreground'}`}/>
              </Button>
            </div>
          </div>
          <Button onClick={handleDraw} disabled={isDrawing || parsedList.length===0} className={`w-full h-12 text-base ${theme==='gold' ? 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white hover:from-yellow-600 hover:to-amber-600' : theme==='neon' ? 'bg-gradient-to-r from-fuchsia-500 to-cyan-500 text-white hover:opacity-90' : ''}`}>
            <Dices className="ml-2 h-5 w-5" />
            {isDrawing ? 'در حال قرعه‌کشی...' : 'شروع قرعه‌کشی'}
          </Button>
          {rollingName && (
            <div className="text-center text-2xl font-extrabold font-display animate-pulse">
              {rollingName}
            </div>
          )}
        </div>
      </div>
      
       <div>
            <div className="flex justify-between items-center mb-2">
                 <Label className="flex items-center gap-2 text-muted-foreground">
                    <Trophy className="w-5 h-5 text-yellow-500" />
                    برنده‌ها
                </Label>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={copyToClipboard} disabled={winners.length === 0} title="کپی کردن برنده‌ها">
                    <Copy className="w-5 h-5"/>
                </Button>
            </div>
            <ScrollArea className="h-48 bg-muted/50 rounded-lg shadow-inner border p-4">
                {winners.length > 0 ? (
                    <ol className="list-decimal list-inside space-y-2 text-lg font-medium text-primary">
                    {winners.map((winner, index) => (
                        <li key={index} className="flex items-center gap-2">
                            <span className="text-sm bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center">{index + 1}</span>
                            <span>{winner}</span>
                        </li>
                    ))}
                    </ol>
                ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                    <p>برای شروع، قرعه‌کشی را انجام دهید.</p>
                    </div>
                )}
            </ScrollArea>
       </div>
    </CardContent>
  );
}
