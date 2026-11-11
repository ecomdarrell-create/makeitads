export type BlogCategory = 'tactiques' | 'etudes-de-cas' | 'outils' | 'actualites';
export type BlogStatus = 'draft' | 'published';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  category: BlogCategory;
  tags: string[];
  status: BlogStatus;
  published_at: string | null;
  author_name: string;
  reading_time_minutes: number;
  meta_title: string | null;
  meta_description: string | null;
  og_image_url: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_url: string | null;
  category: BlogCategory;
  tags: string[];
  status: BlogStatus;
  author_name: string;
  meta_title?: string | null;
  meta_description?: string | null;
  og_image_url?: string | null;
}

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  tactiques: 'Tactiques',
  'etudes-de-cas': 'Études de cas',
  outils: 'Outils',
  actualites: 'Actualités',
};

export const CATEGORY_COLORS: Record<BlogCategory, string> = {
  tactiques: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
  'etudes-de-cas': 'bg-violet-50 text-violet-700 ring-violet-200',
  outils: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  actualites: 'bg-amber-50 text-amber-700 ring-amber-200',
};