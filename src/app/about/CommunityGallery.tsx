'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { isAuthenticated, authenticate, clearAuth } from '@/lib/auth';

type GalleryImage = {
  url: string;
  pathname: string;
  caption: string;
  uploadedAt: number;
};

export default function CommunityGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [pendingCaption, setPendingCaption] = useState('');
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingPreview, setPendingPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/gallery');
      const data = await res.json();
      setImages(data.images || []);
    } catch {
      // Gallery API not available (no blob store configured yet)
      setImages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) setAuthenticated(true);
    fetchImages();
  }, [fetchImages]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (authenticate(input)) {
      setAuthenticated(true);
      setShowLogin(false);
      setError('');
      setInput('');
    } else {
      setError('Incorrect password. Please try again.');
      setInput('');
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4.5 * 1024 * 1024) {
      alert('File is too large. Maximum size is 4.5MB.');
      return;
    }
    setPendingFile(file);
    setPendingCaption('');
    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPendingPreview(url);
    e.target.value = '';
  }

  async function handleAddImage() {
    if (!pendingFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', pendingFile);
      formData.append('caption', pendingCaption.trim());

      const res = await fetch('/api/gallery', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      const uploaded = await res.json();
      setImages(prev => [{
        url: uploaded.url,
        pathname: uploaded.pathname,
        caption: uploaded.caption,
        uploadedAt: uploaded.uploadedAt,
      }, ...prev]);

      setPendingFile(null);
      if (pendingPreview) URL.revokeObjectURL(pendingPreview);
      setPendingPreview(null);
      setPendingCaption('');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(pathname: string) {
    setDeleting(pathname);
    try {
      const res = await fetch('/api/gallery/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathname }),
      });
      if (res.ok) {
        setImages(prev => prev.filter(img => img.pathname !== pathname));
        if (lightbox?.pathname === pathname) setLightbox(null);
      }
    } catch {
      alert('Failed to delete photo.');
    } finally {
      setDeleting(null);
    }
  }

  function cancelPending() {
    setPendingFile(null);
    if (pendingPreview) URL.revokeObjectURL(pendingPreview);
    setPendingPreview(null);
    setPendingCaption('');
  }

  return (
    <section style={{ backgroundColor: '#F5F5F0' }} className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Community Gallery</h2>
            <p className="text-gray-500 mt-1">Photos shared by IRAPOA residents</p>
          </div>
          <div className="flex items-center gap-3">
            {authenticated ? (
              <>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
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
                  onClick={() => { clearAuth(); setAuthenticated(false); }}
                  className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                >
                  Lock
                </button>
              </>
            ) : (
              <button
                onClick={() => setShowLogin(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Community Login
              </button>
            )}
          </div>
        </div>

        {/* Login modal */}
        {showLogin && (
          <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => { setShowLogin(false); setError(''); setInput(''); }}
          >
            <div
              className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 w-full max-w-sm"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 mb-1">Community Login</h3>
              <p className="text-gray-500 text-sm mb-5">Enter the community password to upload and manage photos.</p>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label htmlFor="gallery-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    id="gallery-password"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    autoComplete="current-password"
                    placeholder="Enter community password"
                    autoFocus
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                    style={{ '--tw-ring-color': '#4A90D9' } as React.CSSProperties}
                  />
                  {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 rounded-xl text-white font-semibold transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#1B3A5C' }}
                  >
                    Log In
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowLogin(false); setError(''); setInput(''); }}
                    className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Upload preview / caption form */}
        {pendingPreview && (
          <div className="bg-white rounded-2xl shadow-sm border border-blue-200 p-6 flex flex-col sm:flex-row gap-6 items-start mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={pendingPreview}
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
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
                  style={{ backgroundColor: '#1B3A5C' }}
                >
                  {uploading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Uploading...
                    </>
                  ) : (
                    'Add to Gallery'
                  )}
                </button>
                <button
                  onClick={cancelPending}
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-8 h-8 mx-auto mb-3 animate-spin opacity-40" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Loading gallery...</p>
          </div>
        ) : images.length === 0 && !pendingPreview ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-sm">No photos yet. Log in to share the first one!</p>
          </div>
        ) : (
          <>
            {authenticated && (
              <p className="text-sm text-gray-500 mb-4">
                {images.length} {images.length === 1 ? 'photo' : 'photos'}
              </p>
            )}
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {images.map(img => (
                <div key={img.pathname} className="break-inside-avoid group relative rounded-xl overflow-hidden bg-gray-100 cursor-pointer">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.caption || 'Community photo'}
                    className="w-full h-auto block"
                    onClick={() => setLightbox(img)}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex flex-col justify-end pointer-events-none">
                    {img.caption && (
                      <p className="px-3 pb-3 pt-6 text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/60 to-transparent">
                        {img.caption}
                      </p>
                    )}
                  </div>
                  {authenticated && (
                    <button
                      onClick={() => handleDelete(img.pathname)}
                      disabled={deleting === img.pathname}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto disabled:opacity-50"
                      title="Delete photo"
                    >
                      {deleting === img.pathname ? (
                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
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
              src={lightbox.url}
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
    </section>
  );
}
