"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Headphones } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Frequency ranges for hearing test
const FREQUENCY_TESTS = [
  { freq: 250, name: "250 Hz", description: "فرکانس پایین (صداهای عمیق)" },
  { freq: 500, name: "500 Hz", description: "فرکانس پایین-متوسط" },
  { freq: 1000, name: "1 kHz", description: "فرکانس متوسط (گفتار)" },
  { freq: 2000, name: "2 kHz", description: "فرکانس متوسط-بالا" },
  { freq: 4000, name: "4 kHz", description: "فرکانس بالا (صداهای تیز)" },
  { freq: 8000, name: "8 kHz", description: "فرکانس خیلی بالا" }
];

const VOLUME_LEVELS = [
  { db: 10, description: "خیلی آرام" },
  { db: 20, description: "آرام" },
  { db: 30, description: "متوسط" },
  { db: 40, description: "بلند" },
  { db: 50, description: "خیلی بلند" }
];

export default function HearingTest() {
  const [testPhase, setTestPhase] = useState<'setup' | 'testing' | 'results'>('setup');
  const [currentFreqIndex, setCurrentFreqIndex] = useState(0);
  const [currentVolume, setCurrentVolume] = useState([30]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [testResults, setTestResults] = useState<{freq: number, minVolume: number}[]>([]);
  const [currentEar, setCurrentEar] = useState<'left' | 'right'>('left');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      stopTone();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initAudioContext = async () => {
    try {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
    } catch (error) {
      toast({
        title: "خطا در صدا",
        description: "امکان پخش صدا وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const playTone = async (frequency: number, volume: number, ear: 'left' | 'right') => {
    if (!audioContextRef.current) {
      await initAudioContext();
    }
    
    if (!audioContextRef.current) return;

    stopTone();

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();
      const panner = audioContextRef.current.createStereoPanner();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      
      // Convert volume percentage to gain (0-1)
      const gain = Math.pow(volume / 100, 2) * 0.3; // Max 0.3 to prevent hearing damage
      gainNode.gain.setValueAtTime(gain, audioContextRef.current.currentTime);
      
      // Pan to left (-1) or right (1)
      panner.pan.setValueAtTime(ear === 'left' ? -1 : 1, audioContextRef.current.currentTime);

      oscillator.connect(gainNode);
      gainNode.connect(panner);
      panner.connect(audioContextRef.current.destination);

      oscillator.start();
      
      oscillatorRef.current = oscillator;
      gainNodeRef.current = gainNode;
      pannerRef.current = panner;
      
      setIsPlaying(true);
    } catch (error) {
      toast({
        title: "خطا در پخش",
        description: "امکان پخش تون وجود ندارد",
        variant: "destructive"
      });
    }
  };

  const stopTone = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.stop();
      } catch (error) {
        // Oscillator might already be stopped
      }
      oscillatorRef.current = null;
    }
    if (gainNodeRef.current) {
      gainNodeRef.current = null;
    }
    if (pannerRef.current) {
      pannerRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleCanHear = () => {
    const currentFreq = FREQUENCY_TESTS[currentFreqIndex].freq;
    const volume = currentVolume[0];
    
    setTestResults(prev => [
      ...prev.filter(r => r.freq !== currentFreq),
      { freq: currentFreq, minVolume: volume }
    ]);

    stopTone();
    
    if (currentFreqIndex < FREQUENCY_TESTS.length - 1) {
      setCurrentFreqIndex(currentFreqIndex + 1);
      setCurrentVolume([30]); // Reset volume for next frequency
    } else {
      if (currentEar === 'left') {
        setCurrentEar('right');
        setCurrentFreqIndex(0);
        setCurrentVolume([30]);
        toast({
          title: "گوش چپ تمام شد",
          description: "حالا گوش راست را تست کنید",
        });
      } else {
        setTestPhase('results');
      }
    }
  };

  const handleCannotHear = () => {
    if (currentVolume[0] < 90) {
      setCurrentVolume([Math.min(currentVolume[0] + 10, 90)]);
    } else {
      // Maximum volume reached, record as hearing loss
      const currentFreq = FREQUENCY_TESTS[currentFreqIndex].freq;
      setTestResults(prev => [
        ...prev.filter(r => r.freq !== currentFreq),
        { freq: currentFreq, minVolume: 100 } // 100 indicates cannot hear
      ]);
      
      if (currentFreqIndex < FREQUENCY_TESTS.length - 1) {
        setCurrentFreqIndex(currentFreqIndex + 1);
        setCurrentVolume([30]);
      } else {
        if (currentEar === 'left') {
          setCurrentEar('right');
          setCurrentFreqIndex(0);
          setCurrentVolume([30]);
        } else {
          setTestPhase('results');
        }
      }
    }
  };

  const getHearingAssessment = () => {
    const avgThreshold = testResults.reduce((sum, result) => sum + result.minVolume, 0) / testResults.length;
    
    if (avgThreshold <= 25) {
      return { level: "عالی", description: "شنوایی شما در حد طبیعی است", color: "text-green-300" };
    } else if (avgThreshold <= 40) {
      return { level: "خوب", description: "شنوایی شما نسبتاً خوب است", color: "text-yellow-300" };
    } else if (avgThreshold <= 60) {
      return { level: "متوسط", description: "کاهش خفیف شنوایی - مراجعه به پزشک توصیه می‌شود", color: "text-orange-300" };
    } else {
      return { level: "ضعیف", description: "کاهش قابل توجه شنوایی - حتماً به پزشک مراجعه کنید", color: "text-red-300" };
    }
  };

  const resetTest = () => {
    stopTone();
    setTestPhase('setup');
    setCurrentFreqIndex(0);
    setCurrentVolume([30]);
    setTestResults([]);
    setCurrentEar('left');
  };

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="glass-effect rounded-2xl p-5 mb-4 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/40 to-purple-500/20 shadow-[0_0_18px_#3b82f655] flex items-center justify-center">
            <Headphones className="w-5 h-5 text-blue-300" />
          </div>
          <div>
            <div className="text-lg font-display font-semibold text-foreground">تست شنوایی</div>
            <div className="text-sm text-foreground/70">بررسی سلامت گوش و تشخیص فرکانس‌ها</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Setup Phase */}
        {testPhase === 'setup' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="text-center space-y-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full flex items-center justify-center border-2 border-blue-500/40 shadow-[0_0_30px_#3b82f644]"
              >
                <Headphones className="w-10 h-10 text-blue-200" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-blue-200">تست شنوایی</h3>
                <p className="text-sm text-foreground/70 max-w-md mx-auto">
                  برای انجام دقیق تست، از هدفون استفاده کنید و در محیطی آرام قرار بگیرید
                </p>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-r from-yellow-500/15 to-amber-500/15 border border-yellow-500/30">
              <h4 className="text-lg font-bold text-yellow-300 mb-3">دستورالعمل:</h4>
              <ul className="space-y-2 text-sm text-foreground/90">
                <li>• از هدفون با کیفیت استفاده کنید</li>
                <li>• در محیطی آرام و بدون سر و صدا باشید</li>
                <li>• ابتدا گوش چپ، سپس گوش راست تست می‌شود</li>
                <li>• وقتی صدا می‌شنوید دکمه "می‌شنوم" را بزنید</li>
                <li>• اگر صدا نمی‌شنوید دکمه "نمی‌شنوم" را بزنید</li>
              </ul>
            </div>

            <div className="text-center">
              <Button 
                onClick={() => setTestPhase('testing')}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold h-12 px-8"
              >
                <Headphones className="w-5 h-5 mr-2" />
                شروع تست
              </Button>
            </div>
          </motion.div>
        )}

        {/* Testing Phase */}
        <AnimatePresence>
          {testPhase === 'testing' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="text-center space-y-2">
                <div className="text-lg font-bold text-blue-200">
                  گوش {currentEar === 'left' ? 'چپ' : 'راست'} - فرکانس {FREQUENCY_TESTS[currentFreqIndex].name}
                </div>
                <div className="text-sm text-foreground/70">
                  {FREQUENCY_TESTS[currentFreqIndex].description}
                </div>
                <div className="text-xs text-foreground/50">
                  تست {currentFreqIndex + 1} از {FREQUENCY_TESTS.length}
                </div>
              </div>

              {/* Volume Control */}
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-sm text-foreground/70 mb-2">شدت صدا: {currentVolume[0]}%</div>
                  <Slider
                    value={currentVolume}
                    onValueChange={setCurrentVolume}
                    max={90}
                    min={10}
                    step={5}
                    className="w-full max-w-md mx-auto"
                  />
                </div>

                {/* Play Controls */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={() => {
                      if (isPlaying) {
                        stopTone();
                      } else {
                        playTone(FREQUENCY_TESTS[currentFreqIndex].freq, currentVolume[0], currentEar);
                      }
                    }}
                    className="bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        توقف
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        پخش تون
                      </>
                    )}
                  </Button>
                </div>

                {/* Response Buttons */}
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleCanHear}
                    className="bg-gradient-to-r from-green-500 to-emerald-500"
                  >
                    <Volume2 className="w-4 h-4 mr-2" />
                    می‌شنوم
                  </Button>
                  <Button
                    onClick={handleCannotHear}
                    variant="outline"
                    className="border-red-500/30 hover:bg-red-500/20"
                  >
                    <VolumeX className="w-4 h-4 mr-2" />
                    نمی‌شنوم
                  </Button>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="w-full bg-black/30 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((currentFreqIndex + (currentEar === 'right' ? FREQUENCY_TESTS.length : 0)) / (FREQUENCY_TESTS.length * 2)) * 100}%` 
                  }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Phase */}
        <AnimatePresence>
          {testPhase === 'results' && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="space-y-6"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500/50 to-purple-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_#3b82f666]"
                >
                  <Headphones className="w-10 h-10 text-blue-200" />
                </motion.div>
                <h3 className="text-2xl font-bold text-blue-300 mb-2">نتایج تست شنوایی</h3>
              </div>

              {/* Overall Assessment */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/15 to-purple-500/15 border border-blue-500/30">
                <div className="text-center space-y-2">
                  <div className={`text-2xl font-bold ${getHearingAssessment().color}`}>
                    {getHearingAssessment().level}
                  </div>
                  <div className="text-lg text-foreground">
                    {getHearingAssessment().description}
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-blue-300 text-center">نتایج تفصیلی</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {FREQUENCY_TESTS.map((freq, index) => {
                    const result = testResults.find(r => r.freq === freq.freq);
                    const volume = result?.minVolume || 0;
                    
                    return (
                      <motion.div
                        key={freq.freq}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="p-4 rounded-xl bg-black/20 border border-blue-500/20"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium text-foreground">{freq.name}</div>
                            <div className="text-xs text-foreground/70">{freq.description}</div>
                          </div>
                          <div className="text-right">
                            <div className={`font-bold ${
                              volume <= 25 ? 'text-green-300' :
                              volume <= 40 ? 'text-yellow-300' :
                              volume <= 60 ? 'text-orange-300' : 'text-red-300'
                            }`}>
                              {volume >= 100 ? 'نمی‌شنود' : `${volume}%`}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              <div className="text-center">
                <Button onClick={resetTest} className="bg-gradient-to-r from-green-500 to-emerald-500">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  تست جدید
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 text-center">
                <p className="text-sm text-yellow-200/90">
                  ⚠️ این تست فقط برای بررسی اولیه است و جایگزین معاینه پزشکی نیست.
                  در صورت مشکل شنوایی، حتماً به پزشک گوش و حلق و بینی مراجعه کنید.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
