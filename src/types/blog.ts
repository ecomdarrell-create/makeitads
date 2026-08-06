export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  coverImage: string;
  category: BlogCategory;
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt: string;
  readTime: number;
  views: number;
  likes: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  status: 'draft' | 'published' | 'scheduled';
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
}

export interface BlogAnalytics {
  postId: string;
  views: number;
  uniqueVisitors: number;
  avgReadTime: number;
  scrollDepth: number;
  ctaClicks: number;
  conversions: number;
  shares: number;
  bookmarks: number;
  trafficSource: {
    google: number;
    twitter: number;
    linkedin: number;
    direct: number;
    other: number;
  };
}

export type ReactionType = 'like' | 'fire' | 'clap' | 'lightbulb' | 'heart';