'use client';

import { useState, useEffect } from 'react';

const COMMUNITY_PASSWORD = 'iraopa2026';
const ADMIN_PASSWORD = 'iraopa465';
const LS_DATA_KEY = 'irapoa_forum_data';
const LS_USER_KEY = 'irapoa_forum_user';

type Post = {
  id: string;
  topicId: string;
  author: string;
  content: string;
  timestamp: string;
  reactions?: { thumbsUp: string[]; thumbsDown: string[] };
};

type Topic = {
  id: string;
  title: string;
  author: string;
  status: 'active' | 'locked' | 'pending' | 'rejected';
  createdAt: string;
  requestReason?: string;
};

type ForumData = {
  topics: Topic[];
  posts: Post[];
};

const DEFAULT_DATA: ForumData = {
  topics: [
    {
      id: 'welcome',
      title: 'Welcome to the IRAPOA Community Forum',
      author: 'Admin',
      status: 'active',
      createdAt: new Date('2026-01-01').toISOString(),
    },
    {
      id: 'runway',
      title: 'Runway Maintenance Updates',
      author: 'Admin',
      status: 'active',
      createdAt: new Date('2026-01-15').toISOString(),
    },
    {
      id: 'events',
      title: 'Upcoming Community Events & Fly-Ins',
      author: 'Admin',
      status: 'active',
      createdAt: new Date('2026-02-01').toISOString(),
    },
  ],
  posts: [
    {
      id: 'p1',
      topicId: 'welcome',
      author: 'Admin',
      content: 'Welcome to the IRAPOA community forum! This is a place for residents to connect, share updates, and discuss aerodrome life. Please be respectful and keep discussions relevant to our community.',
      timestamp: new Date('2026-01-01T10:00:00').toISOString(),
    },
  ],
};

function loadData(): ForumData {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(LS_DATA_KEY);
    return raw ? JSON.parse(raw) : DEFAULT_DATA;
  } catch {
    return DEFAULT_DATA;
  }
}

