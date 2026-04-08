'use client';

import { useState, useMemo } from 'react';
import directoryData from '@/data/directory.json';

const PASSWORD = 'fl74community';

type Resident = {
  id: number;
  name: string;
  address: string;
  phone: string;
  email: string;
  aircraft: string;
  hangar: string;
  role?: string;
};

export default function DirectoryPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [search, setSearch] = useState('');

  const residents: Resident[] = directoryData.residents;

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

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return residents;
    return residents.filter(r =>
      r.name.toLowerCase().includes(q) ||
      r.address.toLowerCase().includes(q) ||
      r.aircraft.toLowerCase().includes(q) ||
      r.hangar.toLowerCase().includes(q) ||
      (r.role ?? '').toLowerCase().includes(q)
    );
  }, [search, residents]);

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
                  <a href="mailto:iraerodrome@gmail.com" className="underline" style={{ color: '#4A90D9' }}>
                    iraerodrome@gmail.com
                  </a>{' '}
                  if you need access.
                </p>
              </div>
            </div>
          ) : (
            /* Directory Table */
            <div>
              {/* Search + logout row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div className="relative max-w-sm w-full">
                  <svg
                    className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search by name, address, aircraft..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent bg-white"
                  />
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">
                    {filtered.length} of {residents.length} residents
                  </span>
                  <button
                    onClick={() => setAuthenticated(false)}
                    className="text-xs text-gray-400 hover:text-gray-600 underline transition-colors"
                  >
                    Lock directory
                  </button>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-100">
                  <thead style={{ backgroundColor: '#1B3A5C' }}>
                    <tr>
                      {['Name / Role','Address','Phone','Email','Aircraft','Hangar'].map(h => (
                        <th
                          key={h}
                          className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-blue-200"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="text-sm font-semibold text-gray-900">{r.name}</p>
                          {r.role && (
                            <span
                              className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                              style={{ backgroundColor: '#4A90D9' }}
                            >
                              {r.role}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{r.address}</td>
                        <td className="px-5 py-4">
                          <a href={`tel:${r.phone}`} className="text-sm text-gray-600 hover:underline">
                            {r.phone}
                          </a>
                        </td>
                        <td className="px-5 py-4">
                          <a
                            href={`mailto:${r.email}`}
                            className="text-sm hover:underline"
                            style={{ color: '#4A90D9' }}
                          >
                            {r.email}
                          </a>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">{r.aircraft || '—'}</td>
                        <td className="px-5 py-4 text-sm font-mono text-gray-700">{r.hangar || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filtered.length === 0 && (
                  <div className="py-12 text-center text-gray-400 text-sm">No residents match your search.</div>
                )}
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filtered.map(r => (
                  <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-gray-900">{r.name}</p>
                        {r.role && (
                          <span
                            className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                            style={{ backgroundColor: '#4A90D9' }}
                          >
                            {r.role}
                          </span>
                        )}
                      </div>
                      {r.hangar && (
                        <span className="text-sm font-mono font-bold text-gray-500">#{r.hangar}</span>
                      )}
                    </div>
                    <div className="space-y-1.5 text-sm text-gray-600">
                      <p>{r.address}</p>
                      <a href={`tel:${r.phone}`} className="block hover:underline">{r.phone}</a>
                      <a href={`mailto:${r.email}`} className="block hover:underline" style={{ color: '#4A90D9' }}>{r.email}</a>
                      {r.aircraft && <p className="text-gray-500">✈ {r.aircraft}</p>}
                    </div>
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
