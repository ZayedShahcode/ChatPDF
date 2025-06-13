import type { PDF } from '../types';

export interface NavBarProps {
  uploadedPDFs: PDF[];
  selectedPDF: PDF | null;
  onPDFUpload: (file: File) => Promise<void>;
  onPDFSelect: (pdf: PDF) => void;
  onPDFDelete: (pdfId: string) => Promise<void>;
  onSessionDelete: (sessionId: string) => Promise<void>;
} 