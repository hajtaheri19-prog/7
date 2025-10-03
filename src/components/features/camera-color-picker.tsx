"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Copy, Palette, Eye, EyeOff, Target, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface ColorData {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export default function CameraColorPicker() {
  const [isActive, setIsActive] = useState(false);
  const [currentColor, setCurrentColor] = useState<ColorData | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [crosshairPosition, setCrosshairPosition] = useState({ x: 50, y: 50 });
  const [colorHistory, setColorHistory] = useState<ColorData[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationRef = useRef<number>();
  
  const { toast } = useToast();

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const getColorAtPosition = useCallback((x: number, y: number): ColorData | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const pixelX = Math.floor((x / 100) * canvas.width);
    const pixelY = Math.floor((y / 100) * canvas.height);
    
    const imageData = ctx.getImageData(pixelX, pixelY, 1, 1);
    const [r, g, b] = imageData.data;

    const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    const hsl = rgbToHsl(r, g, b);

    return { hex, rgb: { r, g, b }, hsl };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsActive(true);
        
        toast({
          title: "دوربین فعال شد",
          description: "روی تصویر کلیک کنید تا رنگ را انتخاب کنید",
        });
      }
    } catch (error) {
      toast({
        title: "خطا در فعال‌سازی دوربین",
        description: "لطفاً اجازه دسترسی به دوربین را بدهید",
        variant: "destructive"
      });
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsActive(false);
    setIsTracking(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleVideoClick = (e: React.MouseEvent<HTMLVideoElement>) => {
    if (!videoRef.current) return;
    
    const rect = videoRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setCrosshairPosition({ x, y });
    const color = getColorAtPosition(x, y);
    
    if (color) {
      setCurrentColor(color);
      setColorHistory(prev => {
        const newHistory = [color, ...prev.filter(c => c.hex !== color.hex)];
        return newHistory.slice(0, 8);
      });
    }
  };

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  const trackColor = useCallback(() => {
    if (isTracking && isActive) {
      const color = getColorAtPosition(crosshairPosition.x, crosshairPosition.y);
      if (color) {
        setCurrentColor(color);
      }
      animationRef.current = requestAnimationFrame(trackColor);
    }
  }, [isTracking, isActive, crosshairPosition, getColorAtPosition]);

  useEffect(() => {
    if (isTracking) {
      trackColor();
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isTracking, trackColor]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "کپی شد",
        description: `${label} کپی شد: ${text}`,
      });
    } catch (error) {
      toast({
        title: "خطا در کپی",
        description: "امکان کپی وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const downloadPalette = () => {
    if (colorHistory.length === 0) return;
    
    const paletteData = colorHistory.map(color => 
      `${color.hex} - RGB(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}) - HSL(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
    ).join('\n');
    
    const blob = new Blob([paletteData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'color-palette.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="glass-effect rounded-2xl p-5 mb-4 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/40 to-pink-500/20 shadow-[0_0_18px_#a855f755] flex items-center justify-center">
            <Palette className="w-5 h-5 text-purple-300" />
          </div>
          <div>
            <div className="text-lg font-display font-semibold text-foreground">رنگ‌یاب دوربین</div>
            <div className="text-sm text-foreground/70">تشخیص رنگ زنده از دوربین</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Camera Controls */}
        <div className="flex gap-3 justify-center">
          {!isActive ? (
            <Button onClick={startCamera} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
              <Camera className="w-4 h-4 mr-2" />
              فعال کردن دوربین
            </Button>
          ) : (
            <>
              <Button onClick={stopCamera} variant="destructive">
                <EyeOff className="w-4 h-4 mr-2" />
                بستن دوربین
              </Button>
              <Button 
                onClick={toggleTracking} 
                variant={isTracking ? "default" : "outline"}
                className={isTracking ? "bg-gradient-to-r from-blue-500 to-cyan-500" : ""}
              >
                <Target className="w-4 h-4 mr-2" />
                {isTracking ? 'توقف ردیابی' : 'ردیابی زنده'}
              </Button>
            </>
          )}
        </div>

        {/* Camera View */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_0_30px_#a855f733]"
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onClick={handleVideoClick}
                className="w-full max-h-80 object-cover cursor-crosshair"
              />
              
              {/* Crosshair */}
              <div 
                className="absolute w-8 h-8 border-2 border-white rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 shadow-lg"
                style={{ 
                  left: `${crosshairPosition.x}%`, 
                  top: `${crosshairPosition.y}%`,
                  backgroundColor: currentColor?.hex || 'transparent'
                }}
              >
                <div className="absolute inset-1 border border-black/50 rounded-full"></div>
              </div>
              
              <canvas ref={canvasRef} className="hidden" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Current Color Display */}
        <AnimatePresence>
          {currentColor && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/15 to-pink-500/15 border border-purple-500/30"
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-2xl border-2 border-white/30 shadow-lg"
                  style={{ backgroundColor: currentColor.hex }}
                ></div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-purple-200 mb-2">رنگ انتخاب شده</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(currentColor.hex, 'HEX')}
                      className="justify-start"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      HEX: {currentColor.hex}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(`rgb(${currentColor.rgb.r}, ${currentColor.rgb.g}, ${currentColor.rgb.b})`, 'RGB')}
                      className="justify-start"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      RGB: {currentColor.rgb.r}, {currentColor.rgb.g}, {currentColor.rgb.b}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(`hsl(${currentColor.hsl.h}, ${currentColor.hsl.s}%, ${currentColor.hsl.l}%)`, 'HSL')}
                      className="justify-start"
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      HSL: {currentColor.hsl.h}, {currentColor.hsl.s}%, {currentColor.hsl.l}%
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Color History */}
        <AnimatePresence>
          {colorHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-bold text-blue-300">پالت رنگ‌ها</h4>
                <Button onClick={downloadPalette} size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-1" />
                  دانلود
                </Button>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {colorHistory.map((color, index) => (
                  <motion.div
                    key={`${color.hex}-${index}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative"
                  >
                    <div
                      className="w-12 h-12 rounded-xl border-2 border-white/20 cursor-pointer hover:scale-110 transition-transform shadow-lg"
                      style={{ backgroundColor: color.hex }}
                      onClick={() => copyToClipboard(color.hex, 'HEX')}
                      title={color.hex}
                    />
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-foreground/60 opacity-0 group-hover:opacity-100 transition-opacity">
                      {color.hex}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Instructions */}
        {!isActive && (
          <div className="text-center py-8 text-foreground/60 space-y-2">
            <Eye className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <p>دوربین را فعال کنید و روی هر جسم کلیک کنید تا رنگ آن را تشخیص دهید</p>
            <p className="text-sm">از حالت ردیابی زنده برای مشاهده تغییرات لحظه‌ای استفاده کنید</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
