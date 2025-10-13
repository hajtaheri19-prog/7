// Dynamic PDF.js loader to avoid SSR issues
let pdfjsLib: any = null;
let isInitialized = false;

export async function loadPdfJs() {
  if (typeof window === 'undefined') {
    throw new Error('PDF.js can only be loaded on the client side');
  }

  if (isInitialized && pdfjsLib) {
    return pdfjsLib;
  }

  try {
    // Dynamic import to avoid SSR issues
    const pdfjsModule = await import('pdfjs-dist');
    pdfjsLib = pdfjsModule;
    
    // Set up PDF.js worker
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
    
    isInitialized = true;
    console.log('PDF.js loaded successfully');
    
    return pdfjsLib;
  } catch (error) {
    console.error('Failed to load PDF.js:', error);
    throw new Error('خطا در بارگذاری PDF.js');
  }
}

export function isPdfJsLoaded(): boolean {
  return isInitialized && pdfjsLib !== null;
}
