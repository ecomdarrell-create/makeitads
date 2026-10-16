'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Mail,
  MailOpen,
  MessageSquare,
  CheckCircle2,
  Search,
  Trash2,
  X,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import type { ThreadSummary } from './page';
import { BackButton } from '@/components/ui/BackButton';

interface SupportListProps {
  threads: ThreadSummary[];
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60000);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);
  if (min < 1) return "À l'instant";
  if (min < 60) return `${min} min`;
  if (h < 24) return `${h} h`;
  if (d < 7) return `${d} j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export function SupportList({ threads }: SupportListProps) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  // Filtre par recherche
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return threads;
    return threads.filter((t) => {
      const haystack = [
        t.lastMessage.from_email,
        t.lastMessage.from_name || '',
        t.lastMessage.subject || '',
        t.lastMessage.body_text || '',
      ]
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [threads, search]);

  const unreadCount = filtered.filter((t) => t.hasUnread).length;
  const allSelected = filtered.length > 0 && filtered.every((t) => selected.has(t.thread_id));
  const someSelected = selected.size > 0;

  const toggleSelect = (tid: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(tid)) next.delete(tid);
      else next.add(tid);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((t) => t.thread_id)));
    }
  };

  const handleDelete = async (threadIds: string[]) => {
    if (threadIds.length === 0) return;

    const confirmMsg =
      threadIds.length === 1
        ? 'Supprimer cette conversation ?'
        : `Supprimer ${threadIds.length} conversations ?`;
    if (!confirm(confirmMsg)) return;

    setDeleting(true);
    setError('');

    try {
      const res = await fetch('/api/support/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadIds }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Erreur lors de la suppression');
        setDeleting(false);
        return;
      }

      setSelected(new Set());
      router.refresh();
      setDeleting(false);
    } catch {
      setError('Impossible de supprimer');
      setDeleting(false);
    }
  };

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      <BackButton href="/dashboard/settings" label="Retour aux paramètres" />

      {/* En-tête */}
      <div className="mb-4 flex items-start gap-3 sm:mb-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white shadow-sm sm:h-10 sm:w-10">
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-[#111827] sm:text-xl">
              Support client
            </h1>
            {unreadCount > 0 && (
              <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#6366F1] px-1.5 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-[10px] leading-relaxed text-gray-600 sm:text-xs">
            Répondez aux messages de vos utilisateurs.
          </p>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un email, un nom, un sujet…"
            className="min-h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-9 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              aria-label="Effacer la recherche"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Bouton supprimer la sélection */}
        {someSelected && (
          <button
            onClick={() => handleDelete(Array.from(selected))}
            disabled={deleting}
            className="inline-flex h-10 shrink-0 items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 text-[11px] font-semibold text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-50 sm:h-11 sm:px-4 sm:text-xs"
          >
            {deleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            Supprimer ({selected.size})
          </button>
        )}
      </div>

      {error && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-700 sm:text-xs">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-14 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
            <Mail className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            {search ? 'Aucun résultat' : 'Aucun message pour l\'instant'}
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
            {search
              ? `Aucune conversation ne correspond à « ${search} »`
              : 'Les emails envoyés à support@makeitads.pro apparaîtront ici.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {/* Barre "tout sélectionner" */}
          <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-50/50 px-4 py-2.5 sm:px-5">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleSelectAll}
              aria-label="Tout sélectionner"
              className="h-4 w-4 cursor-pointer rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]"
            />
            <span className="text-[10px] font-medium text-slate-600 sm:text-[11px]">
              Tout sélectionner ({filtered.length})
            </span>
          </div>

          <ul className="divide-y divide-slate-100">
            {filtered.map((t) => {
              const isSelected = selected.has(t.thread_id);
              return (
                <li key={t.thread_id} className="relative">
                  <div
                    className={`flex items-start gap-2 px-4 py-4 transition-colors sm:gap-3 sm:px-5 ${
                      t.hasUnread ? 'bg-indigo-50/30' : ''
                    } ${isSelected ? 'bg-indigo-50' : ''}`}
                  >
                    {/* Checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(t.thread_id)}
                      aria-label="Sélectionner"
                      className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-slate-300 text-[#6366F1] focus:ring-[#6366F1]"
                    />

                    {/* Contenu cliquable */}
                    <Link
                      href={`/dashboard/admin/support/${t.thread_id}`}
                      className="flex min-w-0 flex-1 gap-3 sm:gap-4"
                    >
                      <div className={`relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        t.hasUnread ? 'bg-[#6366F1]/10 text-[#6366F1]' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {t.hasUnread ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                        {t.hasUnread && (
                          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-[#6366F1] ring-2 ring-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`text-[13px] leading-tight sm:text-sm ${
                            t.hasUnread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                          }`}>
                            {t.lastMessage.from_name || t.lastMessage.from_email}
                          </p>
                          <span className="shrink-0 text-[10px] text-slate-400 sm:text-[11px]">
                            {timeAgo(t.lastMessage.created_at)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-[11px] text-slate-500 truncate sm:text-xs">
                          {t.lastMessage.from_email}
                        </p>
                        <p className="mt-1 line-clamp-1 text-[12px] font-medium text-slate-700 sm:text-[13px]">
                          {t.lastMessage.subject || '(Sans sujet)'}
                        </p>
                        <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500 sm:text-xs">
                          {t.lastMessage.direction === 'outbound' && (
                            <span className="text-slate-400">Vous : </span>
                          )}
                          {t.lastMessage.body_text?.slice(0, 120)}
                        </p>
                        <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                          <MessageSquare className="h-3 w-3" />
                          {t.messageCount} message{t.messageCount > 1 ? 's' : ''}
                          {t.lastMessage.status === 'closed' && (
                            <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                              <CheckCircle2 className="h-3 w-3" />
                              Résolu
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>

                    {/* Poubelle */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleDelete([t.thread_id]);
                      }}
                      disabled={deleting}
                      aria-label="Supprimer cette conversation"
                      className="shrink-0 self-start rounded-full p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}