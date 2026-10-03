'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Upload, X, FileText } from 'lucide-react';
import { Spinner } from './spinner';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  preview?: string;
}

export interface FileUploaderProps {
  accept?: string;
  maxSize?: number;
  multiple?: boolean;
  onUpload: (files: UploadedFile[]) => void;
  label?: string;
  description?: string;
  className?: string;
  disabled?: boolean;
  files?: UploadedFile[];
  onRemove?: (fileId: string) => void;
  isUploading?: boolean;
  dropZoneClassName?: string;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function getFileExtension(filename: string): string {
  const ext = filename.split('.').pop();
  return ext ? ext.toUpperCase() : 'FILE';
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  accept,
  maxSize,
  multiple = false,
  onUpload,
  label = 'آپلود فایل',
  description = 'فایل‌ها را اینجا بکشید و رها کنید یا کلیک کنید',
  className,
  disabled = false,
  files: externalFiles,
  onRemove,
  isUploading = false,
  dropZoneClassName,
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [internalFiles, setInternalFiles] = React.useState<UploadedFile[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const files = externalFiles !== undefined ? externalFiles : internalFiles;

  const handleFiles = React.useCallback(
    (fileList: FileList | File[]) => {
      setError(null);
      const newFiles: UploadedFile[] = [];

      const arr = Array.from(fileList) as File[];
      for (let i = 0; i < arr.length; i++) {
        const file = arr[i];
        if (!file) continue;

        if (maxSize && file.size > maxSize) {
          setError(`حجم فایل ${file.name} بیشتر از حد مجاز است`);
          continue;
        }

        newFiles.push({
          id: `${Date.now()}-${i}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          size: file.size,
          type: file.type,
          preview: file.type.startsWith('image/')
            ? URL.createObjectURL(file)
            : undefined,
        });
      }

      if (newFiles.length === 0) return;

      const updatedFiles = multiple
        ? [...files, ...newFiles]
        : newFiles.slice(0, 1);

      if (externalFiles === undefined) {
        setInternalFiles(updatedFiles);
      }
      onUpload(updatedFiles);
    },
    [files, maxSize, multiple, onUpload, externalFiles]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || isUploading) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleClick = () => {
    if (disabled || isUploading) return;
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
    e.target.value = '';
  };

  const handleRemove = (fileId: string) => {
    const fileToRemove = files.find((f) => f.id === fileId);
    if (fileToRemove?.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    const updatedFiles = files.filter((f) => f.id !== fileId);
    if (externalFiles === undefined) {
      setInternalFiles(updatedFiles);
    }
    onRemove?.(fileId);
    onUpload(updatedFiles);
  };

  return (
    <div className={cn('w-full', className)}>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
            handleClick();
          }
        }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
          isDragging &&
            'border-primary bg-primary/5 scale-[1.01]',
          !isDragging &&
            !disabled &&
            'border-border hover:border-primary/50 hover:bg-bg',
          (disabled || isUploading) &&
            'cursor-not-allowed opacity-60',
          dropZoneClassName
        )}
        aria-disabled={disabled}
      >
        {isUploading ? (
          <div className="flex flex-col items-center gap-3">
            <Spinner size="lg" className="text-primary" />
            <p className="text-sm font-medium text-text-muted">در حال آپلود...</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Upload className="h-7 w-7" />
            </div>
            <p className="mb-1.5 text-base font-semibold text-text">{label}</p>
            <p className="text-sm text-text-muted">{description}</p>
            {maxSize && (
              <p className="mt-2 text-xs text-text-muted">
                حداکثر حجم: {formatFileSize(maxSize)}
              </p>
            )}
            {accept && (
              <p className="mt-1 text-xs text-text-muted">
                فرمت‌های مجاز: {accept}
              </p>
            )}
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {error && (
        <p className="mt-2 text-xs text-danger">{error}</p>
      )}

      {files.length > 0 && (
        <div className="mt-4 space-y-2">
          {files.map((file) => (
            <div
              key={file.id}
              className="flex items-center gap-3 rounded-xl border border-border bg-white p-3"
            >
              {file.preview ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="h-12 w-12 shrink-0 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-bg">
                  <FileText className="h-6 w-6 text-text-muted" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-text">
                  {file.name}
                </p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-text-muted">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>{getFileExtension(file.name)}</span>
                </div>
              </div>
              {!disabled && !isUploading && (
                <button
                  type="button"
                  onClick={() => handleRemove(file.id)}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-danger/10 hover:text-danger"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
