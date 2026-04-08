import type { Metadata } from 'next';
import DocumentsClient from './DocumentsClient';

export const metadata: Metadata = {
  title: 'Documents — IRAPOA',
  description: 'Download IRAPOA documents including meeting minutes, agendas, bylaws, forms, and insurance certificates.',
};

export default function DocumentsPage() {
  return (
    <>
      {/* Page Header */}
      <section style={{ backgroundColor: '#1B3A5C' }} className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-300 text-sm">Home</span>
            <span className="text-blue-500">/</span>
            <span className="text-blue-100 text-sm">Documents</span>
          </div>
          <h1 className="text-4xl font-bold mb-2">Documents & Forms</h1>
          <p className="text-blue-200 text-lg">Download meeting minutes, governing documents, forms, and more.</p>
        </div>
      </section>

      <DocumentsClient />
    </>
  );
}
