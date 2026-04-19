'use client';

import { useState } from 'react';
import { useUploadThing } from '@/lib/uploadthing';

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  max?: number;
  label?: string;
}

export function ImageUpload({ value, onChange, max = 8, label = 'Images' }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { startUpload } = useUploadThing('adminImage', {
    onClientUploadComplete: (res) => {
      const urls = res.map((r) => r.ufsUrl);
      onChange([...value, ...urls].slice(0, max));
      setUploading(false);
      setError(null);
    },
    onUploadError: (err) => {
      setError(err.message);
      setUploading(false);
    },
  });

  function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const slots = max - value.length;
    if (slots <= 0) return;
    setError(null);
    setUploading(true);
    void startUpload(Array.from(files).slice(0, slots));
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold tracking-widest uppercase text-grey-medium">
        {label} <span className="font-normal lowercase tracking-normal text-grey-medium/60">({value.length}/{max})</span>
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {value.map((url, i) => (
          <div key={url + i} className="relative aspect-square rounded-xl overflow-hidden group" style={{ background: '#f5f0eb' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              ×
            </button>
            {i === 0 && (
              <span className="absolute bottom-1 left-1 text-[8px] tracking-widest font-bold uppercase px-1.5 py-0.5 rounded bg-burgundy text-white">
                Cover
              </span>
            )}
          </div>
        ))}

        {value.length < max && (
          <label
            className="aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center text-xs cursor-pointer transition-all hover:border-burgundy hover:bg-burgundy/5"
            style={{ borderColor: 'rgba(128,0,32,0.2)', color: '#9a9a9a' }}
          >
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => handleFiles(e.target.files)}
            />
            {uploading ? (
              <span className="text-burgundy text-[10px] font-bold animate-pulse">Uploading…</span>
            ) : (
              <>
                <span className="text-2xl mb-1">+</span>
                <span className="text-[10px] font-semibold tracking-wide uppercase">Add</span>
              </>
            )}
          </label>
        )}
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
