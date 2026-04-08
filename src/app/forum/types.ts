export type Category = 'General' | 'Maintenance' | 'Events' | 'Rules' | 'For Sale';

export const CATEGORIES: Category[] = ['General', 'Maintenance', 'Events', 'Rules', 'For Sale'];

export const CATEGORY_COLORS: Record<Category, string> = {
  General: 'bg-sky-100 text-sky-700',
  Maintenance: 'bg-orange-100 text-orange-700',
  Events: 'bg-green-100 text-green-700',
  Rules: 'bg-purple-100 text-purple-700',
  'For Sale': 'bg-yellow-100 text-yellow-700',
};

export type Reactions = {
  up: string[];
  down: string[];
};

export type Reply = {
  id: string;
  author: string;
  content: string;
  quotedContent?: string;
  quotedAuthor?: string;
  createdAt: string;
  parentReplyId: string | null;
  reactions: Reactions;
  replies: Reply[];
  edited?: boolean;
};

export type Topic = {
  id: string;
  title: string;
  author: string;
  content: string;
  category: Category;
  createdAt: string;
  locked: boolean;
  pinned: boolean;
  approved: boolean;
  reactions: Reactions;
  replies: Reply[];
};

export type PendingTopic = {
  id: string;
  title: string;
  author: string;
  content: string;
  category: Category;
  createdAt: string;
  requestReason?: string;
};

export type ForumData = {
  topics: Topic[];
  pendingTopics: PendingTopic[];
};

export type SortOption = 'newest' | 'most-active' | 'most-liked';
export type FilterCategory = 'All' | Category;
