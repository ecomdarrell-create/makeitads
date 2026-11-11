'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/admin';
import { PostForm } from '@/components/academy/PostForm';
import { Loader2 } from 'lucide-react';
import type { BlogPost } from '@/lib/academy/types';

export default function EditPostPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (!isAdmin(user.email)) { router.replace('/dashboard'); return; }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || !isAdmin(user.email) || !id) return;
    (async () => {
      try {
        const res = await fetch('/api/academy?all=true');
        const data = await res.json();
        const found = (data.posts || []).find((p: BlogPost) => p.id === id);
        setPost(found || null);
      } finally {
        setLoading(false);
      }
    })();
  }, [user, id]);

  if (authLoading || !user || !isAdmin(user.email) || loading) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><Loader2 className="h-5 w-5 animate-spin text-[#6366F1]" /></div>;
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#F9FAFB]">
        <p className="text-sm text-slate-500">Article introuvable.</p>
        <Link href="/admin/academy" className="text-xs font-medium text-[#6366F1] hover:underline">← Retour à la liste</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-10">
        <Link href="/admin/academy" className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#6366F1]">
          ← Retour à la liste
        </Link>
        <h1 className="mb-5 text-lg font-semibold text-slate-900 sm:text-2xl">Éditer l&apos;article</h1>
        <PostForm initial={post} />
      </div>
    </div>
  );
}