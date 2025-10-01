
"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import jsQR from 'jsqr';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload, Copy, AlertCircle, Video, X, CheckCircle, FileUp, ScanLine } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

export default function QrCodeReader() {
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationFrameId = useRef<number>();
  const streamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

  const stopScan = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if(videoRef.current) {
        videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  useEffect(() => {
    // Cleanup on component unmount
    return () => stopScan();
  }, [stopScan]);

  const tick = useCallback(() => {
    if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
      const canvas = canvasRef.current;
      if (canvas) {
        const video = videoRef.current;
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
          if (code) {
            setResult(code.data);
            toast({ title: 'موفقیت!', description: 'کد QR با موفقیت خوانده شد.' });
            stopScan();
          }
        }
      }
    }
    if (isScanning) {
        animationFrameId.current = requestAnimationFrame(tick);
    }
  }, [isScanning, stopScan, toast]);

  const startCamera = async () => {
    stopScan();
    setResult(null);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      setHasPermission(true);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsScanning(true);
        animationFrameId.current = requestAnimationFrame(tick);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setHasPermission(false);
      setError('امکان دسترسی به دوربین وجود ندارد. لطفاً دسترسی لازم را بدهید.');
      stopScan();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    stopScan();
    setResult(null);
    setError(null);

    const reader = new FileReader();
    reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
            const canvas = canvasRef.current;
            if(!canvas) return;
            const ctx = canvas.getContext('2d');
            if(!ctx) return;
            
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0, img.width, img.height);
            const imageData = ctx.getImageData(0, 0, img.width, img.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code) {
                setResult(code.data);
                toast({ title: 'موفقیت!', description: 'کد QR از فایل خوانده شد.' });
            } else {
                setError('هیچ کد QR در تصویر یافت نشد.');
            }
        };
        img.src = event.target?.result as string;
    }
    reader.readAsDataURL(file);
  }

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    toast({ title: 'کپی شد!', description: 'محتوای کد در کلیپ‌بورد کپی شد.' });
  };

  return (
    <CardContent className="space-y-6">
      <div className="relative w-full aspect-video bg-muted/30 rounded-2xl overflow-hidden flex items-center justify-center border shadow-inner">
        <video ref={videoRef} className={cn("w-full h-full object-cover transition-opacity", isScanning ? 'opacity-100' : 'opacity-0')} autoPlay playsInline muted />
        <canvas ref={canvasRef} className="hidden" />

        {/* Overlay for status messages and actions */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          {!isScanning ? (
            <div className="text-center space-y-4 w-full">
              {error && (
                <Alert variant="destructive" className="max-w-sm mx-auto">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>خطا</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
               {result && !error && (
                <div className="flex flex-col items-center gap-2 text-green-600">
                    <CheckCircle className="w-12 h-12"/>
                    <p className="font-semibold">کد با موفقیت خوانده شد</p>
                </div>
              )}
               {!result && !error && (
                 <div className="flex flex-col items-center gap-4 w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-sm">
                         <Button onClick={startCamera} className="h-24 flex-col gap-2 text-base">
                            <Camera className="w-8 h-8"/>
                            اسکن با دوربین
                        </Button>
                        <Button onClick={() => fileInputRef.current?.click()} variant="secondary" className="h-24 flex-col gap-2 text-base">
                            <FileUp className="w-8 h-8"/>
                            آپلود تصویر
                        </Button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                    </div>
                </div>
               )}
            </div>
          ) : (
             <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="relative w-48 h-48 sm:w-60 sm:h-60">
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-lg"></div>
                    <div className="absolute top-0 left-0 right-0 h-1 bg-primary/70 animate-scan-y shadow-[0_0_15px] shadow-primary"></div>
                </div>
                <p className="mt-4 text-white bg-black/50 px-3 py-1 rounded-md flex items-center gap-2"><ScanLine className="w-5 h-5"/>در جستجوی کد QR...</p>
                 <Button onClick={stopScan} size="icon" variant="destructive" className="absolute bottom-4 pointer-events-auto rounded-full h-14 w-14 shadow-lg">
                    <X className="w-8 h-8"/>
                </Button>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div className="space-y-2">
            <Label className="text-muted-foreground">نتیجه اسکن</Label>
            <div className="relative">
                <Textarea readOnly value={result} className="min-h-[100px] text-base bg-green-400/10 text-green-800 dark:text-green-300 border-green-400/50" />
                <Button onClick={copyResult} size="icon" variant="ghost" className="absolute top-2 left-2 text-muted-foreground">
                    <Copy className="h-5 w-5" />
                </Button>
            </div>
        </div>
      )}
      
       <style>{`
        @keyframes scan-y {
          0% { transform: translateY(0); }
          100% { transform: translateY(calc(100% - 4px)); }
        }
        .animate-scan-y {
          animation: scan-y 2.5s infinite alternate ease-in-out;
        }
      `}</style>
    </CardContent>
  );
}
