"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Download, 
  Trash2, 
  FileText,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
  AlertCircle,
  ArrowRightLeft,
  FileImage,
  FileDown
} from 'lucide-react';
import { 
  pdfToImagesWithProgress, 
  imagesToPdfWithOptions, 
  validatePdfFile, 
  validateImageFiles, 
  fileToImageData,
  type PDFToImageResult,
  type ImageData 
} from '@/lib/pdf-converter';
import { loadPdfJs, isPdfJsLoaded } from '@/lib/pdfjs-init';

export default function PdfImageConverter() {
  const [mode, setMode] = useState<'pdf-to-image' | 'image-to-pdf'>('pdf-to-image');
  const [pdfResult, setPdfResult] = useState<PDFToImageResult | null>(null);
  const [imageFiles, setImageFiles] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const [pdfJsReady, setPdfJsReady] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load PDF.js when component mounts
  useEffect(() => {
    const initializePdf = async () => {
      try {
        await loadPdfJs();
        setPdfJsReady(true);
      } catch (error) {
        console.error('Failed to load PDF.js:', error);
        toast({
          title: "خطا",
          description: "خطا در بارگذاری PDF.js",
          variant: "destructive"
        });
      }
    };

    initializePdf();
  }, [toast]);

  const handlePdfUpload = async (file: File) => {
    if (!pdfJsReady) {
      toast({
        title: "خطا",
        description: "PDF.js هنوز آماده نیست. لطفاً صبر کنید.",
        variant: "destructive"
      });
      return;
    }

    const validation = validatePdfFile(file);
    if (!validation.isValid) {
      toast({
        title: "خطا",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setProgress(0);
    setPdfResult(null);

    try {
      const result = await pdfToImagesWithProgress(file, 2, (progress) => {
        setProgress(progress);
      });

      setPdfResult(result);
      toast({
        title: "موفق! ✅",
        description: `${result.pageCount} صفحه با موفقیت تبدیل شد`
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطای نامشخص در پردازش PDF",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const handleImageUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    const validation = validateImageFiles(fileArray);
    
    if (!validation.isValid) {
      toast({
        title: "خطا",
        description: validation.error,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    setImageFiles([]);

    try {
      const imageDataList: ImageData[] = [];
      
      for (let i = 0; i < fileArray.length; i++) {
        const imageData = await fileToImageData(fileArray[i]);
        imageDataList.push(imageData);
        setProgress(((i + 1) / fileArray.length) * 100);
      }

      setImageFiles(imageDataList);
      toast({
        title: "موفق! ✅",
        description: `${imageDataList.length} تصویر با موفقیت بارگذاری شد`
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطای نامشخص در پردازش تصاویر",
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
    
    if (mode === 'pdf-to-image' && e.dataTransfer.files[0]?.type === 'application/pdf') {
      if (!pdfJsReady) {
        toast({
          title: "خطا",
          description: "PDF.js هنوز آماده نیست. لطفاً صبر کنید.",
          variant: "destructive"
        });
        return;
      }
      handlePdfUpload(e.dataTransfer.files[0]);
    } else if (mode === 'image-to-pdf') {
      handleImageUpload(e.dataTransfer.files);
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `page-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "دانلود شد! 💾",
      description: `صفحه ${index + 1} دانلود شد`
    });
  };

  const downloadAllImages = () => {
    if (!pdfResult) return;
    
    pdfResult.images.forEach((dataUrl, index) => {
      setTimeout(() => {
        downloadImage(dataUrl, index);
      }, index * 200); // Delay between downloads
    });
    
    toast({
      title: "شروع دانلود! 📥",
      description: "همه صفحات در حال دانلود هستند"
    });
  };

  const generatePdf = async () => {
    if (imageFiles.length === 0) return;

    try {
      const result = imagesToPdfWithOptions(imageFiles, {
        fileName: 'converted-images.pdf',
        orientation: 'portrait',
        format: 'a4',
        margin: 20
      });

      toast({
        title: "موفق! ✅",
        description: `PDF با ${imageFiles.length} تصویر ایجاد شد`
      });
    } catch (error) {
      toast({
        title: "خطا",
        description: error instanceof Error ? error.message : "خطای نامشخص در ایجاد PDF",
        variant: "destructive"
      });
    }
  };

  const clearAll = () => {
    setPdfResult(null);
    setImageFiles([]);
    setProgress(0);
    if (pdfInputRef.current) pdfInputRef.current.value = '';
    if (imageInputRef.current) imageInputRef.current.value = '';
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-accent/20 rounded-xl flex items-center justify-center">
            <ArrowRightLeft className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">تبدیل PDF ↔ عکس</h1>
        </div>
        <p className="text-muted-foreground text-lg">
          PDF را به تصاویر تبدیل کنید یا تصاویر را به PDF تبدیل کنید
        </p>
      </div>

      {/* Mode Selector */}
      <Card className="p-6">
        <div className="flex gap-4 mb-6">
          <Button
            variant={mode === 'pdf-to-image' ? 'default' : 'outline'}
            onClick={() => setMode('pdf-to-image')}
            className="flex-1"
          >
            <FileText className="w-4 h-4 mr-2" />
            PDF به عکس
          </Button>
          <Button
            variant={mode === 'image-to-pdf' ? 'default' : 'outline'}
            onClick={() => setMode('image-to-pdf')}
            className="flex-1"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            عکس به PDF
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
          {mode === 'pdf-to-image' ? (
            <>
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                فایل PDF را اینجا بکشید یا کلیک کنید
              </p>
              <Button 
                onClick={() => pdfInputRef.current?.click()}
                disabled={loading || !pdfJsReady}
                className="mb-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    در حال پردازش...
                  </>
                ) : !pdfJsReady ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    در حال بارگذاری PDF.js...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    انتخاب فایل PDF
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                حداکثر ۵۰ مگابایت
              </p>
            </>
          ) : (
            <>
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">
                تصاویر را اینجا بکشید یا کلیک کنید
              </p>
              <Button 
                onClick={() => imageInputRef.current?.click()}
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
                    انتخاب تصاویر
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground">
                فرمت‌های پشتیبانی شده: JPG, PNG, GIF, WebP (حداکثر ۲۰ تصویر)
              </p>
            </>
          )}
        </div>

        {/* Progress Bar */}
        {loading && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">در حال پردازش...</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* File Inputs */}
        <input
          ref={pdfInputRef}
          type="file"
          accept="application/pdf"
          onChange={(e) => e.target.files?.[0] && handlePdfUpload(e.target.files[0])}
          className="hidden"
          disabled={loading || !pdfJsReady}
        />
        <input
          ref={imageInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
          className="hidden"
          disabled={loading}
        />
      </Card>

      {/* Results */}
      {(pdfResult || imageFiles.length > 0) && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">
              {mode === 'pdf-to-image' ? 'تصاویر استخراج شده' : 'تصاویر انتخاب شده'}
            </h2>
            <div className="flex gap-2">
              {mode === 'pdf-to-image' && pdfResult && (
                <Button onClick={downloadAllImages} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  دانلود همه
                </Button>
              )}
              {mode === 'image-to-pdf' && imageFiles.length > 0 && (
                <Button onClick={generatePdf}>
                  <FileDown className="w-4 h-4 mr-2" />
                  ایجاد PDF
                </Button>
              )}
              <Button variant="outline" onClick={clearAll}>
                <Trash2 className="w-4 h-4 mr-2" />
                پاک کردن
              </Button>
            </div>
          </div>

          {/* PDF to Image Results */}
          {mode === 'pdf-to-image' && pdfResult && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">
                  {pdfResult.pageCount} صفحه تبدیل شد
                </span>
                <span className="text-sm text-muted-foreground">
                  زمان پردازش: {(pdfResult.processingTime / 1000).toFixed(1)} ثانیه
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {pdfResult.images.map((dataUrl, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={dataUrl} 
                      alt={`صفحه ${index + 1}`}
                      className="w-full h-48 object-contain border rounded-lg bg-white"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <Button 
                        size="sm" 
                        onClick={() => downloadImage(dataUrl, index)}
                        className="bg-white text-black hover:bg-gray-100"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        دانلود
                      </Button>
                    </div>
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      صفحه {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Image to PDF Results */}
          {mode === 'image-to-pdf' && imageFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">
                  {imageFiles.length} تصویر آماده تبدیل
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageFiles.map((imageData, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={imageData.dataUrl} 
                      alt={imageData.fileName}
                      className="w-full h-48 object-cover border rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {index + 1}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded truncate">
                      {imageData.fileName}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}