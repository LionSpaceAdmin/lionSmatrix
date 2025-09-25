"use client";

import { useState, useCallback, DragEvent } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export function ImageLabClient() {
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleFiles = (newFiles: FileList | null) => {
    if (newFiles) {
      const acceptedFiles = Array.from(newFiles).filter(file => file.type.startsWith('image/'));
      setFiles(acceptedFiles);
      // Clean up old object URLs to prevent memory leaks
      previews.forEach(url => URL.revokeObjectURL(url));
      const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
      setPreviews(newPreviews);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                    ${isDragActive ? 'border-primary bg-primary/10' : 'border-border'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center h-full">
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </label>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Image Previews</h3>
        {previews.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative aspect-square">
                <Image
                  src={preview}
                  alt={`Preview ${index}`}
                  fill
                  className="object-cover rounded-md"
                  onLoad={() => URL.revokeObjectURL(preview)} // Clean up after image is loaded
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full border rounded-lg bg-muted/50">
            <p className="text-muted-foreground">No images uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
