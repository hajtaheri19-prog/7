"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Eye, RefreshCw, CheckCircle, XCircle, Target, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

// Color blindness test patterns (Ishihara-style)
const COLOR_TESTS = [
  {
    id: 1,
    correctAnswer: "8",
    description: "عدد 8 را می‌بینید؟",
    difficulty: "easy",
    type: "protanopia", // Red-green colorblindness
    colors: {
      background: "#90EE90", // Light green
      number: "#FF6B6B",     // Red
      dots: ["#98FB98", "#FFB6C1", "#90EE90", "#FF69B4"]
    }
  },
  {
    id: 2,
    correctAnswer: "3",
    description: "عدد 3 را می‌بینید؟",
    difficulty: "medium",
    type: "deuteranopia",
    colors: {
      background: "#FFE4B5", // Moccasin
      number: "#8B4513",     // Saddle brown
      dots: ["#DEB887", "#CD853F", "#F4A460", "#D2B48C"]
    }
  },
  {
    id: 3,
    correctAnswer: "5",
    description: "عدد 5 را می‌بینید؟",
    difficulty: "hard",
    type: "tritanopia", // Blue-yellow colorblindness
    colors: {
      background: "#E6E6FA", // Lavender
      number: "#4169E1",     // Royal blue
      dots: ["#DDA0DD", "#9370DB", "#BA55D3", "#8A2BE2"]
    }
  },
  {
    id: 4,
    correctAnswer: "12",
    description: "عدد 12 را می‌بینید؟",
    difficulty: "medium",
    type: "protanopia",
    colors: {
      background: "#F0E68C", // Khaki
      number: "#DC143C",     // Crimson
      dots: ["#BDB76B", "#DAA520", "#B8860B", "#CD853F"]
    }
  },
  {
    id: 5,
    correctAnswer: "7",
    description: "عدد 7 را می‌بینید؟",
    difficulty: "easy",
    type: "normal",
    colors: {
      background: "#FFB6C1", // Light pink
      number: "#228B22",     // Forest green
      dots: ["#FFC0CB", "#FF69B4", "#FF1493", "#DB7093"]
    }
  }
];

// Visual acuity test (Snellen chart style)
const VISUAL_ACUITY_LINES = [
  { size: "text-6xl", letters: "E", distance: "20/200", level: 1 },
  { size: "text-5xl", letters: "FP", distance: "20/100", level: 2 },
  { size: "text-4xl", letters: "TOZ", distance: "20/70", level: 3 },
  { size: "text-3xl", letters: "LPED", distance: "20/50", level: 4 },
  { size: "text-2xl", letters: "PECFD", distance: "20/40", level: 5 },
  { size: "text-xl", letters: "EDFCZP", distance: "20/30", level: 6 },
  { size: "text-lg", letters: "FELOPZD", distance: "20/25", level: 7 },
  { size: "text-base", letters: "DEFPOTEC", distance: "20/20", level: 8 }
];

