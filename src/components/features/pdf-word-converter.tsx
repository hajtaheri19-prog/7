"use client";

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  Trash2, 
  FileText,
  FileImage,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRightLeft,
  FileDown,
  FileUp
} from 'lucide-react';
import { validatePdfFileForWord, validateWordFile } from '@/lib/pdf-word-converter';

export default function PdfWordConverter() {
  const [mode, setMode] = useState<'pdf-to-word' | 'word-to-pdf'>('pdf-to-word');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [conversionResult, setConversionResult] = useState<{
    fileName: string;
    processingTime: number;
    pageCount?: number;
    wordCount?: number;
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (file: File) => {
    // Validate file based on mode
    const validation = mode === 'pdf-to-word' 
      ? validatePdfFileForWord(file)
      : validateWordFile(file);
      
    if (!validation.isValid) {
      toast({
        title: "خطا",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setUploadedFile(file);
    setConversionResult(null);
  };

  const handleConversion = async () => {
    if (!uploadedFile) return;

    setLoading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const apiEndpoint = mode === 'pdf-to-word' 
        ? '/api/convert-pdf-to-word'
        : '/api/convert-word-to-pdf';

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setProgress(100);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'خطا در تبدیل فایل');
      }

      // Get file name from response headers
      const contentDisposition = response.headers.get('content-disposition');
      const fileName = contentDisposition 
        ? contentDisposition.split('filename=')[1]?.replace(/"/g, '')
        : mode === 'pdf-to-word' ? 'converted.docx' : 'converted.pdf';

      // Create download link
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setConversionResult({
        fileName,
        processingTime: Date.now() - Date.now(), // This would be calculated server-side
        pageCount: Math.floor(Math.random() * 10) + 1, // Mock data
        wordCount: Math.floor(Math.random() * 1000) + 100, // Mock data
      });

      toast({
        title: "موفق! ✅",
        description: `فایل ${fileName} با موفقیت دانلود شد`
      });

    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطای نامشخص در تبدیل فایل",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setProgress(0);
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
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const clearAll = () => {
    setUploadedFile(null);
    setConversionResult(null);
    setProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getFileIcon = () => {
    if (mode === 'pdf-to-word') {
      return <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />;
    } else {
      return <FileImage className="w-12 h-12 text-muted-foreground mx-auto mb-4" />;
    }
  };

  const getFileDescription = () => {
    if (mode === 'pdf-to-word') {
      return 'فایل PDF را اینجا بکشید یا کلیک کنید';
    } else {
      return 'فایل Word (.docx یا .doc) را اینجا بکشید یا کلیک کنید';
    }
  };

  const getFileButtonText = () => {
    if (mode === 'pdf-to-word') {
      return 'انتخاب فایل PDF';
    } else {
      return 'انتخاب فایل Word';
    }
  };

  const getFileSizeLimit = () => {
    return 'حداکثر ۱۵ مگابایت';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <ArrowRightLeft className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">تبدیل PDF ↔ Word</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          PDF را به Word تبدیل کنید یا Word را به PDF تبدیل کنید
        </p>
      </div>

      {/* Mode Selector */}
      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <Button
            variant={mode === 'pdf-to-word' ? 'default' : 'outline'}
            onClick={() => setMode('pdf-to-word')}
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF به Word
          </Button>
          <Button
            variant={mode === 'word-to-pdf' ? 'default' : 'outline'}
            onClick={() => setMode('word-to-pdf')}
            className="flex-1"
          >
            <FileImage className="w-4 h-4 mr-2" />
            Word به PDF
          </Button>
        </div>

        {/* Upload Area */}
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
          {getFileIcon()}
          <p className="text-muted-foreground mb-4">
            {getFileDescription()}
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
                {getFileButtonText()}
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground">
            {getFileSizeLimit()}
          </p>
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">در حال تبدیل...</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={mode === 'pdf-to-word' ? 'application/pdf' : '.docx,.doc'}
          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
          className="hidden"
          disabled={loading}
        />
      </Card>

      {/* File Info and Actions */}
      {uploadedFile && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">فایل انتخاب شده</h2>
            <Button variant="outline" onClick={clearAll}>
              <Trash2 className="w-4 h-4 mr-2" />
              پاک کردن
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="font-medium">{uploadedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  حجم: {(uploadedFile.size / 1024 / 1024).toFixed(2)} مگابایت
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={handleConversion}
                disabled={loading}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    در حال تبدیل...
                  </>
                ) : (
                  <>
                    {mode === 'pdf-to-word' ? (
                      <>
                        <FileDown className="w-4 h-4 mr-2" />
                        تبدیل به Word
                      </>
                    ) : (
                      <>
                        <FileUp className="w-4 h-4 mr-2" />
                        تبدیل به PDF
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Conversion Result */}
      {conversionResult && (
        <Card className="p-6">
          <div className="flex items-center gap-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <p className="font-medium text-green-700 dark:text-green-300">
                تبدیل با موفقیت انجام شد!
              </p>
              <p className="text-sm text-green-600 dark:text-green-400">
                فایل {conversionResult.fileName} دانلود شد
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Instructions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">راهنمای استفاده</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary mt-0.5">1</div>
            <p>حالت تبدیل مورد نظر خود را انتخاب کنید (PDF به Word یا Word به PDF)</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary mt-0.5">2</div>
            <p>فایل خود را آپلود کنید (حداکثر ۱۵ مگابایت)</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary mt-0.5">3</div>
            <p>روی دکمه تبدیل کلیک کنید و منتظر بمانید</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-bold text-primary mt-0.5">4</div>
            <p>فایل تبدیل شده به صورت خودکار دانلود خواهد شد</p>
          </div>
        </div>
      </Card>
    </div>
  );
}