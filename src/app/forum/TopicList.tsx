import { useState } from 'react';
import type { Topic, PendingTopic, SortOption, FilterCategory, Category } from './types';
import { CATEGORIES, CATEGORY_COLORS } from './types';
import { countRepliesDeep, getLastActivity } from './storage';
import { relativeTime, fullDate } from './utils';

interface TopicListProps {
  topics: Topic[];
  pendingTopics: PendingTopic[];
  isAdmin: boolean;
  postCountMap: Record<string, number>;
  onSelectTopic: (id: string) => void;
  onApproveTopic: (id: string) => void;
  onRejectTopic: (id: string) => void;
  onPinTopic: (id: string) => void;
  onLockTopic: (id: string) => void;
  onNewTopicRequest: () => void;
}

const PAGE_SIZE = 15;

export function TopicList({
  topics,
  pendingTopics,
  isAdmin,
  postCountMap,
  onSelectTopic,
  onApproveTopic,
  onRejectTopic,
  onPinTopic,
  onLockTopic,
  onNewTopicRequest,
}: TopicListProps) {
  const [sort, setSort] = useState<SortOption>('newest');
  const [filter, setFilter] = useState<FilterCategory>('All');
  const [page, setPage] = useState(1);

  function sortedTopics(): Topic[] {
    const filtered = topics.filter(
      (t) => filter === 'All' || t.category === filter
    );

    const pinned = filtered.filter((t) => t.pinned);
    const unpinned = filtered.filter((t) => !t.pinned);

    function applySort(list: Topic[]): Topic[] {
      switch (sort) {
        case 'newest':
          return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        case 'most-active':
          return [...list].sort(
            (a, b) => countRepliesDeep(b.replies) - countRepliesDeep(a.replies)
          );
        case 'most-liked':
          return [...list].sort(
            (a, b) => b.reactions.up.length - a.reactions.up.length
          );
      }
    }

    return [...applySort(pinned), ...applySort(unpinned)];
  }

  const allSorted = sortedTopics();
  const visible = allSorted.slice(0, page * PAGE_SIZE);
  const hasMore = visible.length < allSorted.length;

  return (
    <div>
      {/* Admin: pending topics */}
      {isAdmin && pendingTopics.length > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-5">
          <h3 className="font-bold text-sm text-amber-800 mb-3">
            Pending Topic Requests ({pendingTopics.length})
          </h3>
          <div className="space-y-3">
            {pendingTopics.map((pt) => (
              <div key={pt.id} className="bg-white border border-amber-100 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-semibold text-sm" style={{ color: '#1B3A5C' }}>
                      {pt.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      by <strong>{pt.author}</strong> &bull;{' '}
                      <span title={fullDate(pt.createdAt)}>{relativeTime(pt.createdAt)}</span>
                      &bull;{' '}
                      <span
                        className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                          CATEGORY_COLORS[pt.category as Category] ?? 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {pt.category}
                      </span>
                    </p>
                    {pt.requestReason && (
                      <p className="text-xs text-gray-500 mt-1 italic">
                        &ldquo;{pt.requestReason}&rdquo;
                      </p>
                    )}
                    {pt.content && (
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{pt.content}</p>
                    )}
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onApproveTopic(pt.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onRejectTopic(pt.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
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

      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5">
          {(['All', ...CATEGORIES] as FilterCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => { setFilter(cat); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                filter === cat
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={filter === cat ? { backgroundColor: '#1B3A5C' } : {}}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-1.5">
          {([
            ['newest', 'Newest'],
            ['most-active', 'Most Active'],
            ['most-liked', 'Most Liked'],
          ] as [SortOption, string][]).map(([val, label]) => (
            <button
              key={val}
              onClick={() => { setSort(val); setPage(1); }}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                sort === val
                  ? 'text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={sort === val ? { backgroundColor: '#4A90D9' } : {}}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Topic table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div
          className="px-5 py-3 border-b border-gray-100 flex items-center justify-between"
          style={{ backgroundColor: '#F5F5F0' }}
        >
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Topics{' '}
            {allSorted.length > 0 && (
              <span className="text-gray-400 normal-case font-normal">
                ({allSorted.length})
              </span>
            )}
          </p>
          <button
            onClick={onNewTopicRequest}
            className="text-xs font-semibold px-3 py-1.5 rounded-lg text-white transition-colors"
            style={{ backgroundColor: '#1B3A5C' }}
          >
            + New Topic
          </button>
        </div>

        {visible.length === 0 ? (
          <p className="p-10 text-gray-400 text-center italic">
            No topics yet — be the first to start a discussion!
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {visible.map((topic, idx) => {
              const replyCount = countRepliesDeep(topic.replies);
              const lastAct = getLastActivity(topic);
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={topic.id}
                  className={`px-5 py-4 hover:bg-blue-50/40 transition-colors ${
                    isEven ? '' : 'bg-gray-50/40'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
                    {/* Left: text info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        {topic.pinned && (
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold">
                            📌 Pinned
                          </span>
                        )}
                        {topic.locked && (
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                            🔒 Locked
                          </span>
                        )}
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            CATEGORY_COLORS[topic.category]
                          }`}
                        >
                          {topic.category}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectTopic(topic.id)}
                        className="font-semibold text-left hover:underline text-base leading-snug"
                        style={{ color: '#1B3A5C' }}
                      >
                        {topic.title}
                      </button>

                      <p className="text-xs text-gray-500 mt-1">
                        by{' '}
                        <strong>{topic.author}</strong>
                        {postCountMap[topic.author] !== undefined && (
                          <span className="text-gray-400">
                            {' '}· {postCountMap[topic.author]} posts
                          </span>
                        )}
                        {' · '}
                        <span title={fullDate(topic.createdAt)}>
                          {relativeTime(topic.createdAt)}
                        </span>
                        {replyCount > 0 && (
                          <>
                            {' · last activity '}
                            <span title={fullDate(lastAct)}>
                              {relativeTime(lastAct)}
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    {/* Right: stats + admin controls */}
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-600">
                          {replyCount}
                        </p>
                        <p className="text-xs text-gray-400">
                          {replyCount === 1 ? 'reply' : 'replies'}
                        </p>
                      </div>
                      <div className="text-right text-xs text-gray-400">
                        <span>👍 {topic.reactions.up.length}</span>
                      </div>
                      {isAdmin && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => onPinTopic(topic.id)}
                            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                            title={topic.pinned ? 'Unpin' : 'Pin'}
                          >
                            {topic.pinned ? '📌' : '📎'}
                          </button>
                          <button
                            onClick={() => onLockTopic(topic.id)}
                            className="text-xs px-2 py-1 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 transition-colors"
                            title={topic.locked ? 'Unlock' : 'Lock'}
                          >
                            {topic.locked ? '🔓' : '🔒'}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {hasMore && (
          <div className="p-4 border-t border-gray-100 text-center">
            <button
              onClick={() => setPage((p) => p + 1)}
              className="text-sm font-medium hover:underline"
              style={{ color: '#4A90D9' }}
            >
              Load more ({allSorted.length - visible.length} remaining)
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
