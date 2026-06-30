'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import type { ImageUploadProps } from './ImageUpload.types';

export function ImageUpload({
  value,
  onChange,
  label,
  disabled,
  className,
  aspectRatio = 'wide',
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const heightClass = aspectRatio === 'square' ? 'h-32 w-32' : 'h-36 w-full';

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/cloudinary/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Error al subir la imagen');

      const data = (await res.json()) as { url: string };
      onChange(data.url);
    } catch {
      setError('No se pudo subir la imagen. Intentá de nuevo.');
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  return (
    <div className={cn('space-y-1', className)}>
      {label && <p className="text-sm font-medium text-gray-700">{label}</p>}

      {value ? (
        <div className={cn('relative overflow-hidden rounded-lg border border-gray-200', heightClass)}>
          <Image src={value} alt="Imagen subida" fill className="object-cover" />
          {!disabled && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 shadow-sm transition-colors hover:bg-white"
              aria-label="Eliminar imagen"
            >
              <X className="h-3.5 w-3.5 text-gray-700" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className={cn(
            'flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-orange-400 hover:bg-orange-50',
            heightClass,
            (disabled || uploading) && 'cursor-not-allowed opacity-60'
          )}
        >
          {uploading ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          ) : (
            <Upload className="h-5 w-5 text-gray-400" />
          )}
          <span className="text-xs text-gray-500">
            {uploading ? 'Subiendo...' : 'Clic para subir imagen'}
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled || uploading}
      />

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
