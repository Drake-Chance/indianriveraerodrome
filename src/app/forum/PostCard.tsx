import { useState } from 'react';
import type { Reply } from './types';
import { ReplyForm } from './ReplyForm';
import { relativeTime, fullDate, avatarColor } from './utils';

interface PostCardProps {
  reply: Reply;
  depth: number;
  userName: string;
  isAdmin: boolean;
  topicLocked: boolean;
  postCountMap: Record<string, number>;
  onReact: (replyId: string, type: 'up' | 'down') => void;
  onEdit: (replyId: string, newContent: string) => void;
  onDelete: (replyId: string) => void;
  onAddReply: (
    parentReplyId: string,
    content: string,
    quotedContent?: string,
    quotedAuthor?: string
  ) => void;
}

export function PostCard({
  reply,
  depth,
  userName,
  isAdmin,
  topicLocked,
  postCountMap,
  onReact,
  onEdit,
  onDelete,
  onAddReply,
}: PostCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(reply.content);

  const isOwn = reply.author === userName;
  const userUpvoted = reply.reactions.up.includes(userName);
  const userDownvoted = reply.reactions.down.includes(userName);
  const postCount = postCountMap[reply.author] ?? 0;
  const isNested = depth > 0;

  function handleSaveEdit() {
    const trimmed = editContent.trim();
    if (!trimmed) return;
    onEdit(reply.id, trimmed);
    setEditing(false);
  }

  function handleSubmitReply(content: string, quotedContent?: string, quotedAuthor?: string) {
    onAddReply(reply.id, content, quotedContent, quotedAuthor);
    setShowReplyForm(false);
  }

  return (
    <div className={isNested ? 'ml-6 mt-2' : 'mb-3'}>
      {isNested && (
        <div className="border-l-2 border-blue-100 pl-4">
          <CardBody />
        </div>
      )}
      {!isNested && <CardBody />}
    </div>
  );

  function CardBody() {
    return (
      <div
        className={`bg-white border rounded-xl p-4 shadow-sm ${
          isNested ? 'border-gray-100' : 'border-gray-200'
        }`}
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
              style={{ backgroundColor: avatarColor(reply.author) }}
            >
              {reply.author[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <div className="flex items-center flex-wrap gap-1">
                <span className="text-sm font-semibold" style={{ color: '#1B3A5C' }}>
                  {reply.author}
                </span>
                {reply.author === 'Admin' && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">
                    Admin
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  · {postCount} {postCount === 1 ? 'post' : 'posts'}
                </span>
              </div>
              <p
                className="text-xs text-gray-400 cursor-default"
                title={fullDate(reply.createdAt)}
              >
                {relativeTime(reply.createdAt)}
                {reply.edited && <span className="ml-1 italic">(edited)</span>}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {isOwn && !editing && (
              <>
                <button
                  onClick={() => {
                    setEditing(true);
                    setEditContent(reply.content);
                  }}
                  className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(reply.id)}
                  className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                >
                  Delete
                </button>
              </>
            )}
            {isAdmin && !isOwn && (
              <button
                onClick={() => onDelete(reply.id)}
                className="text-xs text-red-400 hover:text-red-600 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>

        {/* Quote */}
        {reply.quotedContent && (
          <blockquote className="border-l-4 border-blue-200 bg-blue-50 rounded-r-lg pl-3 pr-2 py-2 text-xs text-gray-500 italic mb-3">
            {reply.quotedAuthor && (
              <span className="not-italic font-semibold text-blue-600 block mb-0.5">
                {reply.quotedAuthor}:
              </span>
            )}
            {reply.quotedContent.length > 250
              ? reply.quotedContent.slice(0, 250) + '…'
              : reply.quotedContent}
          </blockquote>
        )}

        {/* Content / Edit form */}
        {editing ? (
          <div className="mb-3">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none mb-2"
            />
            <div className="flex gap-2">
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
                style={{ backgroundColor: '#1B3A5C' }}
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200 text-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">{reply.content}</p>
        )}

        {/* Reactions + reply actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onReact(reply.id, 'up')}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors ${
              userUpvoted
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            👍 {reply.reactions.up.length}
          </button>
          <button
            onClick={() => onReact(reply.id, 'down')}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors ${
              userDownvoted
                ? 'bg-red-100 border-red-300 text-red-700'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            👎 {reply.reactions.down.length}
          </button>

          {!topicLocked && (
            <>
              <button
                onClick={() => setShowReplyForm((v) => !v)}
                className="text-xs text-gray-400 hover:text-blue-600 transition-colors ml-1"
              >
                ↩ Reply
              </button>
              <button
                onClick={() => setShowReplyForm((v) => !v)}
                className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
                title="Reply with quote"
              >
                Quote
              </button>
            </>
          )}
        </div>

        {/* Inline reply form */}
        {showReplyForm && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <ReplyForm
              userName={userName}
              parentAuthor={reply.author}
              quotedContent={reply.content}
              onSubmit={handleSubmitReply}
              onCancel={() => setShowReplyForm(false)}
            />
          </div>
        )}
      </div>
    );
  }
}

// Render a tree of replies recursively
interface ReplyTreeProps {
  replies: Reply[];
  depth: number;
  userName: string;
  isAdmin: boolean;
  topicLocked: boolean;
  postCountMap: Record<string, number>;
  onReact: (replyId: string, type: 'up' | 'down') => void;
  onEdit: (replyId: string, newContent: string) => void;
  onDelete: (replyId: string) => void;
  onAddReply: (
    parentReplyId: string,
    content: string,
    quotedContent?: string,
    quotedAuthor?: string
  ) => void;
}

export function ReplyTree({
  replies,
  depth,
  userName,
  isAdmin,
  topicLocked,
  postCountMap,
  onReact,
  onEdit,
  onDelete,
  onAddReply,
}: ReplyTreeProps) {
  if (replies.length === 0) return null;
  return (
    <>
      {replies.map((reply) => (
        <div key={reply.id}>
          <PostCard
            reply={reply}
            depth={depth}
            userName={userName}
            isAdmin={isAdmin}
            topicLocked={topicLocked}
            postCountMap={postCountMap}
            onReact={onReact}
            onEdit={onEdit}
            onDelete={onDelete}
            onAddReply={onAddReply}
          />
          {reply.replies.length > 0 && (
            <ReplyTree
              replies={reply.replies}
              depth={Math.min(depth + 1, 2)}
              userName={userName}
              isAdmin={isAdmin}
              topicLocked={topicLocked}
              postCountMap={postCountMap}
              onReact={onReact}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddReply={onAddReply}
            />
          )}
        </div>
      ))}
    </>
  );
}
