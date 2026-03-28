"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Upload, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

const FileUpload = ({ onFileSelect = () => {}, loading = false, preview = null, accept = "image/*" }, ref) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClearPreview = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileSelect(null);
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative inline-block">
          <Image
            src={preview}
            alt="Preview"
            width={600}
            height={300}
            className="h-48 w-full max-w-md rounded-2xl border border-border-color object-cover shadow-[var(--glass-shadow)]"
          />
          <button
            onClick={handleClearPreview}
            className="absolute right-2 top-2 rounded-full bg-red-500/90 p-2 text-white backdrop-blur-sm transition-colors hover:bg-red-600"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "glass-card rounded-2xl border-2 border-dashed p-8 text-center transition-all",
            isDragging && "border-[var(--primary)] bg-[var(--surface-strong)]"
          )}
        >
          <div className="flex flex-col items-center gap-3">
            <div className="clay-card rounded-full p-3">
              <Upload className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Drag and drop your image here</p>
              <p className="text-sm text-muted-ink">or click to browse from your computer</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileChange}
              onClick={(e) => {
                e.currentTarget.value = "";
              }}
              className="hidden"
            />
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              variant="outline"
            >
              {loading ? "Uploading..." : "Choose File"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

FileUpload.displayName = "FileUpload";

export { FileUpload };
