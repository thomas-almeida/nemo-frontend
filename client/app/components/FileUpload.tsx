'use client';

import { useState, useCallback } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  label: string;
  accept?: string;
  onFileSelect: (file: File | null) => void;
  className?: string;
}

export default function FileUpload({ label, accept = '*', onFileSelect, className = '' }: FileUploadProps) {
  const [fileName, setFileName] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
      onFileSelect(selectedFile);
    }
  }, [onFileSelect]);

  const handleRemove = useCallback(() => {
    setFile(null);
    setFileName('');
    onFileSelect(null);
    // Reset the file input
    const fileInput = document.getElementById(`file-upload-${label}`) as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }, [label, onFileSelect]);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <label className="text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <label
          htmlFor={`file-upload-${label}`}
          className="flex-1 cursor-pointer border border-dashed rounded-md p-4 flex flex-col items-center justify-center hover:bg-slate-50 transition-colors"
        >
          <Upload className="h-5 w-5 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground text-center">
            {fileName || 'Clique para fazer upload ou arraste o arquivo'}
          </span>
          <input
            id={`file-upload-${label}`}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleFileChange}
          />
        </label>
        {file && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-destructive hover:bg-destructive/10"
            onClick={handleRemove}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {file && (
        <div className="text-xs text-muted-foreground mt-1">
          Tamanho: {(file.size / 1024).toFixed(2)} KB
        </div>
      )}
    </div>
  );
}
