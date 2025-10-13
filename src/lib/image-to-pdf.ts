import jsPDF from 'jspdf';

export interface ImageToPdfResult {
  success: boolean;
  fileName: string;
  processingTime: number;
}

export interface ImageData {
  dataUrl: string;
  fileName: string;
  width?: number;
  height?: number;
}

export function imagesToPdf(
  imageDataList: ImageData[], 
  fileName: string = 'converted.pdf',
  orientation: 'portrait' | 'landscape' = 'portrait'
): ImageToPdfResult {
  // Ensure we're running on client side
  if (typeof window === 'undefined') {
    throw new Error('PDF generation is only available on the client side');
  }

  const startTime = Date.now();
  
  try {
    if (!imageDataList || imageDataList.length === 0) {
      throw new Error('هیچ تصویری برای تبدیل انتخاب نشده است');
    }

    const pdf = new jsPDF({ 
      orientation, 
      unit: 'pt', 
      format: 'a4' 
    });

    imageDataList.forEach((imageData, index) => {
      if (index > 0) {
        pdf.addPage();
      }

      // Calculate dimensions to fit A4 page
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      let imgWidth = pageWidth;
      let imgHeight = pageHeight;
      
      // Maintain aspect ratio
      if (imageData.width && imageData.height) {
        const aspectRatio = imageData.width / imageData.height;
        const pageAspectRatio = pageWidth / pageHeight;
        
        if (aspectRatio > pageAspectRatio) {
          imgHeight = pageWidth / aspectRatio;
        } else {
          imgWidth = pageHeight * aspectRatio;
        }
      }

      // Center the image on the page
      const x = (pageWidth - imgWidth) / 2;
      const y = (pageHeight - imgHeight) / 2;

      pdf.addImage(
        imageData.dataUrl, 
        'PNG', 
        x, 
        y, 
        imgWidth, 
        imgHeight
      );
    });

    pdf.save(fileName);
    
    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      fileName,
      processingTime,
    };
  } catch (error) {
    console.error('Image to PDF Error:', error);
    throw new Error('خطا در تبدیل تصاویر به PDF');
  }
}

export function imagesToPdfWithOptions(
  imageDataList: ImageData[],
  options: {
    fileName?: string;
    orientation?: 'portrait' | 'landscape';
    format?: 'a4' | 'a3' | 'letter';
    quality?: number;
    margin?: number;
  } = {}
): ImageToPdfResult {
  // Ensure we're running on client side
  if (typeof window === 'undefined') {
    throw new Error('PDF generation is only available on the client side');
  }

  const startTime = Date.now();
  
  try {
    if (!imageDataList || imageDataList.length === 0) {
      throw new Error('هیچ تصویری برای تبدیل انتخاب نشده است');
    }

    const {
      fileName = 'converted.pdf',
      orientation = 'portrait',
      format = 'a4',
      margin = 20
    } = options;

    const pdf = new jsPDF({ 
      orientation, 
      unit: 'pt', 
      format 
    });

    imageDataList.forEach((imageData, index) => {
      if (index > 0) {
        pdf.addPage();
      }

      // Calculate dimensions with margin
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const availableWidth = pageWidth - (margin * 2);
      const availableHeight = pageHeight - (margin * 2);
      
      let imgWidth = availableWidth;
      let imgHeight = availableHeight;
      
      // Maintain aspect ratio
      if (imageData.width && imageData.height) {
        const aspectRatio = imageData.width / imageData.height;
        const availableAspectRatio = availableWidth / availableHeight;
        
        if (aspectRatio > availableAspectRatio) {
          imgHeight = availableWidth / aspectRatio;
        } else {
          imgWidth = availableHeight * aspectRatio;
        }
      }

      // Center the image on the page with margin
      const x = margin + (availableWidth - imgWidth) / 2;
      const y = margin + (availableHeight - imgHeight) / 2;

      pdf.addImage(
        imageData.dataUrl, 
        'PNG', 
        x, 
        y, 
        imgWidth, 
        imgHeight
      );
    });

    pdf.save(fileName);
    
    const processingTime = Date.now() - startTime;
    
    return {
      success: true,
      fileName,
      processingTime,
    };
  } catch (error) {
    console.error('Image to PDF Error:', error);
    throw new Error('خطا در تبدیل تصاویر به PDF');
  }
}

// Helper function to validate image files
export function validateImageFiles(files: File[]): { isValid: boolean; error?: string } {
  const maxSize = 10 * 1024 * 1024; // 10MB per file
  const maxFiles = 20; // Maximum 20 images
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (!files || files.length === 0) {
    return { isValid: false, error: 'هیچ تصویری انتخاب نشده است' };
  }
  
  if (files.length > maxFiles) {
    return { isValid: false, error: `حداکثر ${maxFiles} تصویر قابل انتخاب است` };
  }
  
  for (const file of files) {
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'فرمت فایل پشتیبانی نمی‌شود. لطفاً تصاویر با فرمت JPG، PNG، GIF یا WebP انتخاب کنید' };
    }
    
    if (file.size > maxSize) {
      return { isValid: false, error: 'حجم فایل بیش از حد مجاز است. حداکثر ۱۰ مگابایت برای هر تصویر' };
    }
  }
  
  return { isValid: true };
}

// Helper function to convert File to ImageData
export function fileToImageData(file: File): Promise<ImageData> {
  // Ensure we're running on client side
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Image processing is only available on the client side'));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      
      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        resolve({
          dataUrl,
          fileName: file.name,
          width: img.width,
          height: img.height,
        });
      };
      img.onerror = () => {
        reject(new Error('خطا در بارگذاری تصویر'));
      };
      img.src = dataUrl;
    };
    
    reader.onerror = () => {
      reject(new Error('خطا در خواندن فایل'));
    };
    
    reader.readAsDataURL(file);
  });
}
