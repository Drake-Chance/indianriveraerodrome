'use client';

import { useState, useMemo, useEffect } from 'react';
import directoryData from '@/data/directory.json';

const PASSWORD = 'iraopa2026';
const LS_KEY = 'irapoa_directory_edits';

type Resident = {
  id: number;
  name: string;
  email: string;
  role?: string;
};

type StoredEdits = {
  edits: Record<number, { name: string; email: string; role?: string }>;
  additions: Resident[];
  deletions: number[];
};

function loadEdits(): StoredEdits {
  if (typeof window === 'undefined') return { edits: {}, additions: [], deletions: [] };
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return { edits: {}, additions: [], deletions: [] };
    return JSON.parse(raw);
  } catch {
    return { edits: {}, additions: [], deletions: [] };
  }
}

function saveEdits(data: StoredEdits) {
  localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export default function DirectoryPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [search, setSearch] = useState('');

  // Editing state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '' });
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  // localStorage overlay
  const [stored, setStored] = useState<StoredEdits>({ edits: {}, additions: [], deletions: [] });

  useEffect(() => {
    setStored(loadEdits());
  }, []);

  const baseResidents: Resident[] = directoryData.residents;

  const residents = useMemo<Resident[]>(() => {
    const deletionSet = new Set(stored.deletions);
    const merged = baseResidents
      .filter(r => !deletionSet.has(r.id))
      .map(r => {
        const override = stored.edits[r.id];
        return override ? { ...r, ...override } : r;
      });
    return [...merged, ...stored.additions];
  }, [stored, baseResidents]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return residents;
    return residents.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      (r.role ?? '').toLowerCase().includes(q)
    );
  }, [search, residents]);

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

  // Edit
  function startEdit(r: Resident) {
    setEditingId(r.id);
    setEditForm({ name: r.name, email: r.email });
    setShowAddForm(false);
    setDeleteConfirmId(null);
  }

  function saveEdit(id: number) {
    const updated: StoredEdits = {
      ...stored,
      edits: {
        ...stored.edits,
        [id]: {
          ...(stored.edits[id] ?? {}),
          name: editForm.name.trim(),
          email: editForm.email.trim(),
        },
      },
    };
    // If it's an addition, update in-place
    const isAddition = stored.additions.some(a => a.id === id);
    if (isAddition) {
      updated.additions = stored.additions.map(a =>
        a.id === id ? { ...a, name: editForm.name.trim(), email: editForm.email.trim() } : a
      );
      delete updated.edits[id];
    }
    setStored(updated);
    saveEdits(updated);
    setEditingId(null);
  }

  // Add
  function saveAdd() {
    if (!addForm.name.trim() || !addForm.email.trim()) return;
    const newId = Date.now();
    const newResident: Resident = {
      id: newId,
      name: addForm.name.trim(),
      email: addForm.email.trim(),
    };
    const updated: StoredEdits = {
      ...stored,
      additions: [...stored.additions, newResident],
    };
    setStored(updated);
    saveEdits(updated);
    setAddForm({ name: '', email: '' });
    setShowAddForm(false);
  }

  // Delete
  function confirmDelete(id: number) {
    const isAddition = stored.additions.some(a => a.id === id);
    let updated: StoredEdits;
    if (isAddition) {
      updated = { ...stored, additions: stored.additions.filter(a => a.id !== id) };
    } else {
      const newEdits = { ...stored.edits };
      delete newEdits[id];
      updated = {
        ...stored,
        edits: newEdits,
        deletions: [...stored.deletions, id],
      };
    }
    setStored(updated);
    saveEdits(updated);
    setDeleteConfirmId(null);
    if (editingId === id) setEditingId(null);
  }

  // Reset
  function resetToDefault() {
    const empty: StoredEdits = { edits: {}, additions: [], deletions: [] };
    setStored(empty);
    saveEdits(empty);
    setEditingId(null);
    setShowAddForm(false);
    setDeleteConfirmId(null);
  }

  const hasEdits =
    Object.keys(stored.edits).length > 0 ||
    stored.additions.length > 0 ||
    stored.deletions.length > 0;

  return (
    <>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-300 text-sm">Home</span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-100 text-sm">Directory</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Community Directory</h1>
          <p className="text-blue-200 text-lg">Resident contact information — members only</p>
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-1">Members Only</h2>
                <p className="text-gray-500 text-sm text-center mb-6">
                  Enter the community password to access the resident directory.
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
                    Access Directory
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
            <div className="space-y-6">
              {/* Top action row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="relative max-w-sm w-full">
                  <svg
                    className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name, email, or role..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                  />
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-sm text-gray-500">
                    {filtered.length} of {residents.length} residents
                  </span>
                  <button
                    onClick={() => { setShowAddForm(v => !v); setEditingId(null); setDeleteConfirmId(null); }}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: '#4A90D9' }}
                  >
                    + Add Resident
                  </button>
                  {hasEdits && (
                    <button
                      onClick={resetToDefault}
                      className="text-xs text-gray-400 hover:text-red-500 underline transition-colors"
                    >
                      Reset to Default
                    </button>
                  )}
                  <button
                    onClick={() => setAuthenticated(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                  >
                    Lock directory
                  </button>
                </div>
              </div>

              {/* Add Resident Form */}
              {showAddForm && (
                <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-5">
                  <h3 className="text-sm font-semibold text-gray-700 mb-4">New Resident</h3>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input
                      type="text"
                      placeholder="Full name"
                      value={addForm.name}
                      onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                    />
                    <input
                      type="email"
                      placeholder="Email address"
                      value={addForm.email}
                      onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveAdd}
                        disabled={!addForm.name.trim() || !addForm.email.trim()}
                        className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-40"
                        style={{ backgroundColor: '#1B3A5C' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => { setShowAddForm(false); setAddForm({ name: '', email: '' }); }}
                        className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead style={{ backgroundColor: '#1B3A5C' }}>
                    <tr>
                      {['Name', 'Email', 'Role', ''].map((h, i) => (
                        <th
                          key={i}
                          className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-200"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(r => (
                      <tr
                        key={r.id}
                        className={`transition-colors ${r.role ? 'bg-blue-50/40 hover:bg-blue-50' : 'hover:bg-gray-50'}`}
                      >
                        {editingId === r.id ? (
                          <>
                            <td className="px-5 py-3">
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                                className="w-full px-3 py-1.5 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white"
                                autoFocus
                              />
                            </td>
                            <td className="px-5 py-3">
                              <input
                                type="email"
                                value={editForm.email}
                                onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                                className="w-full px-3 py-1.5 border border-blue-200 rounded-lg text-sm focus:outline-none focus:ring-2 bg-white"
                              />
                            </td>
                            <td className="px-5 py-3">
                              {r.role && (
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#1B3A5C' }}>
                                  {r.role}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveEdit(r.id)}
                                  className="px-3 py-1 rounded-lg text-white text-xs font-semibold hover:opacity-90"
                                  style={{ backgroundColor: '#1B3A5C' }}
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingId(null)}
                                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : deleteConfirmId === r.id ? (
                          <>
                            <td colSpan={3} className="px-5 py-4 text-sm text-gray-700">
                              Delete <span className="font-semibold">{r.name}</span>? This cannot be undone.
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => confirmDelete(r.id)}
                                  className="px-3 py-1 rounded-lg text-white text-xs font-semibold bg-red-500 hover:bg-red-600"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmId(null)}
                                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
                                >
                                  Cancel
                                </button>
                              </div>
                            </td>
                          </>
                        ) : (
                          <>
                            <td className="px-5 py-4 text-sm font-semibold text-gray-900">{r.name}</td>
                            <td className="px-5 py-4">
                              <a href={`mailto:${r.email}`} className="text-sm hover:underline" style={{ color: '#4A90D9' }}>
                                {r.email}
                              </a>
                            </td>
                            <td className="px-5 py-4">
                              {r.role && (
                                <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#1B3A5C' }}>
                                  {r.role}
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEdit(r)}
                                  className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => { setDeleteConfirmId(r.id); setEditingId(null); }}
                                  className="px-3 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-gray-400 text-sm">No residents match your search.</div>
                )}
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-3">
                {filtered.map(r => (
                  <div
                    key={r.id}
                    className={`bg-white rounded-2xl shadow-sm border p-5 ${r.role ? 'border-blue-200' : 'border-gray-100'}`}
                  >
                    {editingId === r.id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Full name"
                          className="w-full px-3 py-2 border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
                          autoFocus
                        />
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))}
                          placeholder="Email address"
                          className="w-full px-3 py-2 border border-blue-200 rounded-xl text-sm focus:outline-none focus:ring-2 bg-white"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => saveEdit(r.id)}
                            className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90"
                            style={{ backgroundColor: '#1B3A5C' }}
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : deleteConfirmId === r.id ? (
                      <div className="space-y-3">
                        <p className="text-sm text-gray-700">Delete <span className="font-semibold">{r.name}</span>?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => confirmDelete(r.id)}
                            className="px-4 py-2 rounded-xl text-white text-sm font-semibold bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(null)}
                            className="px-4 py-2 rounded-xl text-sm font-semibold bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <p className="font-semibold text-gray-900">{r.name}</p>
                          {r.role && (
                            <span className="shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#1B3A5C' }}>
                              {r.role}
                            </span>
                          )}
                        </div>
                        <a href={`mailto:${r.email}`} className="text-sm hover:underline" style={{ color: '#4A90D9' }}>
                          {r.email}
                        </a>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => startEdit(r)}
                            className="px-3 py-1 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => { setDeleteConfirmId(r.id); setEditingId(null); }}
                            className="px-3 py-1 rounded-lg text-xs font-medium text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-gray-400 text-sm">No residents match your search.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
