"use client";

import React, { useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Clipboard, Download, Play, StopCircle } from 'lucide-react';

const LETTERS: Record<string, string> = {
  "a": ".-", "b": "-...", "c": "-.-.", "d": "-..", "e": ".", "f": "..-.", "g": "--.", "h": "....", "i": "..", "j": ".---",
  "k": "-.-", "l": ".-..", "m": "--", "n": "-.", "o": "---", "p": ".--.", "q": "--.-", "r": ".-.", "s": "...", "t": "-",
  "u": "..-", "v": "...-", "w": ".--", "x": "-..-", "y": "-.--", "z": "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-", "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  " ": "/"
};

function textToMorse(text: string, delimiter: string) {
  return text
    .toLowerCase()
    .split("")
    .map(ch => LETTERS[ch] || "")
    .filter(Boolean)
    .join(delimiter);
}

function morseToText(morse: string) {
  const map = new Map(Object.entries(LETTERS).map(([k,v]) => [v,k]));
  return morse.split(/[\s/|]+/).map(code => map.get(code) || "").join("");
}

export default function MorseConverter() {
  const [mode, setMode] = useState<'t2m' | 'm2t'>('t2m');
  const [text, setText] = useState('سلام Tabdila');
  const [morse, setMorse] = useState('');
  const [delimiter, setDelimiter] = useState<'space' | 'slash' | 'bar'>('space');
  const [speed, setSpeed] = useState<number>(120); // WPM-ish scale
  const [playing, setPlaying] = useState(false);
  const ledRef = useRef<HTMLDivElement | null>(null);

  const sep = useMemo(() => delimiter === 'space' ? ' ' : delimiter === 'slash' ? ' / ' : ' | ', [delimiter]);

  const morseOutput = useMemo(() => mode === 't2m' ? textToMorse(text, sep) : morse, [mode, text, morse, sep]);
  const textOutput = useMemo(() => mode === 'm2t' ? morseToText(morse) : text, [mode, text, morse]);

  const copy = async (value: string) => {
    try { await navigator.clipboard.writeText(value); } catch {}
  };

  const tone = async () => {
    if (playing) { setPlaying(false); return; }
    setPlaying(true);
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const unit = Math.max(50, 240 - speed); // ms per dot
      const sequence = morseOutput;
      for (const ch of sequence) {
        if (!playing) break;
        if (ch === '.') {
          await beep(ctx, unit, ledRef.current);
        } else if (ch === '-') {
          await beep(ctx, unit * 3, ledRef.current);
        } else if (ch === ' ') {
          await sleep(unit * 1.5);
        } else if (ch === '/' || ch === '|') {
          await sleep(unit * 4);
        }
      }
      await ctx.close();
    } finally {
      setPlaying(false);
    }
  };

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-display">مبدل متن ↔ مورس</span>
          <div ref={ledRef} className="w-3 h-3 rounded-full bg-zinc-600 shadow-[0_0_10px_rgba(0,0,0,0.4)]" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <RadioGroup className="flex gap-6" value={mode} onValueChange={(v)=>setMode(v as any)}>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="t2m" value="t2m" />
              <Label htmlFor="t2m">Text → Morse</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem id="m2t" value="m2t" />
              <Label htmlFor="m2t">Morse → Text</Label>
            </div>
          </RadioGroup>
        </div>

        {mode === 't2m' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>متن ورودی</Label>
              <Textarea value={text} onChange={(e)=>setText(e.target.value)} className="min-h-[140px]" />
            </div>
            <div className="space-y-2">
              <Label>خروجی مورس</Label>
              <Textarea value={morseOutput} readOnly className="min-h-[140px]" />
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={()=>copy(morseOutput)}><Clipboard className="w-4 h-4 mr-1" />کپی</Button>
                <Button variant="default" size="sm" onClick={tone}>{playing ? (<><StopCircle className="w-4 h-4 mr-1" />توقف</>) : (<><Play className="w-4 h-4 mr-1" />پخش</>)}</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ورودی مورس</Label>
              <Textarea value={morse} onChange={(e)=>setMorse(e.target.value)} placeholder=".- ..- / ..." className="min-h-[140px]" />
            </div>
            <div className="space-y-2">
              <Label>متن خروجی</Label>
              <Textarea value={textOutput} readOnly className="min-h-[140px]" />
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" onClick={()=>copy(textOutput)}><Clipboard className="w-4 h-4 mr-1" />کپی</Button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>جداکننده</Label>
            <RadioGroup className="flex gap-4" value={delimiter} onValueChange={(v)=>setDelimiter(v as any)}>
              <div className="flex items-center gap-2"><RadioGroupItem id="d-space" value="space" /><Label htmlFor="d-space">فاصله</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem id="d-slash" value="slash" /><Label htmlFor="d-slash">/</Label></div>
              <div className="flex items-center gap-2"><RadioGroupItem id="d-bar" value="bar" /><Label htmlFor="d-bar">|</Label></div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label>سرعت پخش</Label>
            <Slider value={[speed]} onValueChange={(v)=>setSpeed(v[0])} min={60} max={200} step={5} />
          </div>
          <div className="space-y-2">
            <Label>دانلود</Label>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={()=>downloadText('morse.txt', morseOutput)}><Download className="w-4 h-4 mr-1" />متن مورس</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

async function beep(ctx: AudioContext, durationMs: number, led?: HTMLDivElement | null) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = 650;
  osc.connect(gain);
  gain.connect(ctx.destination);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
  osc.start();
  if (led) led.style.backgroundColor = '#eab308';
  await sleep(durationMs);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.02);
  osc.stop(ctx.currentTime + 0.03);
  if (led) led.style.backgroundColor = '#52525b';
}

function sleep(ms: number) { return new Promise(res => setTimeout(res, ms)); }

function downloadText(filename: string, content: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type: 'text/plain;charset=utf-8' }));
  a.download = filename;
  a.click();
}
