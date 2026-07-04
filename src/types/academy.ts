export type ArticleLevel = "Beginner" | "Intermediate" | "Advanced";

export type ArticleCategory =
  | "Marketing"
  | "Facebook Ads"
  | "Google Ads"
  | "AI"
  | "Branding"
  | "Copywriting"
  | "E-commerce"
  | "Growth"
  | "SEO"
  | "Analytics"
  | "Email Marketing"
  | "Social Media";

export type ArticleFilter = "recent" | "popular" | "trending" | "editors-picks" | "newest";

export interface ArticleAuthor {
  name: string;
  avatar: string;
  role: string;
}

export interface ArticleStats {
  views: number;
  likes: number;
  readTime: number;
}

export interface ArticleComment {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  date: string;
  likes: number;
  replies?: ArticleComment[];
}

export interface ArticleSection {
  type: "h2" | "h3" | "paragraph" | "list" | "callout" | "quote" | "tip" | "checklist" | "table" | "stats" | "cta" | "image";
  content?: string;
  items?: string[];
  variant?: "info" | "warning" | "success" | "tip";
  data?: any;
  // ✅ AJOUTÉ : Pour les citations
  author?: string;
  // ✅ AJOUTÉ : Pour les CTA
  buttonText?: string;
  buttonLink?: string;
}

export interface Article {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string;
  category: ArticleCategory;
  level: ArticleLevel;
  author: ArticleAuthor;
  publishedAt: string;
  stats: ArticleStats;
  tags: string[];
  featured?: boolean;
  editorsPick?: boolean;
  sections: ArticleSection[];
  comments: ArticleComment[];
}