export default function ColorVisionTest() {
  const [testType, setTestType] = useState<'color' | 'acuity' | null>(null);
  const [currentTest, setCurrentTest] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [results, setResults] = useState<any>(null);
  const [acuityLevel, setAcuityLevel] = useState(0);
  const { toast } = useToast();

  const generateDotPattern = (test: typeof COLOR_TESTS[0]) => {
    const dots = [];
    const gridSize = 15;
    
    for (let i = 0; i < gridSize * gridSize; i++) {
      const isNumberDot = Math.random() < 0.3; // 30% chance for number dots
      const color = isNumberDot 
        ? test.colors.number 
        : test.colors.dots[Math.floor(Math.random() * test.colors.dots.length)];
      
      dots.push({
        id: i,
        color,
        isNumber: isNumberDot,
        size: Math.random() * 8 + 12 // Random size between 12-20px
      });
    }
    
    return dots;
  };

  const submitColorAnswer = () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "پاسخ خود را وارد کنید",
        description: "لطفاً عدد یا حرفی که می‌بینید را وارد کنید",
        variant: "destructive"
      });
      return;
    }

    const newAnswers = [...userAnswers, currentAnswer];
    setUserAnswers(newAnswers);
    setCurrentAnswer('');

    if (currentTest < COLOR_TESTS.length - 1) {
      setCurrentTest(currentTest + 1);
    } else {
      // Calculate results
      let correctAnswers = 0;
      COLOR_TESTS.forEach((test, index) => {
        if (newAnswers[index]?.toLowerCase() === test.correctAnswer.toLowerCase()) {
          correctAnswers++;
        }
      });

      const percentage = (correctAnswers / COLOR_TESTS.length) * 100;
      let diagnosis = '';
      
      if (percentage >= 80) {
        diagnosis = 'بینایی رنگ شما طبیعی است';
      } else if (percentage >= 60) {
        diagnosis = 'احتمال کم‌رنگ‌بینی خفیف وجود دارد';
      } else if (percentage >= 40) {
        diagnosis = 'احتمال کم‌رنگ‌بینی متوسط وجود دارد';
      } else {
        diagnosis = 'احتمال کم‌رنگ‌بینی شدید وجود دارد - مراجعه به پزشک توصیه می‌شود';
      }

      setResults({
        type: 'color',
        correct: correctAnswers,
        total: COLOR_TESTS.length,
        percentage,
        diagnosis
      });
    }
  };

  const checkAcuityLevel = (level: number) => {
    setAcuityLevel(level);
    
    let diagnosis = '';
    if (level >= 7) {
      diagnosis = 'بینایی شما عالی است (20/20 یا بهتر)';
    } else if (level >= 5) {
      diagnosis = 'بینایی شما خوب است (20/40)';
    } else if (level >= 3) {
      diagnosis = 'بینایی شما متوسط است (20/70)';
    } else {
      diagnosis = 'بینایی شما ضعیف است - مراجعه به پزشک چشم توصیه می‌شود';
    }

    setResults({
      type: 'acuity',
      level,
      distance: VISUAL_ACUITY_LINES[level - 1]?.distance || '20/200',
      diagnosis
    });
  };

  const resetTest = () => {
    setTestType(null);
    setCurrentTest(0);
    setUserAnswers([]);
    setCurrentAnswer('');
    setResults(null);
    setAcuityLevel(0);
  };

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <div className="glass-effect rounded-2xl p-5 mb-4 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 border-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/40 to-emerald-500/20 shadow-[0_0_18px_#10b98155] flex items-center justify-center">
            <Eye className="w-5 h-5 text-green-300" />
          </div>
          <div>
            <div className="text-lg font-display font-semibold text-foreground">تست بینایی و رنگ‌بینی</div>
            <div className="text-sm text-foreground/70">بررسی سلامت چشم و تشخیص رنگ‌ها</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {!testType && !results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center space-y-4 mb-6">
              <motion.div
                animate={{ 
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-20 h-20 mx-auto bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center border-2 border-green-500/40 shadow-[0_0_30px_#10b98144]"
              >
                <Eye className="w-10 h-10 text-green-200" />
              </motion.div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-green-200">نوع تست را انتخاب کنید</h3>
                <p className="text-sm text-foreground/70 max-w-md mx-auto">
                  این تست‌ها فقط برای بررسی اولیه هستند و جایگزین معاینه پزشکی نیستند
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                onClick={() => setTestType('color')}
                className="h-20 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 hover:from-purple-500/30 hover:to-pink-500/30"
              >
                <div className="text-center">
                  <Palette className="w-8 h-8 mx-auto mb-2 text-purple-300" />
                  <div className="font-bold">تست رنگ‌بینی</div>
                  <div className="text-xs opacity-70">تشخیص کم‌رنگ‌بینی</div>
                </div>
              </Button>

              <Button 
                onClick={() => setTestType('acuity')}
                className="h-20 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 hover:from-blue-500/30 hover:to-cyan-500/30"
              >
                <div className="text-center">
                  <Target className="w-8 h-8 mx-auto mb-2 text-blue-300" />
                  <div className="font-bold">تست تیزی بینایی</div>
                  <div className="text-xs opacity-70">بررسی وضوح دید</div>
                </div>
              </Button>
            </div>
          </motion.div>
        )}

        {/* Color Vision Test */}
        <AnimatePresence>
          {testType === 'color' && !results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="text-center">
                <div className="text-lg font-bold text-purple-200 mb-2">
                  تست {currentTest + 1} از {COLOR_TESTS.length}
                </div>
                <div className="text-sm text-foreground/70">
                  {COLOR_TESTS[currentTest].description}
                </div>
              </div>

              {/* Color Test Pattern */}
              <div className="flex justify-center">
                <div 
                  className="w-80 h-80 rounded-full border-4 border-purple-500/30 shadow-[0_0_30px_#a855f733] relative overflow-hidden"
                  style={{ backgroundColor: COLOR_TESTS[currentTest].colors.background }}
                >
                  <div className="absolute inset-4 grid grid-cols-15 gap-1">
                    {generateDotPattern(COLOR_TESTS[currentTest]).map((dot) => (
                      <div
                        key={dot.id}
                        className="rounded-full"
                        style={{
                          backgroundColor: dot.color,
                          width: `${dot.size}px`,
                          height: `${dot.size}px`,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center">
                  <input
                    type="text"
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="عدد یا حرف دیده شده"
                    className="w-32 p-3 text-center text-2xl bg-black/30 border border-purple-500/30 rounded-xl text-foreground"
                    onKeyPress={(e) => e.key === 'Enter' && submitColorAnswer()}
                  />
                </div>
                
                <div className="flex justify-center gap-3">
                  <Button onClick={submitColorAnswer} className="bg-gradient-to-r from-purple-500 to-pink-500">
                    {currentTest < COLOR_TESTS.length - 1 ? 'بعدی' : 'پایان تست'}
                  </Button>
                  <Button onClick={() => setCurrentAnswer('نمی‌بینم')} variant="outline">
                    نمی‌بینم
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Visual Acuity Test */}
        <AnimatePresence>
          {testType === 'acuity' && !results && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-6"
            >
              <div className="text-center space-y-4">
                <h3 className="text-xl font-bold text-blue-200">تست تیزی بینایی</h3>
                <p className="text-sm text-foreground/70 max-w-md mx-auto">
                  از فاصله 2 متری صفحه نمایش، کوچکترین خطی را که می‌توانید بخوانید انتخاب کنید
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl max-w-md mx-auto">
                {VISUAL_ACUITY_LINES.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="text-center py-2 cursor-pointer hover:bg-gray-100 rounded"
                    onClick={() => checkAcuityLevel(line.level)}
                  >
                    <div className={`${line.size} font-bold text-black tracking-wider`}>
                      {line.letters}
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {line.distance}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="text-center">
                <Button onClick={resetTest} variant="outline">
                  انصراف
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results && (
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
                  className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-500/50 to-emerald-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_#10b98166]"
                >
                  <CheckCircle className="w-10 h-10 text-green-200" />
                </motion.div>
                <h3 className="text-2xl font-bold text-green-300 mb-2">نتایج تست</h3>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/15 to-emerald-500/15 border border-green-500/30">
                {results.type === 'color' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-200 mb-2">
                        {results.correct}/{results.total}
                      </div>
                      <div className="text-lg text-green-300">
                        {results.percentage.toFixed(0)}% صحیح
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-black/20">
                      <div className="text-lg font-medium text-foreground">
                        {results.diagnosis}
                      </div>
                    </div>
                  </div>
                )}

                {results.type === 'acuity' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-green-200 mb-2">
                        {results.distance}
                      </div>
                      <div className="text-lg text-green-300">
                        سطح {results.level} از 8
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-black/20">
                      <div className="text-lg font-medium text-foreground">
                        {results.diagnosis}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-center">
                <Button onClick={resetTest} className="bg-gradient-to-r from-blue-500 to-cyan-500">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  تست جدید
                </Button>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20 text-center">
                <p className="text-sm text-yellow-200/90">
                  ⚠️ این تست فقط برای بررسی اولیه است و جایگزین معاینه پزشکی نیست.
                  در صورت مشکل، حتماً به پزشک چشم مراجعه کنید.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
