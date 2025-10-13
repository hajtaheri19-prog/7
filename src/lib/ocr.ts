import Tesseract from 'tesseract.js';

export interface OCRResult {
  text: string;
  confidence: number;
  processingTime: number;
}

export async function extractTextFromImage(file: File): Promise<OCRResult> {
  const startTime = Date.now();
  
  try {
    const result = await Tesseract.recognize(file, 'fas+eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const processingTime = Date.now() - startTime;
    
    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
      processingTime,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('خطا در استخراج متن از تصویر');
  }
}

export async function extractTextFromImageURL(imageUrl: string): Promise<OCRResult> {
  const startTime = Date.now();
  
  try {
    const result = await Tesseract.recognize(imageUrl, 'fas+eng', {
      logger: (m) => {
        if (m.status === 'recognizing text') {
          console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const processingTime = Date.now() - startTime;
    
    return {
      text: result.data.text.trim(),
      confidence: result.data.confidence,
      processingTime,
    };
  } catch (error) {
    console.error('OCR Error:', error);
    throw new Error('خطا در استخراج متن از تصویر');
  }
}

// Helper function to validate image file
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!file) {
    return { isValid: false, error: 'فایل انتخاب نشده است' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'فرمت فایل پشتیبانی نمی‌شود. لطفاً تصویر با فرمت JPG، PNG، GIF یا WebP انتخاب کنید' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'حجم فایل بیش از حد مجاز است. حداکثر ۱۰ مگابایت' };
  }
  
  return { isValid: true };
}

// Helper function to clean and format Persian text
export function cleanPersianText(text: string): string {
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n\s*\n/g, '\n') // Remove empty lines
    .trim();
}
