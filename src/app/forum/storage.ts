import type { ForumData, Reactions, Reply, Topic } from './types';

export const LS_DATA_KEY = 'irapoa_forum_data';
export const LS_USER_KEY = 'irapoa_forum_user';
export const COMMUNITY_PASSWORD = 'iraopa2026';
export const ADMIN_PASSWORD = 'iraopa465';

export const DEFAULT_DATA: ForumData = {
  topics: [
    {
      id: 'welcome',
      title: 'Welcome to the IRAPOA Community Forum',
      author: 'Admin',
      content:
        'Welcome to the IRAPOA community forum! This is a place for residents to connect, share updates, and discuss aerodrome life.\n\nPlease be respectful and keep discussions relevant to our community. If you have ideas for new discussion topics, use the "Request New Topic" button — admin will review and approve.',
      category: 'General',
      createdAt: new Date('2026-01-01T10:00:00').toISOString(),
      locked: false,
      pinned: true,
      approved: true,
      reactions: { up: [], down: [] },
      replies: [],
    },
    {
      id: 'runway',
      title: 'Runway Maintenance Updates',
      author: 'Admin',
      content:
        'Use this thread to post updates about runway maintenance, closures, and improvement plans. Please include dates and affected areas in your posts.',
      category: 'Maintenance',
      createdAt: new Date('2026-01-15T09:00:00').toISOString(),
      locked: false,
      pinned: false,
      approved: true,
      reactions: { up: [], down: [] },
      replies: [],
    },
    {
      id: 'events',
      title: 'Upcoming Community Events & Fly-Ins',
      author: 'Admin',
      content:
        'Share information about upcoming fly-ins, community gatherings, and events at IRAPOA. Include date, time, and any relevant details.',
      category: 'Events',
      createdAt: new Date('2026-02-01T11:00:00').toISOString(),
      locked: false,
      pinned: false,
      approved: true,
      reactions: { up: [], down: [] },
      replies: [],
    },
  ],
  pendingTopics: [],
};

export function loadData(): ForumData {
  if (typeof window === 'undefined') return DEFAULT_DATA;
  try {
    const raw = localStorage.getItem(LS_DATA_KEY);
    if (!raw) return DEFAULT_DATA;
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    // Migrate old format (had 'posts' array, not 'pendingTopics')
    if ('posts' in parsed && !('pendingTopics' in parsed)) return DEFAULT_DATA;
    return parsed as unknown as ForumData;
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: ForumData) {
  localStorage.setItem(LS_DATA_KEY, JSON.stringify(data));
}

export function countRepliesDeep(replies: Reply[]): number {
  return replies.reduce((sum, r) => sum + 1 + countRepliesDeep(r.replies), 0);
}

export function buildPostCountMap(data: ForumData): Record<string, number> {
  const map: Record<string, number> = {};
  function inc(author: string) {
    map[author] = (map[author] ?? 0) + 1;
  }
  function walk(replies: Reply[]) {
    for (const r of replies) {
      inc(r.author);
      walk(r.replies);
    }
  }
  for (const topic of data.topics) {
    inc(topic.author);
    walk(topic.replies);
  }
  return map;
}

export function getLastActivity(topic: Topic): string {
  let latest = topic.createdAt;
  function walk(replies: Reply[]) {
    for (const r of replies) {
      if (r.createdAt > latest) latest = r.createdAt;
      walk(r.replies);
    }
  }
  walk(topic.replies);
  return latest;
}

export function toggleReaction(reactions: Reactions, userName: string, type: 'up' | 'down'): Reactions {
  const opposite = type === 'up' ? 'down' : 'up';
  const isActive = reactions[type].includes(userName);
  return {
    [type]: isActive
      ? reactions[type].filter((n) => n !== userName)
      : [...reactions[type], userName],
    [opposite]: reactions[opposite].filter((n) => n !== userName),
  } as Reactions;
}

export function updateReplyById(
  replies: Reply[],
  id: string,
  updater: (r: Reply) => Reply
): Reply[] {
  return replies.map((r) => {
    if (r.id === id) return updater(r);
    return { ...r, replies: updateReplyById(r.replies, id, updater) };
  });
}

export function deleteReplyById(replies: Reply[], id: string): Reply[] {
  return replies
    .filter((r) => r.id !== id)
    .map((r) => ({ ...r, replies: deleteReplyById(r.replies, id) }));
}

export function addReplyToParent(
  replies: Reply[],
  parentId: string | null,
  newReply: Reply
): Reply[] {
  if (parentId === null) return [...replies, newReply];
  return replies.map((r) => {
    if (r.id === parentId) return { ...r, replies: [...r.replies, newReply] };
    return { ...r, replies: addReplyToParent(r.replies, parentId, newReply) };
  });
}
