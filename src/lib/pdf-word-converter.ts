// PDF to Word conversions
export { 
  pdfToWord, 
  pdfToWordWithOptions, 
  validatePdfFileForWord, 
  fileToBuffer as pdfFileToBuffer,
  type PDFToWordResult 
} from './pdf-to-word';

// Word to PDF conversions
export { 
  wordToPdf, 
  wordToPdfWithOptions, 
  validateWordFile, 
  fileToBuffer as wordFileToBuffer,
  type WordToPdfResult 
} from './word-to-pdf';
