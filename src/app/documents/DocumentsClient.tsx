'use client';

import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import documentsData from '@/data/documents.json';
import { isAuthenticated, authenticate } from '@/lib/auth';

type Document = {
  id: number | string;
  title: string;
  date: string;
  year: number;
  file: string;
  uploaded?: boolean;
};

type Category = {
  id: string;
  name: string;
  documents: Document[];
};

const YEAR_FILTERS = ['All', '2026', '2025', '2024', 'Older'];

const CATEGORY_OPTIONS = [
  { id: 'minutes', name: 'Meeting Minutes' },
  { id: 'agendas', name: 'Agendas' },
  { id: 'governing', name: 'Governing Documents' },
  { id: 'airport-rules', name: 'Airport & Pilot Rules' },
  { id: 'insurance', name: 'Insurance Documents' },
  { id: 'forms', name: 'Forms' },
];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function DocumentsClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeYear, setActiveYear] = useState('All');
  const [search, setSearch] = useState('');
  const [authenticated, setAuthenticatedState] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Upload form state
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('minutes');
  const [uploadDate, setUploadDate] = useState(new Date().toISOString().slice(0, 10));
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Uploaded documents from API
  const [uploadedDocs, setUploadedDocs] = useState<
    { id: string; title: string; date: string; year: number; categoryId: string; file: string; pathname: string }[]
  >([]);

  const fetchUploaded = useCallback(async () => {
    try {
      const res = await fetch('/api/documents');
      if (res.ok) {
        const data = await res.json();
        setUploadedDocs(data.documents || []);
      }
    } catch { /* API not available yet */ }
  }, []);

  useEffect(() => {
    if (isAuthenticated()) setAuthenticatedState(true);
    fetchUploaded();
  }, [fetchUploaded]);

  // Merge static + uploaded documents into the categories
  const categories: Category[] = useMemo(() => {
    const staticCats: Category[] = documentsData.categories.map(cat => ({
      ...cat,
      documents: cat.documents.map(d => ({ ...d, uploaded: false })),
    }));

    // Add uploaded docs into the right categories
    for (const doc of uploadedDocs) {
      const cat = staticCats.find(c => c.id === doc.categoryId);
      if (cat) {
        cat.documents.push({
          id: doc.id,
          title: doc.title,
          date: doc.date,
          year: doc.year,
          file: doc.file,
          uploaded: true,
        });
      }
    }

    // Sort each category's documents by date, newest first
    for (const cat of staticCats) {
      cat.documents.sort((a, b) => b.date.localeCompare(a.date));
    }

    return staticCats;
  }, [uploadedDocs]);

  const filteredDocs = useMemo(() => {
    const allDocs = categories.flatMap((cat) =>
      cat.documents.map((doc) => ({ ...doc, categoryId: cat.id, categoryName: cat.name }))
    );

    return allDocs.filter((doc) => {
      const matchesCategory = activeCategory === 'all' || doc.categoryId === activeCategory;
      const matchesYear =
        activeYear === 'All'
          ? true
          : activeYear === 'Older'
          ? doc.year < 2024
          : doc.year === parseInt(activeYear);
      const matchesSearch = search.trim() === '' || doc.title.toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesYear && matchesSearch;
    });
  }, [activeCategory, activeYear, search, categories]);

  const groupedByCategory = useMemo(() => {
    if (activeCategory !== 'all') {
      return categories
        .filter((c) => c.id === activeCategory)
        .map((cat) => ({
          ...cat,
          documents: filteredDocs.filter((d) => (d as any).categoryId === cat.id),
        }))
        .filter((cat) => cat.documents.length > 0);
    }

    return categories
      .map((cat) => ({
        ...cat,
        documents: filteredDocs.filter((d) => (d as any).categoryId === cat.id),
      }))
      .filter((cat) => cat.documents.length > 0);
  }, [filteredDocs, activeCategory, categories]);

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!uploadFile || !uploadTitle.trim()) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('title', uploadTitle.trim());
      formData.append('categoryId', uploadCategory);
      formData.append('date', uploadDate);

      const res = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload failed');
      }

      const doc = await res.json();
      setUploadedDocs(prev => [doc, ...prev]);
      setUploadTitle('');
      setUploadFile(null);
      setUploadDate(new Date().toISOString().slice(0, 10));
      setShowUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(docId: string) {
    if (!confirm('Delete this uploaded document?')) return;
    setDeleting(docId);
    try {
      const res = await fetch('/api/documents', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: docId }),
      });
      if (res.ok) {
        setUploadedDocs(prev => prev.filter(d => d.id !== docId));
      }
    } catch {
      alert('Failed to delete document.');
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="py-10 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Row */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
          {/* Search + Upload button */}
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative max-w-md flex-1">
              <svg
                className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search documents..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
              />
            </div>
            {authenticated && (
              <button
                onClick={() => setShowUpload(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-sm font-medium transition-opacity hover:opacity-90 shrink-0"
                style={{ backgroundColor: '#4A90D9' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                {showUpload ? 'Cancel' : 'Upload Document'}
              </button>
            )}
          </div>

          {/* Upload Form */}
          {showUpload && authenticated && (
            <form onSubmit={handleUpload} className="bg-white rounded-xl border border-blue-200 p-5 mb-5 space-y-4">
              <h3 className="text-sm font-semibold text-gray-700">Upload New Document</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Document Title *</label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={e => setUploadTitle(e.target.value)}
                    placeholder="e.g. Board Meeting Minutes"
                    required
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
                  <select
                    value={uploadCategory}
                    onChange={e => setUploadCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
                  <input
                    type="date"
                    value={uploadDate}
                    onChange={e => setUploadDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">PDF File *</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={e => setUploadFile(e.target.files?.[0] || null)}
                    required
                    className="w-full text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={uploading || !uploadFile || !uploadTitle.trim()}
                  className="px-5 py-2 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50 flex items-center gap-2"
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
                    'Upload'
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowUpload(false)}
                  className="px-5 py-2 rounded-xl text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Category Tabs */}
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === 'all'
                    ? 'text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                }`}
                style={activeCategory === 'all' ? { backgroundColor: '#1B3A5C' } : {}}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === cat.id
                      ? 'text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                  style={activeCategory === cat.id ? { backgroundColor: '#1B3A5C' } : {}}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Year Filter */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Year</p>
            <div className="flex flex-wrap gap-2">
              {YEAR_FILTERS.map((year) => (
                <button
                  key={year}
                  onClick={() => setActiveYear(year)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    activeYear === year
                      ? 'text-white'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600'
                  }`}
                  style={activeYear === year ? { backgroundColor: '#4A90D9' } : {}}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-gray-500 mb-6">
          Showing <span className="font-semibold text-gray-800">{filteredDocs.length}</span> document{filteredDocs.length !== 1 ? 's' : ''}
        </p>

        {/* Document List */}
        {groupedByCategory.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="font-medium text-gray-500">No documents found</p>
            <p className="text-sm mt-1">Try adjusting your filters or search term.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {groupedByCategory.map((cat) => (
              <div key={cat.id}>
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span
                    className="w-2 h-6 rounded-full inline-block"
                    style={{ backgroundColor: '#4A90D9' }}
                  />
                  {cat.name}
                </h2>
                <div className="space-y-2">
                  {cat.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-4 p-4 bg-white hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-colors group"
                    >
                      <a
                        href={doc.file}
                        download
                        className="flex items-center gap-4 flex-1 min-w-0"
                      >
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: '#1B3A5C' }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                            {doc.title}
                          </p>
                          <p className="text-gray-400 text-xs mt-0.5">{formatDate(doc.date)} · PDF</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs text-gray-400 hidden sm:block">Download</span>
                          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </div>
                      </a>
                      {/* Delete button for uploaded docs */}
                      {authenticated && doc.uploaded && (
                        <button
                          onClick={() => handleDelete(String(doc.id))}
                          disabled={deleting === String(doc.id)}
                          className="px-3 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 shrink-0"
                          title="Delete uploaded document"
                        >
                          {deleting === String(doc.id) ? '...' : 'Delete'}
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
