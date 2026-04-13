import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';
import type { ForumData } from '../../forum/types';

const BLOB_KEY = 'forum/forum-data.json';

const DEFAULT_DATA: ForumData = {
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

/** Load forum data from Vercel Blob. */
async function loadFromBlob(): Promise<ForumData> {
  try {
    const { blobs } = await list({ prefix: BLOB_KEY });
    if (blobs.length === 0) return DEFAULT_DATA;

    const res = await fetch(blobs[0].url);
    if (!res.ok) return DEFAULT_DATA;

    const data = await res.json();
    if (!data.topics) return DEFAULT_DATA;
    return data as ForumData;
  } catch {
    return DEFAULT_DATA;
  }
}

/** Save forum data to Vercel Blob. */
async function saveToBlob(data: ForumData): Promise<void> {
  await put(BLOB_KEY, JSON.stringify(data), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

export async function GET() {
  const data = await loadFromBlob();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const data: ForumData = await request.json();

    // Basic validation
    if (!data.topics || !Array.isArray(data.topics)) {
      return NextResponse.json({ error: 'Invalid forum data' }, { status: 400 });
    }

    await saveToBlob(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to save forum data:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
