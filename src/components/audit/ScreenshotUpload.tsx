import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ScreenshotUploadProps {
  screenshots: string[];
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
}

const ScreenshotUpload = ({ screenshots, onUpload, onRemove }: ScreenshotUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      onUpload(files);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-3">
      <label className="block text-label-base text-espresso-600">
        Supporting Screenshots
      </label>

      {/* Upload Zone */}
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`
          relative p-4 border-2 border-dashed rounded-lg cursor-pointer transition-all
          ${
            isDragging
              ? 'border-sage-500 bg-sage-50'
              : 'border-neutral-300 bg-neutral-50 hover:border-sage-400 hover:bg-sage-50/50'
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />

        <div className="flex items-center justify-center gap-3">
          <Upload className="h-5 w-5 text-neutral-400" />
          <div className="text-left">
            <p className="text-body-sm text-neutral-600 font-medium">
              Drop screenshots here or click to browse
            </p>
            <p className="text-body-xs text-neutral-500">
              PNG, JPG up to 10MB
            </p>
          </div>
        </div>
      </div>

      {/* Screenshot Preview Grid */}
      {screenshots.length > 0 && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          {screenshots.map((screenshot, index) => (
            <div
              key={index}
              className="relative group aspect-video bg-neutral-100 rounded-lg overflow-hidden border border-neutral-200"
            >
              <img
                src={screenshot}
                alt={`Screenshot ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  onClick={() => onRemove(index)}
                  className="p-2 bg-white rounded-lg hover:bg-neutral-100 transition-colors"
                  aria-label="Remove screenshot"
                >
                  <X className="h-5 w-5 text-neutral-700" />
                </button>
              </div>
              <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {screenshots.length === 0 && (
        <div className="flex items-center gap-2 text-body-xs text-neutral-500 mt-2">
          <ImageIcon className="h-4 w-4" />
          <span>No screenshots uploaded yet</span>
        </div>
      )}
    </div>
  );
};

export default ScreenshotUpload;
