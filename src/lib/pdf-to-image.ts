import { loadPdfJs } from './pdfjs-init';

export interface PDFToImageResult {
  images: string[];
  pageCount: number;
  processingTime: number;
}

export async function pdfToImages(file: File, scale: number = 2): Promise<PDFToImageResult> {
  // Ensure we're running on client side
  if (typeof window === 'undefined') {
    throw new Error('PDF processing is only available on the client side');
  }

  // Load PDF.js dynamically
  const pdfjsLib = await loadPdfJs();

  const startTime = Date.now();
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Initialize PDF.js with proper configuration
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: false,
      disableRange: false,
      disableStream: false,
    }).promise;
    
    const images: string[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('خطا در ایجاد Canvas context');
      }
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ 
        canvas: canvas,
        viewport 
      }).promise;
      
      images.push(canvas.toDataURL('image/png'));
    }

    const processingTime = Date.now() - startTime;
    
    return {
      images,
      pageCount: pdf.numPages,
      processingTime,
    };
  } catch (error) {
    console.error('PDF to Image Error:', error);
    throw new Error('خطا در تبدیل PDF به تصویر');
  }
}

export async function pdfToImagesWithProgress(
  file: File, 
  scale: number = 2,
  onProgress?: (progress: number) => void
): Promise<PDFToImageResult> {
  // Ensure we're running on client side
  if (typeof window === 'undefined') {
    throw new Error('PDF processing is only available on the client side');
  }

  // Load PDF.js dynamically
  const pdfjsLib = await loadPdfJs();

  const startTime = Date.now();
  
  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Initialize PDF.js with proper configuration
    const pdf = await pdfjsLib.getDocument({ 
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: false,
      disableRange: false,
      disableStream: false,
    }).promise;
    
    const images: string[] = [];
    const totalPages = pdf.numPages;

    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        throw new Error('خطا در ایجاد Canvas context');
      }
      
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ 
        canvas: canvas,
        viewport 
      }).promise;
      
      images.push(canvas.toDataURL('image/png'));
      
      // Report progress
      if (onProgress) {
        onProgress((i / totalPages) * 100);
      }
    }

    const processingTime = Date.now() - startTime;
    
    return {
      images,
      pageCount: totalPages,
      processingTime,
    };
  } catch (error) {
    console.error('PDF to Image Error:', error);
    throw new Error('خطا در تبدیل PDF به تصویر');
  }
}

// Helper function to validate PDF file
export function validatePdfFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 50 * 1024 * 1024; // 50MB
  const allowedTypes = ['application/pdf'];
  
  if (!file) {
    return { isValid: false, error: 'فایل انتخاب نشده است' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'فرمت فایل پشتیبانی نمی‌شود. لطفاً فایل PDF انتخاب کنید' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'حجم فایل بیش از حد مجاز است. حداکثر ۵۰ مگابایت' };
  }
  
  return { isValid: true };
}
