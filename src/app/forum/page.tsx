'use client';

import { useState, useEffect } from 'react';
import { isAuthenticated, authenticate as sharedAuth, clearAuth } from '@/lib/auth';
import {
  loadData,
  saveData,
  buildPostCountMap,
  LS_USER_KEY,
  COMMUNITY_PASSWORD,
  ADMIN_PASSWORD,
  DEFAULT_DATA,
} from './storage';
import type { ForumData, Topic, PendingTopic, Category } from './types';
import { CATEGORIES } from './types';
import { TopicList } from './TopicList';
import { TopicView } from './TopicView';

export default function ForumPage() {
  // Auth state
  const [step, setStep] = useState<'password' | 'name' | 'forum'>('password');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState('');
  const [nameInput, setNameInput] = useState('');

  // Forum state
  const [data, setData] = useState<ForumData>(DEFAULT_DATA);
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  // Topic request form
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqContent, setReqContent] = useState('');
  const [reqCategory, setReqCategory] = useState<Category>('General');
  const [reqReason, setReqReason] = useState('');
  const [reqSubmitted, setReqSubmitted] = useState(false);

  // Admin modal
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminInput, setAdminInput] = useState('');
  const [adminError, setAdminError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Check shared community auth first
    if (isAuthenticated()) {
      const saved = localStorage.getItem(LS_USER_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.name) {
            setUserName(parsed.name);
            setIsAdmin(parsed.isAdmin || false);
            setStep('forum');
          } else {
            setStep('name');
          }
        } catch { setStep('name'); }
      } else {
        setStep('name');
      }
    } else {
      const saved = localStorage.getItem(LS_USER_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.name) {
            setUserName(parsed.name);
            setIsAdmin(parsed.isAdmin || false);
            setStep('forum');
          }
        } catch { /* ignore */ }
      }
    }
    loadData().then(d => setData(d));
  }, []);

  function persistData(updated: ForumData) {
    setData(updated);
    saveData(updated); // fire-and-forget async save to API
  }

  // --- Auth handlers ---
  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sharedAuth(passwordInput)) {
      const saved = localStorage.getItem(LS_USER_KEY);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed.name) {
            setUserName(parsed.name);
            setIsAdmin(parsed.isAdmin || false);
            setStep('forum');
            return;
          }
        } catch { /* ignore */ }
      }
      setStep('name');
    } else {
      setPasswordError('Incorrect password. Please try again.');
    }
  }

  function handleNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = nameInput.trim();
    if (!name) return;
    setUserName(name);
    localStorage.setItem(LS_USER_KEY, JSON.stringify({ name, isAdmin: false }));
    setStep('forum');
  }

  function handleAdminLogin(e: React.FormEvent) {
    e.preventDefault();
    if (adminInput === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(LS_USER_KEY, JSON.stringify({ name: userName, isAdmin: true }));
      setShowAdminLogin(false);
      setAdminInput('');
      setAdminError('');
    } else {
      setAdminError('Incorrect admin password.');
    }
  }

  // --- Topic handlers ---
  function handleApproveTopic(id: string) {
    const pending = data.pendingTopics.find(p => p.id === id);
    if (!pending) return;
    const newTopic: Topic = {
      id: pending.id,
      title: pending.title,
      author: pending.author,
      content: pending.content,
      category: pending.category,
      createdAt: pending.createdAt,
      locked: false,
      pinned: false,
      approved: true,
      reactions: { up: [], down: [] },
      replies: [],
    };
    persistData({
      topics: [...data.topics, newTopic],
      pendingTopics: data.pendingTopics.filter(p => p.id !== id),
    });
  }

  function handleRejectTopic(id: string) {
    persistData({ ...data, pendingTopics: data.pendingTopics.filter(p => p.id !== id) });
  }

  function handlePinTopic(id: string) {
    persistData({
      ...data,
      topics: data.topics.map(t => t.id === id ? { ...t, pinned: !t.pinned } : t),
    });
  }

  function handleLockTopic(id: string) {
    persistData({
      ...data,
      topics: data.topics.map(t => t.id === id ? { ...t, locked: !t.locked } : t),
    });
  }

  function handleUpdateTopic(updated: Topic) {
    persistData({
      ...data,
      topics: data.topics.map(t => t.id === updated.id ? updated : t),
    });
  }

  function handleSubmitTopicRequest(e: React.FormEvent) {
    e.preventDefault();
    const title = reqTitle.trim();
    const content = reqContent.trim();
    if (!title) return;
    const pending: PendingTopic = {
      id: Date.now().toString(),
      title,
      author: userName,
      content,
      category: reqCategory,
      createdAt: new Date().toISOString(),
      requestReason: reqReason.trim() || undefined,
    };
    persistData({ ...data, pendingTopics: [...data.pendingTopics, pending] });
    setReqTitle('');
    setReqContent('');
    setReqCategory('General');
    setReqReason('');
    setReqSubmitted(true);
    setTimeout(() => { setShowRequestForm(false); setReqSubmitted(false); }, 3000);
  }

  const postCountMap = buildPostCountMap(data);
  const activeTopicData = activeTopic ? data.topics.find(t => t.id === activeTopic) : null;

  // --- Password gate ---
  if (step === 'password') {
    return (
      <main>
        <section style={{ backgroundColor: '#1B3A5C' }} className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <nav className="text-sm text-blue-300 mb-4">
              <a href="/" className="hover:text-white transition-colors">Home</a>
              <span className="mx-2">/</span>
              <span className="text-white">Community Forum</span>
            </nav>
            <h1 className="text-4xl font-bold text-white mb-2">Community Forum</h1>
            <p className="text-blue-200">Residents only — enter the community password to access.</p>
          </div>
        </section>
        <section style={{ backgroundColor: '#F5F5F0' }} className="min-h-[60vh] flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: '#EFF6FF' }}>
                🔒
              </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-1" style={{ color: '#1B3A5C' }}>Members Only</h2>
            <p className="text-gray-500 text-sm text-center mb-6">Enter the community password to access the forum.</p>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <input
                type="password"
                required
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setPasswordError(''); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Community password"
                autoFocus
              />
              {passwordError && <p className="text-red-600 text-xs">{passwordError}</p>}
              <button
                type="submit"
                className="w-full py-2 rounded-lg text-white font-semibold text-sm transition-colors"
                style={{ backgroundColor: '#1B3A5C' }}
              >
                Enter Forum
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  // --- Name entry ---
  if (step === 'name') {
    return (
      <main>
        <section style={{ backgroundColor: '#1B3A5C' }} className="py-12 px-4">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-2">Community Forum</h1>
          </div>
        </section>
        <section style={{ backgroundColor: '#F5F5F0' }} className="min-h-[60vh] flex items-center justify-center px-4 py-16">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 w-full max-w-sm">
            <div className="flex justify-center mb-5">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-3xl" style={{ backgroundColor: '#EFF6FF' }}>
                👤
              </div>
            </div>
            <h2 className="text-xl font-bold text-center mb-1" style={{ color: '#1B3A5C' }}>What&apos;s your name?</h2>
            <p className="text-gray-500 text-sm text-center mb-6">Your name will appear on all your posts in the forum.</p>
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <input
                type="text"
                required
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Your name"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-2 rounded-lg text-white font-semibold text-sm transition-colors"
                style={{ backgroundColor: '#1B3A5C' }}
              >
                Enter Forum
              </button>
            </form>
          </div>
        </section>
      </main>
    );
  }

  // --- Forum ---
  return (
    <main>
      {/* Header */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <nav className="text-sm text-blue-300 mb-4">
            <a href="/" className="hover:text-white transition-colors">Home</a>
            <span className="mx-2">/</span>
            {activeTopic ? (
              <>
                <button onClick={() => setActiveTopic(null)} className="hover:text-white transition-colors">Forum</button>
                <span className="mx-2">/</span>
                <span className="text-white">{activeTopicData?.title}</span>
              </>
            ) : (
              <span className="text-white">Community Forum</span>
            )}
          </nav>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-4xl font-bold text-white mb-1">
                {activeTopic ? activeTopicData?.title : 'Community Forum'}
              </h1>
              <p className="text-blue-200 text-sm">
                Logged in as <strong className="text-white">{userName}</strong>
                {isAdmin && (
                  <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">ADMIN</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Topic request form */}
        {showRequestForm && !activeTopic && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4" style={{ color: '#1B3A5C' }}>Request a New Topic</h3>
            {reqSubmitted ? (
              <p className="text-green-700 font-medium">✅ Your topic request has been submitted for admin review.</p>
            ) : (
              <form onSubmit={handleSubmitTopicRequest} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title *</label>
                  <input
                    type="text"
                    required
                    value={reqTitle}
                    onChange={e => setReqTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="What would you like to discuss?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={reqCategory}
                    onChange={e => setReqCategory(e.target.value as Category)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Opening post</label>
                  <textarea
                    value={reqContent}
                    onChange={e => setReqContent(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    placeholder="What would you like to say in the first post?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Why is this topic needed?</label>
                  <textarea
                    value={reqReason}
                    onChange={e => setReqReason(e.target.value)}
                    rows={2}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    placeholder="Optional brief explanation..."
                  />
                </div>
                <div className="flex gap-3">
                  <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: '#1B3A5C' }}>
                    Submit Request
                  </button>
                  <button type="button" onClick={() => setShowRequestForm(false)} className="px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Topic list */}
        {!activeTopic && (
          <TopicList
            topics={data.topics}
            pendingTopics={data.pendingTopics}
            isAdmin={isAdmin}
            postCountMap={postCountMap}
            onSelectTopic={setActiveTopic}
            onApproveTopic={handleApproveTopic}
            onRejectTopic={handleRejectTopic}
            onPinTopic={handlePinTopic}
            onLockTopic={handleLockTopic}
            onNewTopicRequest={() => { setShowRequestForm(true); setReqSubmitted(false); }}
          />
        )}

        {/* Topic view */}
        {activeTopic && activeTopicData && (
          <TopicView
            topic={activeTopicData}
            userName={userName}
            isAdmin={isAdmin}
            postCountMap={postCountMap}
            onUpdateTopic={handleUpdateTopic}
            onBack={() => setActiveTopic(null)}
          />
        )}

        {/* Admin footer */}
        <div className="mt-12 pt-6 border-t border-gray-100 text-center">
          {isAdmin ? (
            <button
              onClick={() => {
                setIsAdmin(false);
                localStorage.setItem(LS_USER_KEY, JSON.stringify({ name: userName, isAdmin: false }));
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Exit Admin Mode
            </button>
          ) : (
            <button
              onClick={() => { setShowAdminLogin(true); setAdminInput(''); setAdminError(''); }}
              className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
            >
              Admin
            </button>
          )}
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold" style={{ color: '#1B3A5C' }}>Admin Login</h3>
              <button onClick={() => setShowAdminLogin(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <input
                type="password"
                required
                value={adminInput}
                onChange={e => { setAdminInput(e.target.value); setAdminError(''); }}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Admin password"
                autoFocus
              />
              {adminError && <p className="text-red-600 text-xs">{adminError}</p>}
              <button
                type="submit"
                className="w-full py-2 rounded-lg text-white font-semibold text-sm"
                style={{ backgroundColor: '#1B3A5C' }}
              >
                Login as Admin
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
