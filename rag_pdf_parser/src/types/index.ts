export interface PDF {
  id: string;
  name: string;
  file: File;
  session_id: string;
  upload_timestamp: string;
}

export interface FileMetadata {
  filename: string;
  upload_timestamp: string;
  session_id: string;
}

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
} 