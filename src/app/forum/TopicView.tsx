import { useState } from 'react';
import type { Topic, Reply } from './types';
import { CATEGORY_COLORS } from './types';
import { countRepliesDeep, toggleReaction, updateReplyById, deleteReplyById, addReplyToParent } from './storage';
import { relativeTime, fullDate, avatarColor } from './utils';
import { ReplyTree } from './PostCard';

interface TopicViewProps {
  topic: Topic;
  userName: string;
  isAdmin: boolean;
  postCountMap: Record<string, number>;
  onUpdateTopic: (updated: Topic) => void;
  onBack: () => void;
}

export function TopicView({ topic, userName, isAdmin, postCountMap, onUpdateTopic, onBack }: TopicViewProps) {
  const [newReply, setNewReply] = useState('');
  const replyCount = countRepliesDeep(topic.replies);

  function handleTopicReact(type: 'up' | 'down') {
    onUpdateTopic({ ...topic, reactions: toggleReaction(topic.reactions, userName, type) });
  }

  function handleReplyReact(replyId: string, type: 'up' | 'down') {
    const replies = updateReplyById(topic.replies, replyId, (r) => ({
      ...r,
      reactions: toggleReaction(r.reactions, userName, type),
    }));
    onUpdateTopic({ ...topic, replies });
  }

  function handleEditReply(replyId: string, content: string) {
    const replies = updateReplyById(topic.replies, replyId, (r) => ({
      ...r,
      content,
      edited: true,
    }));
    onUpdateTopic({ ...topic, replies });
  }

  function handleDeleteReply(replyId: string) {
    onUpdateTopic({ ...topic, replies: deleteReplyById(topic.replies, replyId) });
  }

  function handleAddReply(
    parentReplyId: string,
    content: string,
    quotedContent?: string,
    quotedAuthor?: string
  ) {
    const newR: Reply = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      author: userName,
      content,
      quotedContent,
      quotedAuthor,
      createdAt: new Date().toISOString(),
      parentReplyId,
      reactions: { up: [], down: [] },
      replies: [],
    };
    onUpdateTopic({
      ...topic,
      replies: addReplyToParent(topic.replies, parentReplyId, newR),
    });
  }

  function handleTopLevelReply(e: React.FormEvent) {
    e.preventDefault();
    const content = newReply.trim();
    if (!content) return;
    const newR: Reply = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      author: userName,
      content,
      createdAt: new Date().toISOString(),
      parentReplyId: null,
      reactions: { up: [], down: [] },
      replies: [],
    };
    onUpdateTopic({ ...topic, replies: [...topic.replies, newR] });
    setNewReply('');
  }

  const userUpvoted = topic.reactions.up.includes(userName);
  const userDownvoted = topic.reactions.down.includes(userName);

  return (
    <div>
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-5 text-sm font-medium flex items-center gap-1 hover:underline"
        style={{ color: '#4A90D9' }}
      >
        ← Back to Forum
      </button>

      {/* OP card */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm mb-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-base font-bold text-white shrink-0"
              style={{ backgroundColor: avatarColor(topic.author) }}
            >
              {topic.author[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <div className="flex items-center flex-wrap gap-1">
                <span className="font-semibold text-sm" style={{ color: '#1B3A5C' }}>
                  {topic.author}
                </span>
                {topic.author === 'Admin' && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-semibold">
                    Admin
                  </span>
                )}
                <span className="text-xs text-gray-400">
                  · {postCountMap[topic.author] ?? 0} posts
                </span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ml-1 ${CATEGORY_COLORS[topic.category]}`}
                >
                  {topic.category}
                </span>
              </div>
              <p
                className="text-xs text-gray-400 cursor-default mt-0.5"
                title={fullDate(topic.createdAt)}
              >
                {relativeTime(topic.createdAt)} · {replyCount}{' '}
                {replyCount === 1 ? 'reply' : 'replies'}
                {topic.pinned && ' · 📌 Pinned'}
                {topic.locked && ' · 🔒 Locked'}
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => onUpdateTopic({ ...topic, pinned: !topic.pinned })}
                className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {topic.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button
                onClick={() => onUpdateTopic({ ...topic, locked: !topic.locked })}
                className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
              >
                {topic.locked ? 'Unlock' : 'Lock'}
              </button>
            </div>
          )}
        </div>

        <p className="text-gray-700 text-sm whitespace-pre-wrap mb-4 leading-relaxed">
          {topic.content}
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleTopicReact('up')}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors ${
              userUpvoted
                ? 'bg-blue-100 border-blue-300 text-blue-700'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            👍 {topic.reactions.up.length}
          </button>
          <button
            onClick={() => handleTopicReact('down')}
            className={`flex items-center gap-1 text-xs px-2 py-1 rounded-lg border transition-colors ${
              userDownvoted
                ? 'bg-red-100 border-red-300 text-red-700'
                : 'border-gray-200 text-gray-500 hover:bg-gray-50'
            }`}
          >
            👎 {topic.reactions.down.length}
          </button>
        </div>
      </div>

      {/* Locked banner */}
      {topic.locked && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center text-gray-500 text-sm mb-5">
          🔒 This topic is locked. No new replies can be posted.
        </div>
      )}

      {/* Replies */}
      <div className="mb-6">
        {topic.replies.length === 0 && !topic.locked && (
          <p className="text-gray-400 italic text-center py-8 text-sm">
            No replies yet — be the first to reply!
          </p>
        )}
        <ReplyTree
          replies={topic.replies}
          depth={0}
          userName={userName}
          isAdmin={isAdmin}
          topicLocked={topic.locked}
          postCountMap={postCountMap}
          onReact={handleReplyReact}
          onEdit={handleEditReply}
          onDelete={handleDeleteReply}
          onAddReply={handleAddReply}
        />
      </div>

      {/* Top-level reply form */}
      {!topic.locked && (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
          <h4 className="font-semibold text-sm mb-3" style={{ color: '#1B3A5C' }}>
            Reply as{' '}
            <span style={{ color: '#4A90D9' }}>{userName}</span>
          </h4>
          <form onSubmit={handleTopLevelReply}>
            <textarea
              value={newReply}
              onChange={(e) => setNewReply(e.target.value)}
              rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none mb-3"
              placeholder="Write your reply…"
            />
            <button
              type="submit"
              disabled={!newReply.trim()}
              className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-40 transition-colors"
              style={{ backgroundColor: '#1B3A5C' }}
            >
              Post Reply
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
