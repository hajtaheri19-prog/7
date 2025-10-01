"use client";

import { useEffect, useRef, useState } from 'react';
import { CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function OnlineAlarm() {
  const [time, setTime] = useState('08:00');
  const [active, setActive] = useState(false);
  const ringedRef = useRef(false);

  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      const now = new Date();
      const hh = now.getHours().toString().padStart(2,'0');
      const mm = now.getMinutes().toString().padStart(2,'0');
      const cur = `${hh}:${mm}`;
      if (cur === time && !ringedRef.current) {
        ringedRef.current = true;
        try {
          const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = 'sine';
          o.frequency.value = 880;
          o.connect(g); g.connect(ctx.destination);
          o.start();
          g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2);
          o.stop(ctx.currentTime + 2);
        } catch {}
        alert('زمان آلارم رسید!');
        setActive(false);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [active, time]);

  return (
    <CardContent className="space-y-3">
      <div className="space-y-2">
        <Label>زمان آلارم</Label>
        <Input type="time" value={time} onChange={e=>{setTime(e.target.value); ringedRef.current=false;}} />
      </div>
      <div className="flex gap-2">
        <Button onClick={()=>setActive(true)} disabled={active}>فعالسازی</Button>
        <Button variant="outline" onClick={()=>{setActive(false); ringedRef.current=false;}}>غیرفعالسازی</Button>
      </div>
    </CardContent>
  );
}