function saveData(data: ForumData) {
  localStorage.setItem(LS_DATA_KEY, JSON.stringify(data));
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: 'numeric', minute: '2-digit',
  });
}

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
  const [replyContent, setReplyContent] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [requestTitle, setRequestTitle] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [requestSubmitted, setRequestSubmitted] = useState(false);

  // Admin modal
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminInput, setAdminInput] = useState('');
  const [adminError, setAdminError] = useState('');

  // Load persisted user on mount
  useEffect(() => {
    const saved = localStorage.getItem(LS_USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserName(parsed.name || '');
        setIsAdmin(parsed.isAdmin || false);
        if (parsed.name) setStep('forum');
      } catch { /* ignore */ }
    }
    setData(loadData());
  }, []);

  function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (passwordInput === COMMUNITY_PASSWORD) {
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

  function updateData(updated: ForumData) {
    setData(updated);
    saveData(updated);
  }

  function postReply(topicId: string) {
    const content = replyContent.trim();
    if (!content) return;
    const newPost: Post = {
      id: Date.now().toString(),
      topicId,
      author: userName,
      content,
      timestamp: new Date().toISOString(),
    };
    updateData({ ...data, posts: [...data.posts, newPost] });
    setReplyContent('');
  }

  function submitTopicRequest(e: React.FormEvent) {
    e.preventDefault();
    const title = requestTitle.trim();
    if (!title) return;
    const newTopic: Topic = {
      id: Date.now().toString(),
      title,
      author: userName,
      status: 'pending',
      createdAt: new Date().toISOString(),
      requestReason: requestReason.trim(),
    };
    updateData({ ...data, topics: [...data.topics, newTopic] });
    setRequestTitle('');
    setRequestReason('');
    setRequestSubmitted(true);
    setTimeout(() => { setShowRequestForm(false); setRequestSubmitted(false); }, 3000);
  }

  function approveTopic(id: string) {
    updateData({
      ...data,
      topics: data.topics.map(t => t.id === id ? { ...t, status: 'active' } : t),
    });
  }

  function rejectTopic(id: string) {
    updateData({
      ...data,
      topics: data.topics.map(t => t.id === id ? { ...t, status: 'rejected' } : t),
    });
  }

  function lockTopic(id: string) {
    updateData({
      ...data,
      topics: data.topics.map(t => t.id === id ? { ...t, status: t.status === 'locked' ? 'active' : 'locked' } : t),
    });
  }

  function deletePost(id: string) {
    updateData({ ...data, posts: data.posts.filter(p => p.id !== id) });
  }

  function toggleReaction(postId: string, type: 'thumbsUp' | 'thumbsDown') {
    updateData({
      ...data,
      posts: data.posts.map(p => {
        if (p.id !== postId) return p;
        const reactions = p.reactions || { thumbsUp: [], thumbsDown: [] };
        const opposite = type === 'thumbsUp' ? 'thumbsDown' : 'thumbsUp';
        const alreadyReacted = reactions[type].includes(userName);
        return {
          ...p,
          reactions: {
            ...reactions,
            [type]: alreadyReacted
              ? reactions[type].filter((n: string) => n !== userName)
              : [...reactions[type], userName],
            [opposite]: reactions[opposite].filter((n: string) => n !== userName),
          },
        };
      }),
    });
  }

  const activeTopicData = activeTopic ? data.topics.find(t => t.id === activeTopic) : null;
  const activeTopicPosts = activeTopic ? data.posts.filter(p => p.topicId === activeTopic) : [];
  const visibleTopics = isAdmin
    ? data.topics
    : data.topics.filter(t => t.status === 'active' || t.status === 'locked');
  const pendingTopics = data.topics.filter(t => t.status === 'pending');

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
                {isAdmin && <span className="ml-2 text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full font-semibold">ADMIN</span>}
              </p>
            </div>
            {!activeTopic && (
              <button
                onClick={() => { setShowRequestForm(true); setRequestSubmitted(false); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold border-2 border-white text-white hover:bg-white transition-colors"
                style={{ ':hover': { color: '#1B3A5C' } } as React.CSSProperties}
              >
                + Request New Topic
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Topic Request Form */}
        {showRequestForm && !activeTopic && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4" style={{ color: '#1B3A5C' }}>Request a New Topic</h3>
            {requestSubmitted ? (
              <p className="text-green-700 font-medium">✅ Your topic request has been submitted for admin review.</p>
            ) : (
              <form onSubmit={submitTopicRequest} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Topic Title *</label>
                  <input
                    type="text"
                    required
                    value={requestTitle}
                    onChange={e => setRequestTitle(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="What would you like to discuss?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Why is this topic needed?</label>
                  <textarea
                    value={requestReason}
                    onChange={e => setRequestReason(e.target.value)}
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

        {/* Admin: Pending Topics */}
        {isAdmin && !activeTopic && pendingTopics.length > 0 && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="font-bold text-lg mb-4 text-amber-800">Pending Topic Requests ({pendingTopics.length})</h3>
            <div className="space-y-4">
              {pendingTopics.map(topic => (
                <div key={topic.id} className="bg-white border border-amber-100 rounded-lg p-4">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <p className="font-semibold" style={{ color: '#1B3A5C' }}>{topic.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Requested by <strong>{topic.author}</strong> &bull; {formatDate(topic.createdAt)}
                      </p>
                      {topic.requestReason && (
                        <p className="text-sm text-gray-600 mt-1 italic">&ldquo;{topic.requestReason}&rdquo;</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveTopic(topic.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectTopic(topic.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-700 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Topic List View */}
        {!activeTopic && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100" style={{ backgroundColor: '#F5F5F0' }}>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Topics</p>
            </div>
            {visibleTopics.length === 0 ? (
              <p className="p-8 text-gray-400 text-center italic">No topics yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {visibleTopics.map(topic => {
                  const postCount = data.posts.filter(p => p.topicId === topic.id).length;
                  const lastPost = data.posts.filter(p => p.topicId === topic.id).at(-1);
                  return (
                    <div key={topic.id} className="px-5 py-4 hover:bg-blue-50/40 transition-colors">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            {topic.status === 'pending' && (
                              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Pending</span>
                            )}
                            {topic.status === 'locked' && (
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">🔒 Locked</span>
                            )}
                            {topic.status === 'rejected' && (
                              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">Rejected</span>
                            )}
                            <button
                              onClick={() => setActiveTopic(topic.id)}
                              className="font-semibold text-left hover:underline"
                              style={{ color: '#1B3A5C' }}
                            >
                              {topic.title}
                            </button>
                          </div>
                          <p className="text-xs text-gray-500">
                            by <strong>{topic.author}</strong> &bull; {formatDate(topic.createdAt)}
                            {lastPost && ` &bull; last reply by ${lastPost.author}`}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-gray-400 whitespace-nowrap">
                            {postCount} {postCount === 1 ? 'post' : 'posts'}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => lockTopic(topic.id)}
                              className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                              {topic.status === 'locked' ? 'Unlock' : 'Lock'}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Topic Detail View */}
        {activeTopic && activeTopicData && (
          <div>
            <button
              onClick={() => setActiveTopic(null)}
              className="mb-6 text-sm font-medium hover:underline flex items-center gap-1"
              style={{ color: '#4A90D9' }}
            >
              ← Back to Forum
            </button>

            {/* Posts */}
            <div className="space-y-4 mb-8">
              {activeTopicPosts.length === 0 ? (
                <p className="text-gray-400 italic text-center py-8">No posts yet. Be the first to reply!</p>
              ) : (
                activeTopicPosts.map(post => (
                  <div key={post.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                          style={{ backgroundColor: '#4A90D9' }}
                        >
                          {post.author[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-sm font-semibold" style={{ color: '#1B3A5C' }}>
                            {post.author}
                            {post.author === 'Admin' && (
                              <span className="ml-1.5 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">Admin</span>
                            )}
                          </p>
                          <p className="text-xs text-gray-400">{formatDate(post.timestamp)}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <button
                          onClick={() => deletePost(post.id)}
                          className="text-xs text-red-400 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-gray-700 text-sm whitespace-pre-wrap">{post.content}</p>
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-50">
                      <button
                        onClick={() => toggleReaction(post.id, 'thumbsUp')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          (post.reactions?.thumbsUp || []).includes(userName)
                            ? 'bg-green-100 text-green-700 border border-green-200'
                            : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-green-50 hover:text-green-600'
                        }`}
                      >
                        <span>👍</span>
                        {(post.reactions?.thumbsUp || []).length > 0 && (
                          <span>{(post.reactions?.thumbsUp || []).length}</span>
                        )}
                      </button>
                      <button
                        onClick={() => toggleReaction(post.id, 'thumbsDown')}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                          (post.reactions?.thumbsDown || []).includes(userName)
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-red-50 hover:text-red-600'
                        }`}
                      >
                        <span>👎</span>
                        {(post.reactions?.thumbsDown || []).length > 0 && (
                          <span>{(post.reactions?.thumbsDown || []).length}</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Reply form */}
            {activeTopicData.status === 'locked' ? (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 text-center text-gray-500 text-sm">
                🔒 This topic is locked. No new replies can be posted.
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
                <h4 className="font-semibold mb-3 text-sm" style={{ color: '#1B3A5C' }}>
                  Reply as <span style={{ color: '#4A90D9' }}>{userName}</span>
                </h4>
                <textarea
                  value={replyContent}
                  onChange={e => setReplyContent(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none mb-3"
                  placeholder="Write your reply..."
                />
                <button
                  onClick={() => postReply(activeTopic)}
                  disabled={!replyContent.trim()}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-40"
                  style={{ backgroundColor: '#1B3A5C' }}
                >
                  Post Reply
                </button>
              </div>
            )}
          </div>
        )}

        {/* Admin login link */}
        {!isAdmin && (
          <div className="mt-12 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => { setShowAdminLogin(true); setAdminInput(''); setAdminError(''); }}
              className="text-xs text-gray-300 hover:text-gray-500 transition-colors"
            >
              Admin
            </button>
          </div>
        )}
        {isAdmin && (
          <div className="mt-12 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => {
                setIsAdmin(false);
                localStorage.setItem(LS_USER_KEY, JSON.stringify({ name: userName, isAdmin: false }));
              }}
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Exit Admin Mode
            </button>
          </div>
        )}
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
