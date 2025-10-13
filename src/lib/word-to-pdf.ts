import mammoth from 'mammoth';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';

export interface WordToPdfResult {
  success: boolean;
  fileName: string;
  processingTime: number;
  pageCount?: number;
  wordCount?: number;
}

export async function wordToPdf(fileBuffer: Buffer): Promise<WordToPdfResult> {
  const startTime = Date.now();
  
  try {
    // Parse Word document
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('فایل Word حاوی متن قابل استخراج نیست');
    }

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Split text into pages
    const text = result.value;
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const linesPerPage = 40; // Approximate lines per page
    const pages = [];
    
    for (let i = 0; i < lines.length; i += linesPerPage) {
      pages.push(lines.slice(i, i + linesPerPage));
    }
    
    if (pages.length === 0) {
      pages.push(['']); // At least one empty page
    }

    // Embed font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add pages to PDF
    pages.forEach((pageLines, pageIndex) => {
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
      
      let y = 800; // Start from top
      const lineHeight = 14;
      const margin = 50;
      
      pageLines.forEach((line, lineIndex) => {
        if (y < margin) {
          // Add new page if needed
          const newPage = pdfDoc.addPage([595.28, 841.89]);
          y = 800;
        }
        
        // Handle long lines by wrapping
        const maxWidth = 500;
        const words = line.split(' ');
        let currentLine = '';
        
        words.forEach(word => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const textWidth = font.widthOfTextAtSize(testLine, 12);
          
          if (textWidth > maxWidth && currentLine) {
            // Draw current line and start new line
            page.drawText(currentLine, {
              x: margin,
              y: y,
              size: 12,
              font: font,
              color: rgb(0, 0, 0),
            });
            y -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        
        // Draw remaining text
        if (currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y: y,
            size: 12,
            font: font,
            color: rgb(0, 0, 0),
          });
          y -= lineHeight;
        }
      });
    });

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    
    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      fileName: 'converted-from-word.pdf',
      processingTime,
      pageCount: pages.length,
      wordCount: text.split(/\s+/).length,
    };
  } catch (error) {
    console.error('Word to PDF Error:', error);
    throw new Error('خطا در تبدیل Word به PDF');
  }
}

export async function wordToPdfWithOptions(
  fileBuffer: Buffer,
  options: {
    fontSize?: number;
    fontFamily?: 'Helvetica' | 'TimesRoman' | 'Courier';
    pageSize?: 'A4' | 'A3' | 'Letter';
    margin?: number;
    lineHeight?: number;
  } = {}
): Promise<WordToPdfResult> {
  const startTime = Date.now();
  
  try {
    const {
      fontSize = 12,
      fontFamily = 'Helvetica',
      pageSize = 'A4',
      margin = 50,
      lineHeight = 14
    } = options;

    // Parse Word document
    const result = await mammoth.extractRawText({ buffer: fileBuffer });
    
    if (!result.value || result.value.trim().length === 0) {
      throw new Error('فایل Word حاوی متن قابل استخراج نیست');
    }

    // Create PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Embed font
    let font;
    switch (fontFamily) {
      case 'TimesRoman':
        font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
        break;
      case 'Courier':
        font = await pdfDoc.embedFont(StandardFonts.Courier);
        break;
      default:
        font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    }
    
    // Get page size
    let pageDimensions: [number, number];
    switch (pageSize) {
      case 'A3':
        pageDimensions = [841.89, 1190.55];
        break;
      case 'Letter':
        pageDimensions = [612, 792];
        break;
      default: // A4
        pageDimensions = [595.28, 841.89];
    }
    
    // Split text into pages
    const text = result.value;
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const linesPerPage = Math.floor((pageDimensions[1] - margin * 2) / lineHeight);
    const pages = [];
    
    for (let i = 0; i < lines.length; i += linesPerPage) {
      pages.push(lines.slice(i, i + linesPerPage));
    }
    
    if (pages.length === 0) {
      pages.push(['']); // At least one empty page
    }

    // Add pages to PDF
    pages.forEach((pageLines, pageIndex) => {
      const page = pdfDoc.addPage(pageDimensions);
      
      let y = pageDimensions[1] - margin; // Start from top
      
      pageLines.forEach((line, lineIndex) => {
        if (y < margin) {
          // Add new page if needed
          const newPage = pdfDoc.addPage(pageDimensions);
          y = pageDimensions[1] - margin;
        }
        
        // Handle long lines by wrapping
        const maxWidth = pageDimensions[0] - margin * 2;
        const words = line.split(' ');
        let currentLine = '';
        
        words.forEach(word => {
          const testLine = currentLine + (currentLine ? ' ' : '') + word;
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          
          if (textWidth > maxWidth && currentLine) {
            // Draw current line and start new line
            page.drawText(currentLine, {
              x: margin,
              y: y,
              size: fontSize,
              font: font,
              color: rgb(0, 0, 0),
            });
            y -= lineHeight;
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });
        
        // Draw remaining text
        if (currentLine) {
          page.drawText(currentLine, {
            x: margin,
            y: y,
            size: fontSize,
            font: font,
            color: rgb(0, 0, 0),
          });
          y -= lineHeight;
        }
      });
    });

    // Generate PDF bytes
    const pdfBytes = await pdfDoc.save();
    
    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      fileName: 'converted-from-word.pdf',
      processingTime,
      pageCount: pages.length,
      wordCount: text.split(/\s+/).length,
    };
  } catch (error) {
    console.error('Word to PDF Error:', error);
    throw new Error('خطا در تبدیل Word به PDF');
  }
}

// Helper function to validate Word file
export function validateWordFile(file: File): { isValid: boolean; error?: string } {
  const maxSize = 15 * 1024 * 1024; // 15MB
  const allowedTypes = [
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    'application/msword' // .doc
  ];
  
  if (!file) {
    return { isValid: false, error: 'فایل انتخاب نشده است' };
  }
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'فرمت فایل پشتیبانی نمی‌شود. لطفاً فایل Word (.docx یا .doc) انتخاب کنید' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'حجم فایل بیش از حد مجاز است. حداکثر ۱۵ مگابایت' };
  }
  
  return { isValid: true };
}

// Helper function to convert File to Buffer
export function fileToBuffer(file: File): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const buffer = Buffer.from(arrayBuffer);
      resolve(buffer);
    };
    
    reader.onerror = () => {
      reject(new Error('خطا در خواندن فایل'));
    };
    
    reader.readAsArrayBuffer(file);
  });
}
