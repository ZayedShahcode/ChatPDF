import React, { useRef } from 'react';
import { FiUpload, FiTrash2, FiChevronDown, FiFolder } from 'react-icons/fi';
import toast from 'react-hot-toast';
import type { PDF } from '../types';
import type { NavBarProps } from './types';

const NavBar: React.FC<NavBarProps> = ({
  uploadedPDFs,
  selectedPDF,
  onPDFUpload,
  onPDFSelect,
  onPDFDelete,
  onSessionDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sessionDropdownOpen, setSessionDropdownOpen] = React.useState(false);

  const pdfsBySession = uploadedPDFs.reduce((acc, pdf) => {
    if (!acc[pdf.session_id]) {
      acc[pdf.session_id] = [];
    }
    acc[pdf.session_id].push(pdf);
    return acc;
  }, {} as Record<string, PDF[]>);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file only!');
        return;
      }
      
      try {
        await onPDFUpload(file);
      } catch (error) {
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handlePDFDelete = async (e: React.MouseEvent, pdfId: string) => {
    e.stopPropagation();
    await onPDFDelete(pdfId);
  };

  const handleSessionDelete = async (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    await onSessionDelete(sessionId);
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Chat<span className="text-blue-600">PDF</span>
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          {Object.keys(pdfsBySession).length > 0 && (
            <div className="relative">
              <button
                onClick={() => setSessionDropdownOpen(!sessionDropdownOpen)}
                className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-200 transition-colors cursor-pointer"
              >
                <FiFolder className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">
                  Sessions
                </span>
                <FiChevronDown className="h-4 w-4 text-gray-500" />
              </button>

              {sessionDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  <div className="py-2">
                    {Object.entries(pdfsBySession).map(([sessionId, pdfs]) => (
                      <div key={sessionId} className="border-b border-gray-100 last:border-0">
                        <div className="px-4 py-2 bg-gray-50 flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">
                            Session {sessionId.slice(0, 8)}...
                          </span>
                          <button
                            onClick={(e) => handleSessionDelete(e, sessionId)}
                            className="p-1 hover:bg-red-100 rounded-full transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                          </button>
                        </div>
                        {pdfs.map((pdf) => (
                          <div
                            key={pdf.id}
                            className={`flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer ${
                              selectedPDF?.id === pdf.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                            }`}
                            onClick={() => {
                              onPDFSelect(pdf);
                              setSessionDropdownOpen(false);
                            }}
                          >
                            <span className="text-sm font-medium truncate flex-1 mr-2">
                              {pdf.name}
                            </span>
                            <button
                              onClick={(e) => handlePDFDelete(e, pdf.id)}
                              className="p-1 hover:bg-red-100 rounded-full transition-colors cursor-pointer"
                            >
                              <FiTrash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={handleUploadClick}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors cursor-pointer"
          >
            <FiUpload className="h-4 w-4" />
            <span>Upload PDF</span>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>
    </nav>
  );
};

export default NavBar; 