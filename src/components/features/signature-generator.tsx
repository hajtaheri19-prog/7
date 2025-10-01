
"use client";

import { useRef, useEffect, useState, useCallback } from 'react';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eraser, Download, Type, Brush } from 'lucide-react';
import { Label } from '../ui/label';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { cn } from '@/lib/utils';


const fonts = [
    { name: 'Amiri', className: 'font-amiri', label: 'امیری (رسمی)' },
    { name: 'Dancing Script', className: 'font-dancing-script', label: 'اسکریپت (فانتزی)' },
    { name: 'Great Vibes', className: 'font-great-vibes', label: 'وایبز (هنری)' },
    { name: 'Parisienne', className: 'font-parisienne', label: 'پاریس (کلاسیک)' },
    { name: 'Caveat', className: 'font-caveat', label: 'کاویت (ساده)' },
];

export default function SignatureGenerator() {
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);
  const typeCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Draw state
  const [lineWidth, setLineWidth] = useState(3);
  const [lineColor, setLineColor] = useState("#000000");

  // Type state
  const [typedText, setTypedText] = useState("حسین طاهری");
  const [selectedFont, setSelectedFont] = useState(fonts[0].className);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(60);

  const getCanvasContext = (ref: React.RefObject<HTMLCanvasElement>) => {
    const canvas = ref.current;
    if (!canvas) return null;
    return canvas.getContext('2d');
  };

  const resizeCanvas = (canvas: HTMLCanvasElement) => {
    const container = canvas.parentElement;
    if (container) {
      canvas.width = container.clientWidth;
      canvas.height = 300; // Fixed height
    }
  };

  // Effect for drawing canvas
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    resizeCanvas(canvas);
    window.addEventListener('resize', () => resizeCanvas(canvas));
    return () => window.removeEventListener('resize', () => resizeCanvas(canvas));
  }, []);
  
  // Effect for typing canvas
  const drawTypedSignature = useCallback(() => {
    const canvas = typeCanvasRef.current;
    const ctx = getCanvasContext(typeCanvasRef);
    if (!canvas || !ctx) return;
    
    resizeCanvas(canvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const fontName = fonts.find(f => f.className === selectedFont)?.name || 'serif';
    ctx.font = `${fontSize}px "${fontName}"`;
    ctx.fillStyle = fontColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(typedText, canvas.width / 2, canvas.height / 2);
  }, [typedText, selectedFont, fontSize, fontColor]);

  useEffect(() => {
    // Dynamically load fonts for the typed signature
    const fontNames = fonts.map(f => f.name).join(':400,700|').replace(/ /g, '+');
    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css?family=${fontNames}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    // Initial draw
    const timeout = setTimeout(drawTypedSignature, 100); // Wait for fonts to load
    return () => { 
        document.head.removeChild(link);
        clearTimeout(timeout);
    };
  }, [drawTypedSignature]);

  useEffect(() => {
    drawTypedSignature();
  }, [typedText, selectedFont, fontSize, fontColor, drawTypedSignature]);


  const getCoords = (canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent): { x: number, y: number } | null => {
    const rect = canvas.getBoundingClientRect();
    if (e instanceof MouseEvent) {
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
    }
    return null;
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if(!canvas) return;
    const coords = getCoords(canvas, e.nativeEvent);
    if (!coords) return;
    
    const ctx = getCanvasContext(drawCanvasRef);
    if (!ctx) return;
    
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
     const canvas = drawCanvasRef.current;
    if(!canvas) return;
    const coords = getCoords(canvas, e.nativeEvent);
    if (!coords) return;

    const ctx = getCanvasContext(drawCanvasRef);
    if (!ctx) return;

    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    const ctx = getCanvasContext(drawCanvasRef);
    if (!ctx) return;
    ctx.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = (ref: React.RefObject<HTMLCanvasElement>) => {
    const canvas = ref.current;
    const ctx = getCanvasContext(ref);
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const downloadSignature = (ref: React.RefObject<HTMLCanvasElement>) => {
    const canvas = ref.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = 'signature.png';
      link.click();
    }
  };
  
   const FontStyle = ({ font }: { font: { name: string, className: string, label: string } }) => (
    <span className={cn(font.className)} style={{ fontFamily: `"${font.name}"` }}>
      {font.label}
    </span>
  );

  return (
    <CardContent className="space-y-4">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400;1,700&family=Caveat:wght@400..700&family=Dancing+Script:wght@400..700&family=Great+Vibes&family=Parisienne&display=swap');
        .font-amiri { font-family: "Amiri", serif; }
        .font-dancing-script { font-family: "Dancing Script", cursive; }
        .font-great-vibes { font-family: "Great Vibes", cursive; }
        .font-parisienne { font-family: "Parisienne", cursive; }
        .font-caveat { font-family: "Caveat", cursive; }
      `}</style>

      <Tabs defaultValue="draw" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="draw" className="gap-2"><Brush className="w-4 h-4"/> کشیدن امضا</TabsTrigger>
            <TabsTrigger value="type" className="gap-2"><Type className="w-4 h-4"/> نوشتن امضا</TabsTrigger>
        </TabsList>
        
        <TabsContent value="draw" className="space-y-4 pt-4">
            <div className="w-full border-2 border-dashed rounded-lg bg-muted/20">
                <canvas
                ref={drawCanvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseOut={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="cursor-crosshair"
                />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                    <Label>ضخامت قلم</Label>
                    <span className="font-mono text-sm">{lineWidth}px</span>
                    </div>
                    <Slider value={[lineWidth]} onValueChange={(val) => setLineWidth(val[0])} min={1} max={10} step={0.5} />
                </div>
                <div className="space-y-2">
                    <Label>رنگ قلم</Label>
                    <Input type="color" value={lineColor} onChange={(e) => setLineColor(e.target.value)} className="w-full h-12 p-1" />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => clearCanvas(drawCanvasRef)}><Eraser className="ml-2 h-5 w-5" /> پاک کردن</Button>
                <Button onClick={() => downloadSignature(drawCanvasRef)}><Download className="ml-2 h-5 w-5" /> دانلود امضا (PNG)</Button>
            </div>
        </TabsContent>

        <TabsContent value="type" className="space-y-4 pt-4">
            <div className="w-full border-2 border-dashed rounded-lg bg-muted/20">
                <canvas ref={typeCanvasRef} />
            </div>
            
             <div className="space-y-2">
                <Label>متن امضا</Label>
                <Input value={typedText} onChange={e => setTypedText(e.target.value)} className="h-12 text-center text-lg" placeholder="نام خود را وارد کنید"/>
             </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="space-y-2">
                    <Label>فونت</Label>
                    <Select value={selectedFont} onValueChange={setSelectedFont}>
                        <SelectTrigger><SelectValue/></SelectTrigger>
                        <SelectContent>{fonts.map(f => <SelectItem key={f.name} value={f.className}><FontStyle font={f}/></SelectItem>)}</SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label>اندازه</Label>
                    <Slider value={[fontSize]} onValueChange={(val) => setFontSize(val[0])} min={20} max={100} step={2} />
                </div>
                <div className="space-y-2">
                    <Label>رنگ</Label>
                    <Input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} className="w-full h-10 p-1"/>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                 <Button variant="outline" onClick={() => setTypedText('')}><Eraser className="ml-2 h-5 w-5" /> پاک کردن متن</Button>
                <Button onClick={() => downloadSignature(typeCanvasRef)}><Download className="ml-2 h-5 w-5" /> دانلود امضا (PNG)</Button>
            </div>
        </TabsContent>
      </Tabs>

    </CardContent>
  );
}
