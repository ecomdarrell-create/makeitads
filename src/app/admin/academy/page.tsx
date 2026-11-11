'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { isAdmin } from '@/lib/admin';
import { Plus, Edit3, Trash2, BookOpen, ExternalLink } from 'lucide-react';
import { CATEGORY_LABELS, type BlogPost } from '@/lib/academy/types';
import { formatDateFR } from '@/lib/academy/helpers';

export default function AdminAcademyPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace('/login'); return; }
    if (!isAdmin(user.email)) { router.replace('/dashboard'); return; }
  }, [user, authLoading, router]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/academy?all=true');
      const data = await res.json();
      setPosts(data.posts || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && isAdmin(user.email)) load();
  }, [user]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Supprimer l'article « ${title} » ?`)) return;
    const res = await fetch(`/api/academy/${id}`, { method: 'DELETE' });
    if (res.ok) load();
    else alert('Erreur lors de la suppression');
  };

  if (authLoading || !user || !isAdmin(user.email)) {
    return <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]"><div className="animate-pulse text-sm text-slate-400">Vérification…</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      <div className="mx-auto max-w-5xl px-4 pt-6 sm:px-6 sm:pt-10">
        <Link href="/dashboard" className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-[#6366F1]">
          ← Retour au dashboard
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-2xl">Academy</h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">Gérez vos articles éditoriaux.</p>
          </div>
          <Link
            href="/admin/academy/new"
            className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-[#5558e6] sm:text-sm"
          >
            <Plus className="h-3.5 w-3.5" /> Nouvel article
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {loading ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-16 animate-pulse rounded-xl bg-slate-50" />
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="px-4 py-14 text-center">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-slate-300" />
              <p className="text-sm font-semibold text-slate-900">Aucun article</p>
              <p className="mt-1 text-xs text-slate-500">Créez votre premier article Academy.</p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {posts.map((p) => (
                <li key={p.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2">
                      <p className="truncate text-[13px] font-semibold text-slate-900 sm:text-sm">{p.title}</p>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[9.5px] font-medium ${p.status === 'published' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {p.status === 'published' ? 'Publié' : 'Brouillon'}
                      </span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] text-slate-400">
                      <span>{CATEGORY_LABELS[p.category]}</span>
                      <span>•</span>
                      <span>{p.status === 'published' ? formatDateFR(p.published_at) : 'Non publié'}</span>
                      {p.status === 'published' && (
                        <>
                          <span>•</span>
                          <a
                            href={`/insights/${p.slug}`} target="_blank" rel="noreferrer"
                            className="inline-flex items-center gap-0.5 text-[#6366F1] hover:underline"
                          >
                            Voir <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={`/admin/academy/${p.id}`}
                      className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100"
                      aria-label="Éditer"
                    >
                      <Edit3 className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDelete(p.id, p.title)}
                      className="rounded-full p-1.5 text-rose-500 hover:bg-rose-50"
                      aria-label="Supprimer"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}