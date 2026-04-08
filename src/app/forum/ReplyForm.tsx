import { useState } from 'react';

interface ReplyFormProps {
  userName: string;
  parentAuthor?: string;
  quotedContent?: string;
  onSubmit: (content: string, quotedContent?: string, quotedAuthor?: string) => void;
  onCancel: () => void;
}

export function ReplyForm({ userName, parentAuthor, quotedContent, onSubmit, onCancel }: ReplyFormProps) {
  const [content, setContent] = useState('');
  const [includeQuote, setIncludeQuote] = useState(!!quotedContent);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) return;
    onSubmit(
      trimmed,
      includeQuote && quotedContent ? quotedContent : undefined,
      includeQuote && quotedContent && parentAuthor ? parentAuthor : undefined
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <p className="text-xs text-gray-500">
        Replying as{' '}
        <span className="font-semibold" style={{ color: '#4A90D9' }}>
          {userName}
        </span>
        {parentAuthor && (
          <span className="text-gray-400"> to {parentAuthor}</span>
        )}
      </p>

      {quotedContent && (
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeQuote}
            onChange={(e) => setIncludeQuote(e.target.checked)}
            className="mt-0.5 shrink-0"
          />
          <span className="text-xs text-gray-500">Include quote</span>
        </label>
      )}

      {quotedContent && includeQuote && (
        <blockquote className="border-l-4 border-blue-200 bg-blue-50 rounded-r-lg pl-3 pr-2 py-2 text-xs text-gray-500 italic">
          <span className="not-italic font-semibold text-blue-600 block mb-0.5">
            {parentAuthor}:
          </span>
          {quotedContent.length > 250
            ? quotedContent.slice(0, 250) + '…'
            : quotedContent}
        </blockquote>
      )}

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
        placeholder="Write your reply…"
        autoFocus
      />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={!content.trim()}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-40 transition-colors"
          style={{ backgroundColor: '#1B3A5C' }}
        >
          Post Reply
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
