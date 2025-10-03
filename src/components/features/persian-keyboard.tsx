"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Clipboard, Download, RotateCcw, Type, Globe } from 'lucide-react';

// Persian keyboard layout
const PERSIAN_LAYOUT = [
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع', 'ه', 'خ', 'ح', 'ج', 'چ'],
  ['ش', 'س', 'ی', 'ب', 'ل', 'ا', 'ت', 'ن', 'م', 'ک', 'گ'],
  ['ظ', 'ط', 'ز', 'ر', 'ذ', 'د', 'پ', 'و', 'ء', 'آ'],
  ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰']
];

// English keyboard layout
const ENGLISH_LAYOUT = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']
];

// Special characters and symbols
const SPECIAL_CHARS = [
  ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')'],
  ['-', '_', '+', '=', '[', ']', '{', '}', '\\', '|'],
  [';', ':', '"', "'", ',', '.', '<', '>', '/', '?'],
  ['ء', 'آ', 'أ', 'إ', 'ة', 'ى', 'ي', 'ؤ', 'ئ', 'ـ']
];

export default function PersianKeyboard() {
  const [text, setText] = useState('');
  const [isPersian, setIsPersian] = useState(true);
  const [showSpecialChars, setShowSpecialChars] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle key press
  const handleKeyPress = (key: string) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newText = text.substring(0, start) + key + text.substring(end);
      setText(newText);
      
      // Set cursor position after the inserted character
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + 1, start + 1);
      }, 0);
    }
  };

  // Handle backspace
  const handleBackspace = () => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      
      if (start === end && start > 0) {
        // Delete one character before cursor
        const newText = text.substring(0, start - 1) + text.substring(end);
        setText(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start - 1, start - 1);
        }, 0);
      } else if (start !== end) {
        // Delete selected text
        const newText = text.substring(0, start) + text.substring(end);
        setText(newText);
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start, start);
        }, 0);
      }
    }
  };

  // Handle space
  const handleSpace = () => {
    handleKeyPress(' ');
  };

  // Handle enter
  const handleEnter = () => {
    handleKeyPress('\n');
  };

  // Clear text
  const clearText = () => {
    setText('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Copy text
  const copyText = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  // Download text
  const downloadText = () => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'persian-text.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get current layout
  const getCurrentLayout = () => {
    if (showSpecialChars) return SPECIAL_CHARS;
    return isPersian ? PERSIAN_LAYOUT : ENGLISH_LAYOUT;
  };

  // Render keyboard row
  const renderKeyboardRow = (row: string[], rowIndex: number) => (
    <div key={rowIndex} className="flex justify-center gap-1 mb-1">
      {row.map((key, keyIndex) => (
        <Button
          key={keyIndex}
          variant="outline"
          size="sm"
          className="min-w-[2.5rem] h-10 text-sm font-medium hover:bg-primary/10"
          onClick={() => handleKeyPress(capsLock && !isPersian ? key.toUpperCase() : key)}
        >
          {capsLock && !isPersian ? key.toUpperCase() : key}
        </Button>
      ))}
    </div>
  );

  return (
    <Card className="glass-effect border-0 bg-gradient-to-br from-black/40 via-zinc-900/40 to-black/30 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-display">کیبورد فارسی آنلاین</span>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4" />
            <Globe className="w-4 h-4" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Text Input Area */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">ناحیه تایپ متن</Label>
          <Textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="متن خود را اینجا تایپ کنید یا از کیبورد زیر استفاده کنید..."
            className="min-h-[120px] resize-none text-right"
            dir={isPersian ? 'rtl' : 'ltr'}
          />
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant={isPersian ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPersian(true)}
            className="flex items-center gap-1"
          >
            <span>فارسی</span>
          </Button>
          <Button
            variant={!isPersian ? "default" : "outline"}
            size="sm"
            onClick={() => setIsPersian(false)}
            className="flex items-center gap-1"
          >
            <span>English</span>
          </Button>
          <Button
            variant={capsLock ? "default" : "outline"}
            size="sm"
            onClick={() => setCapsLock(!capsLock)}
            disabled={isPersian}
            className="flex items-center gap-1"
          >
            <span>Caps</span>
          </Button>
          <Button
            variant={showSpecialChars ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSpecialChars(!showSpecialChars)}
            className="flex items-center gap-1"
          >
            <span>@#$</span>
          </Button>
        </div>

        {/* Virtual Keyboard */}
        <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
          <div className="text-center mb-4">
            <Label className="text-sm text-zinc-400">
              {showSpecialChars ? 'کاراکترهای ویژه' : isPersian ? 'کیبورد فارسی' : 'English Keyboard'}
            </Label>
          </div>
          
          {/* Keyboard Layout */}
          <div className="space-y-1">
            {getCurrentLayout().map((row, index) => renderKeyboardRow(row, index))}
          </div>

          {/* Function Keys */}
          <div className="flex justify-center gap-1 mt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSpace}
              className="flex-1 max-w-[200px] h-10"
            >
              Space
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackspace}
              className="w-20 h-10"
            >
              ←
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEnter}
              className="w-20 h-10"
            >
              Enter
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={copyText}
            className="flex items-center gap-1"
          >
            <Clipboard className="w-4 h-4" />
            کپی متن
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={downloadText}
            className="flex items-center gap-1"
          >
            <Download className="w-4 h-4" />
            دانلود
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={clearText}
            className="flex items-center gap-1"
          >
            <RotateCcw className="w-4 h-4" />
            پاک کردن
          </Button>
        </div>

        {/* Text Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-zinc-800/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{text.length}</div>
            <div className="text-xs text-zinc-400">کاراکتر</div>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{text.split(/\s+/).filter(word => word.length > 0).length}</div>
            <div className="text-xs text-zinc-400">کلمه</div>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{text.split('\n').length}</div>
            <div className="text-xs text-zinc-400">خط</div>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-3">
            <div className="text-2xl font-bold text-primary">{Math.ceil(text.length / 5)}</div>
            <div className="text-xs text-zinc-400">دقیقه خواندن</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
