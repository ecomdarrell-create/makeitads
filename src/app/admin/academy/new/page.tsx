'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/admin';
import { PostForm } from '@/components/academy/PostForm';

export default function NewPostPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (!isAdmin(user.email)) { router.replace('/dashboard'); return; }
  }, [user, loading, router]);

  if (loading || !user || !isAdmin(user.email)) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="animate-pulse text-sm text-slate-400">Vérification…</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      <div className="mx-auto max-w-3xl px-4 pt-6 sm:px-6 sm:pt-10">
        <Link href="/admin/academy" className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#6366F1]">
          ← Retour à la liste
        </Link>
        <h1 className="mb-5 text-lg font-semibold text-slate-900 sm:text-2xl">Nouvel article</h1>
        <PostForm />
      </div>
    </div>
  );
}