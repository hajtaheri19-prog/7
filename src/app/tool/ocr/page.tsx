"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  Copy, 
  Trash2, 
  Eye, 
  Loader2,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { extractTextFromImage, validateImageFile, cleanPersianText, OCRResult } from '@/lib/ocr';

export default function OCRTool() {
  const [result, setResult] = useState<OCRResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      toast({
        title: "خطا",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // Create preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Process OCR
      const ocrResult = await extractTextFromImage(file);
      setResult(ocrResult);

      toast({
        title: "موفق! ✅",
        description: `متن با موفقیت استخراج شد (${Math.round(ocrResult.confidence)}% دقت)`
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطای نامشخص در پردازش تصویر",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const copyToClipboard = async () => {
    if (result?.text) {
      try {
        await navigator.clipboard.writeText(result.text);
        toast({
          title: "کپی شد! 📋",
          description: "متن به کلیپ‌بورد کپی شد"
        });
      } catch (error) {
        toast({
          title: "خطا",
          description: "خطا در کپی کردن متن",
          variant: "destructive"
        });
      }
    }
  };

  const downloadText = () => {
    if (result?.text) {
      const blob = new Blob([result.text], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extracted-text.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "دانلود شد! 💾",
        description: "فایل متن دانلود شد"
      });
    }
  };

  const clearAll = () => {
    setResult(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">استخراج متن از تصویر</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          تصویر خود را آپلود کنید تا متن فارسی آن استخراج شود
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary" />
            آپلود تصویر
          </h2>
          
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              dragActive 
                ? 'border-primary bg-primary/5' 
                : 'border-muted-foreground/30 hover:border-primary/50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              تصویر را اینجا بکشید یا کلیک کنید
            </p>
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              className="mb-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  در حال پردازش...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  انتخاب فایل
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              فرمت‌های پشتیبانی شده: JPG, PNG, GIF, WebP (حداکثر ۱۰ مگابایت)
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            disabled={loading}
          />

          {imagePreview && (
            <div className="mt-4">
              <h3 className="text-sm font-medium mb-2">پیش‌نمایش تصویر:</h3>
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="max-w-full h-48 object-contain rounded-lg border"
              />
            </div>
          )}
        </Card>

        {/* Results Section */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Eye className="w-5 h-5 text-primary" />
              نتیجه استخراج
            </h2>
            {result && (
              <Button variant="outline" size="sm" onClick={clearAll}>
                <Trash2 className="w-4 h-4 mr-2" />
                پاک کردن
              </Button>
            )}
          </div>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">در حال استخراج متن...</p>
                <p className="text-sm text-muted-foreground mt-2">
                  لطفاً صبر کنید، این فرآیند ممکن است چند ثانیه طول بکشد
                </p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4">
              {/* Confidence and Stats */}
              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  {result.confidence > 70 ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-yellow-500" />
                  )}
                  <span className="text-sm font-medium">
                    دقت: {Math.round(result.confidence)}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  زمان پردازش: {(result.processingTime / 1000).toFixed(1)} ثانیه
                </div>
              </div>

              {/* Extracted Text */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">متن استخراج شده:</h3>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4 mr-2" />
                      کپی
                    </Button>
                    <Button size="sm" variant="outline" onClick={downloadText}>
                      <Download className="w-4 h-4 mr-2" />
                      دانلود
                    </Button>
                  </div>
                </div>
                
                <Textarea
                  value={cleanPersianText(result.text)}
                  readOnly
                  className="min-h-[200px] resize-none font-mono text-sm leading-relaxed"
                  placeholder="متن استخراج شده اینجا نمایش داده می‌شود..."
                />
              </div>

              {result.confidence < 70 && (
                <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-300">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">نکته:</span>
                  </div>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                    دقت استخراج پایین است. ممکن است تصویر کیفیت مناسبی نداشته باشد یا متن واضح نباشد.
                  </p>
                </div>
              )}
            </div>
          )}

          {!result && !loading && (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>هنوز تصویری آپلود نشده است</p>
              <p className="text-sm mt-1">تصویر خود را آپلود کنید تا متن آن استخراج شود</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
