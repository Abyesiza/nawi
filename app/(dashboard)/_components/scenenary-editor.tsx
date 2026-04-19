'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUpload } from './image-upload';

interface ScenenaryEditorProps {
  initial?: {
    id: string;
    title: string;
    category: string;
    description: string;
    features: string[];
    galleryUrls: string[];
    basePriceCents: number | null;
    isActive: boolean;
  };
  saveAction: (fd: FormData) => Promise<{ ok?: boolean; error?: string } | void>;
  onSaved?: () => void;
}

export function ScenenaryEditor({ initial, saveAction, onSaved }: ScenenaryEditorProps) {
  const router = useRouter();
  const [images, setImages] = useState<string[]>(initial?.galleryUrls ?? []);
  const [features, setFeatures] = useState((initial?.features ?? []).join('\n'));
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    fd.set('galleryUrls', images.join('\n'));
    fd.set('features', features);
    setError(null);
    startTransition(async () => {
      const res = await saveAction(fd);
      if (res && 'error' in res && res.error) {
        setError(res.error);
      } else {
        router.refresh();
        onSaved?.();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title" required>
          <input name="title" defaultValue={initial?.title} required
            placeholder="Forest Sanctuary"
            className="input" />
        </Field>
        <Field label="Category">
          <input name="category" defaultValue={initial?.category ?? 'BESPOKE'}
            placeholder="NATURE / FANTASY / SERENE…"
            className="input" />
        </Field>
      </div>

      <Field label="Description" required>
        <textarea name="description" defaultValue={initial?.description} required rows={3}
          placeholder="Shown on the public card and inside booking summaries."
          className="input" />
      </Field>

      <Field label="Features (one per line)">
        <textarea value={features} onChange={(e) => setFeatures(e.target.value)} rows={4}
          placeholder={'Forest-scented oils\nPetal pathway\nLive acoustic violin'}
          className="input" />
      </Field>

      <ImageUpload value={images} onChange={setImages} max={10} label="Gallery (first image becomes the cover)" />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Base price (USD)">
          <input name="basePriceCents" type="number" step="0.01"
            defaultValue={initial?.basePriceCents != null ? (initial.basePriceCents / 100).toFixed(2) : ''}
            placeholder="2400.00" className="input" />
        </Field>
        <Field label="Status">
          <select name="isActive" defaultValue={initial?.isActive === false ? 'false' : 'true'} className="input">
            <option value="true">Active (visible)</option>
            <option value="false">Hidden</option>
          </select>
        </Field>
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button type="submit" disabled={pending}
        className="w-full py-3 rounded-full font-bold text-white disabled:opacity-50 transition-all"
        style={{ background: '#800020' }}>
        {pending ? 'Saving…' : initial?.id ? 'Save changes' : 'Create experience'}
      </button>

      <style jsx>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.75rem;
          border: 1px solid rgba(128,0,32,0.1);
          background: white;
          font-size: 0.875rem;
          outline: none;
          transition: border-color 0.15s;
        }
        .input:focus { border-color: #800020; }
      `}</style>
    </form>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold tracking-widest uppercase mb-1.5" style={{ color: '#9a9a9a' }}>
        {label}{required && <span className="text-burgundy"> *</span>}
      </span>
      {children}
    </label>
  );
}
