import { put, list, del } from '@vercel/blob';
import { NextResponse } from 'next/server';

const MANIFEST_KEY = 'documents/manifest.json';

type UploadedDoc = {
  id: string;
  title: string;
  date: string;
  year: number;
  categoryId: string;
  file: string;       // Vercel Blob URL
  pathname: string;   // Blob pathname for deletion
};

type Manifest = {
  documents: UploadedDoc[];
};

async function loadManifest(): Promise<Manifest> {
  try {
    const { blobs } = await list({ prefix: MANIFEST_KEY });
    if (blobs.length === 0) return { documents: [] };
    const res = await fetch(blobs[0].url);
    if (!res.ok) return { documents: [] };
    return await res.json();
  } catch {
    return { documents: [] };
  }
}

async function saveManifest(manifest: Manifest): Promise<void> {
  await put(MANIFEST_KEY, JSON.stringify(manifest), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
  });
}

/** GET — list all uploaded (non-static) documents */
export async function GET() {
  const manifest = await loadManifest();
  return NextResponse.json(manifest);
}

/** POST — upload a new document */
export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const title = (formData.get('title') as string) || '';
  const categoryId = (formData.get('categoryId') as string) || 'minutes';
  const date = (formData.get('date') as string) || new Date().toISOString().slice(0, 10);

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!title.trim()) {
    return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  }

  // Only allow PDFs
  if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
    return NextResponse.json({ error: 'Only PDF files are allowed' }, { status: 400 });
  }

  // 4.5MB limit
  if (file.size > 4.5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 4.5MB)' }, { status: 400 });
  }

  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const pathname = `documents/${categoryId}/${timestamp}-${safeName}`;

  const blob = await put(pathname, file, {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/pdf',
  });

  const year = parseInt(date.slice(0, 4)) || new Date().getFullYear();

  const doc: UploadedDoc = {
    id: `upload-${timestamp}`,
    title: title.trim(),
    date,
    year,
    categoryId,
    file: blob.url,
    pathname: blob.pathname,
  };

  // Update manifest
  const manifest = await loadManifest();
  manifest.documents.unshift(doc);
  await saveManifest(manifest);

  return NextResponse.json(doc);
}

/** DELETE — remove an uploaded document */
export async function DELETE(request: Request) {
  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'Document ID required' }, { status: 400 });
  }

  const manifest = await loadManifest();
  const doc = manifest.documents.find(d => d.id === id);

  if (!doc) {
    return NextResponse.json({ error: 'Document not found' }, { status: 404 });
  }

  // Delete the blob file
  try {
    const { blobs } = await list({ prefix: doc.pathname });
    if (blobs.length > 0) {
      await del(blobs.map(b => b.url));
    }
  } catch { /* file may already be gone */ }

  // Remove from manifest
  manifest.documents = manifest.documents.filter(d => d.id !== id);
  await saveManifest(manifest);

  return NextResponse.json({ success: true });
}
