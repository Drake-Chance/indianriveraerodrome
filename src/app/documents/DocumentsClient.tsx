'use client';

import { useState, useMemo } from 'react';
import documentsData from '@/data/documents.json';

type Document = {
  id: number;
  title: string;
  date: string;
  year: number;
  file: string;
};

type Category = {
  id: string;
  name: string;
  documents: Document[];
};

const YEAR_FILTERS = ['All', '2026', '2025', '2024', 'Older'];

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function DocumentsClient() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeYear, setActiveYear] = useState('All');
  const [search, setSearch] = useState('');

  const categories: Category[] = documentsData.categories;

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

  return (
    <div className="py-10 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filters Row */}
        <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100">
          {/* Search */}
          <div className="mb-5">
            <div className="relative max-w-md">
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
          </div>

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
                    <a
                      key={doc.id}
                      href={doc.file}
                      download
                      className="flex items-center gap-4 p-4 bg-white hover:bg-blue-50 border border-gray-100 hover:border-blue-200 rounded-xl transition-colors group"
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
