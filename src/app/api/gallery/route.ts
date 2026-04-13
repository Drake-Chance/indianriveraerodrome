import { put, list } from '@vercel/blob';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const caption = (formData.get('caption') as string) || '';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
  }

  // Limit to 4.5MB (Vercel serverless body limit)
  if (file.size > 4.5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 4.5MB)' }, { status: 400 });
  }

  const timestamp = Date.now();
  const ext = file.name.split('.').pop() || 'jpg';
  const pathname = `gallery/${timestamp}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: false,
    contentType: file.type,
  });

  // Store caption in a companion metadata blob
  if (caption.trim()) {
    await put(`${pathname}.meta.json`, JSON.stringify({ caption, uploadedAt: timestamp }), {
      access: 'public',
      addRandomSuffix: false,
      contentType: 'application/json',
    });
  }

  return NextResponse.json({
    url: blob.url,
    pathname: blob.pathname,
    caption,
    uploadedAt: timestamp,
  });
}

export async function GET() {
  try {
    const { blobs } = await list({ prefix: 'gallery/' });

    // Separate images from metadata files
    const metaBlobs = blobs.filter(b => b.pathname.endsWith('.meta.json'));
    const imageBlobs = blobs.filter(b => !b.pathname.endsWith('.meta.json'));

    // Build meta lookup
    const metaMap: Record<string, { caption: string; uploadedAt: number }> = {};
    for (const meta of metaBlobs) {
      const imagePathname = meta.pathname.replace('.meta.json', '');
      try {
        const res = await fetch(meta.url);
        const data = await res.json();
        metaMap[imagePathname] = data;
      } catch { /* skip bad meta */ }
    }

    const images = imageBlobs.map(b => ({
      url: b.url,
      pathname: b.pathname,
      caption: metaMap[b.pathname]?.caption || '',
      uploadedAt: metaMap[b.pathname]?.uploadedAt || new Date(b.uploadedAt).getTime(),
    }));

    // Sort newest first
    images.sort((a, b) => b.uploadedAt - a.uploadedAt);

    return NextResponse.json({ images });
  } catch (error) {
    console.error('Failed to list gallery images:', error);
    return NextResponse.json({ images: [] });
  }
}
