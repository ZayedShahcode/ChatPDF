import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import NavBar from './components/NavBar';
import ChatInterface from './components/ChatInterface';
import type { PDF } from './types';
import { APIService } from './services/api';
import './index.css';

function App() {
  const [uploadedPDFs, setUploadedPDFs] = useState<PDF[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<PDF | null>(null);

  useEffect(() => {
    loadExistingFiles();
  }, []);

  const loadExistingFiles = async () => {
    try {
      const response = await APIService.listFiles();
      const pdfs: PDF[] = response.files.map(file => ({
        id: file.filename,
        name: file.filename,
        file: new File([], file.filename),
        session_id: file.session_id,
        upload_timestamp: file.upload_timestamp
      }));
      setUploadedPDFs(pdfs);
    } catch (error) {
      console.error('Failed to load files:', error);
      toast.error('Failed to load existing files');
    }
  };

  const handlePDFUpload = async (file: File) => {
    try {
      const response = await APIService.uploadPDF(file);
      
      const newPDF: PDF = {
        id: response.filename,
        name: response.filename,
        file: file,
        session_id: response.session_id,
        upload_timestamp: new Date().toISOString()
      };
      
      setUploadedPDFs(prev => [...prev, newPDF]);
      setSelectedPDF(newPDF);
      
      toast.success(response.message);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload PDF. Please try again.');
    }
  };

  const handlePDFSelect = (pdf: PDF) => {
    setSelectedPDF(pdf);
  };

  const handlePDFDelete = async (pdfId: string) => {
    try {
      const pdfToDelete = uploadedPDFs.find(pdf => pdf.id === pdfId);
      if (!pdfToDelete) return;

      await APIService.deleteFile(pdfToDelete.name);
      
      setUploadedPDFs(prev => prev.filter(pdf => pdf.id !== pdfId));
      
      if (selectedPDF?.id === pdfId) {
        setSelectedPDF(null);
      }

      toast.success('PDF deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete PDF');
    }
  };

  const handleSessionDelete = async (sessionId: string) => {
    try {
      await APIService.deleteSession(sessionId);
      
      setUploadedPDFs(prev => prev.filter(pdf => pdf.session_id !== sessionId));
      
      if (selectedPDF?.session_id === sessionId) {
        setSelectedPDF(null);
      }

      toast.success('Session deleted successfully');
    } catch (error) {
      console.error('Session delete error:', error);
      toast.error('Failed to delete session');
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    if (!selectedPDF) {
      throw new Error('No PDF selected');
    }
    
    try {
      const response = await APIService.askQuestion(selectedPDF.name, message);
      return response.answer;
    } catch (error) {
      console.error('Question error:', error);
      throw new Error('Failed to get answer from the PDF. Please try again.');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <NavBar
        uploadedPDFs={uploadedPDFs}
        selectedPDF={selectedPDF}
        onPDFUpload={handlePDFUpload}
        onPDFSelect={handlePDFSelect}
        onPDFDelete={handlePDFDelete}
        onSessionDelete={handleSessionDelete}
      />
      
      <div className="flex-1 overflow-hidden">
        <ChatInterface
          selectedPDF={selectedPDF}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
}

export default App;
