'use client';

import { useState, useRef, useEffect } from 'react';

const PASSWORD = 'iraopa2026';
const STORAGE_KEY = 'irapoa_gallery_v2';

type GalleryImage = {
  id: string;
  src: string;
  caption: string;
  uploadedAt: number;
};

export default function GalleryPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [pendingCaption, setPendingCaption] = useState('');
  const [pendingFile, setPendingFile] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try { setImages(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  function save(updated: GalleryImage[]) {
    setImages(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === PASSWORD) {
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Please try again.');
      setInput('');
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPendingFile(ev.target?.result as string);
      setPendingCaption('');
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  function handleAddImage() {
    if (!pendingFile) return;
    const newImage: GalleryImage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      src: pendingFile,
      caption: pendingCaption.trim(),
      uploadedAt: Date.now(),
    };
    save([newImage, ...images]);
    setPendingFile(null);
    setPendingCaption('');
  }

  function handleDelete(id: string) {
    save(images.filter(img => img.id !== id));
    if (lightbox?.id === id) setLightbox(null);
  }

  return (
    <>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-300 text-sm">Home</span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-100 text-sm">Gallery</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Community Gallery</h1>
          <p className="text-blue-200 text-lg">Photos shared by IRAPOA residents — members only</p>
        </div>
      </section>

      <div className="py-14" style={{ backgroundColor: '#F5F5F0' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {!authenticated ? (
            /* Password Gate */
            <div className="flex items-center justify-center min-h-[50vh]">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 w-full max-w-md">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5"
                  style={{ backgroundColor: '#EFF6FF' }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="#1B3A5C" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Members Only</h2>
                <p className="text-gray-500 text-sm text-center mb-6">
                  Enter the community password to access the gallery.
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      Community Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      autoComplete="current-password"
                      placeholder="Enter password"
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                      style={{ '--tw-ring-color': '#4A90D9' } as React.CSSProperties}
                    />
                    {error && (
                      <p className="mt-1.5 text-sm text-red-500">{error}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl text-white font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#1B3A5C' }}
                  >
                    View Gallery
                  </button>
                </form>
                <p className="mt-4 text-xs text-gray-400 text-center">
                  Contact the board at{' '}
                  <a href="mailto:contact@indianriveraerodrome.com" className="underline" style={{ color: '#4A90D9' }}>
                    contact@indianriveraerodrome.com
                  </a>{' '}
                  if you need access.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Toolbar */}
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm text-gray-500">
                  {images.length} {images.length === 1 ? 'photo' : 'photos'}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#4A90D9' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={() => setAuthenticated(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                  >
                    Lock gallery
                  </button>
                </div>
              </div>

              {/* Upload preview / caption form */}
              {pendingFile && (
                <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 flex flex-col sm:flex-row gap-6 items-start">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={pendingFile}
                    alt="Preview"
                    className="w-full sm:w-48 h-48 object-cover rounded-xl"
                  />
                  <div className="flex-1 flex flex-col gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Caption (optional)</label>
                      <input
                        type="text"
                        value={pendingCaption}
                        onChange={e => setPendingCaption(e.target.value)}
                        placeholder="Add a caption..."
                        maxLength={120}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleAddImage}
                        className="px-5 py-2 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: '#1B3A5C' }}
                      >
                        Add to Gallery
                      </button>
                      <button
                        onClick={() => { setPendingFile(null); setPendingCaption(''); }}
                        className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Gallery Grid */}
              {images.length === 0 && !pendingFile ? (
                <div className="text-center py-20 text-gray-400">
                  <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-sm">No photos yet. Be the first to share one!</p>
                </div>
              ) : (
                <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
                  {images.map(img => (
                    <div key={img.id} className="break-inside-avoid group relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt={img.caption || 'Community photo'}
                        className="w-full h-auto block"
                        onClick={() => setLightbox(img)}
                      />
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex flex-col justify-end pointer-events-none">
                        {img.caption && (
                          <p className="px-3 pb-3 pt-6 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                            {img.caption}
                          </p>
                        )}
                      </div>
                      {/* Delete button */}
                      <button
                        onClick={() => handleDelete(img.id)}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto"
                        title="Delete photo"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={e => e.stopPropagation()}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={lightbox.src}
              alt={lightbox.caption || 'Community photo'}
              className="w-full h-auto max-h-[80vh] object-contain rounded-xl"
            />
            {lightbox.caption && (
              <p className="mt-3 text-center text-white text-sm">{lightbox.caption}</p>
            )}
            <button
              onClick={() => setLightbox(null)}
              className="absolute -top-3 -right-3 w-9 h-9 rounded-full bg-white text-gray-900 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
              title="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
