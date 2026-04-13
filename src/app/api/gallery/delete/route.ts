import { del, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { pathname } = await request.json();

  if (!pathname || !pathname.startsWith('gallery/')) {
    return NextResponse.json({ error: 'Invalid pathname' }, { status: 400 });
  }

  try {
    // Find the actual blob URL for this pathname
    const { blobs } = await list({ prefix: pathname });
    const urls = blobs.map(b => b.url);

    // Also delete the companion meta file if it exists
    const { blobs: metaBlobs } = await list({ prefix: `${pathname}.meta.json` });
    urls.push(...metaBlobs.map(b => b.url));

    if (urls.length > 0) {
      await del(urls);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete gallery image:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
