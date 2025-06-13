const API_BASE_URL = 'http://localhost:8000';

export interface UploadResponse {
  message: string;
  filename: string;
  session_id: string;
  status: string;
}

export interface AskResponse {
  answer: string;
  filename: string;
  question: string;
  status: string;
}

export interface FileMetadata {
  filename: string;
  upload_timestamp: string;
  session_id: string;
}

export interface FilesResponse {
  files: FileMetadata[];
  status: string;
}

export class APIService {
  static async testCORS(): Promise<any> {
    try {
      console.log('Testing CORS...');
      const response = await fetch(`${API_BASE_URL}/test-cors`, {
        method: 'GET',
      });
      console.log('CORS test response:', response.status, response.statusText);
      return await response.json();
    } catch (error) {
      console.error('CORS test failed:', error);
      throw error;
    }
  }

  static async uploadPDF(file: File): Promise<UploadResponse> {
    try {
      console.log('Uploading file:', file.name);
      
      const formData = new FormData();
      formData.append('file', file);

      console.log('Making upload request...');
      const response = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      console.log('Upload response status:', response.status);
      console.log('Upload response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Upload error response:', errorText);
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Upload success:', result);
      return result;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }

  static async askQuestion(filename: string, question: string): Promise<AskResponse> {
    try {
      console.log('Asking question:', { filename, question });
      
      const formData = new FormData();
      formData.append('filename', filename);
      formData.append('question', question);

      console.log('Making ask request...');
      const response = await fetch(`${API_BASE_URL}/ask`, {
        method: 'POST',
        body: formData,
        mode: 'cors',
      });

      console.log('Ask response status:', response.status);
      console.log('Ask response headers:', [...response.headers.entries()]);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ask error response:', errorText);
        throw new Error(`Question failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const result = await response.json();
      console.log('Ask success:', result);
      return result;
    } catch (error) {
      console.error('Ask error:', error);
      throw error;
    }
  }

  static async listFiles(): Promise<FilesResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/files`, {
        method: 'GET',
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to list files: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('List files error:', error);
      throw error;
    }
  }

  static async deleteFile(filename: string): Promise<{ message: string; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/files/${filename}`, {
        method: 'DELETE',
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete file: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  }

  static async deleteSession(sessionId: string): Promise<{ message: string; status: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/session/${sessionId}`, {
        method: 'DELETE',
        mode: 'cors',
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete session: ${response.status} ${response.statusText} - ${errorText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Delete session error:', error);
      throw error;
    }
  }
}

(window as any).testAPI = async () => {
  try {
    console.log('=== API Debug Test ===');
    await APIService.testCORS();
    console.log('CORS test passed!');
  } catch (error) {
    console.error('API test failed:', error);
  }
};