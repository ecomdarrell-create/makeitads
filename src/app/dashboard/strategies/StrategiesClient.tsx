'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  Loader2,
  Calendar,
  Zap,
  FileText,
  ArrowRight,
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Strategy {
  id: string;
  title: string;
  type: string;
  platform: string | null;
  status: string;
  credits_cost: number;
  created_at: string;
}

interface Props {
  strategies: Strategy[];
}

type TypeFilter = 'all' | 'flash' | 'complete';
type SortOption = 'recent' | 'oldest' | 'title';

// ============================================
// COMPOSANT PRINCIPAL
// ============================================

export function StrategiesClient({ strategies }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [sort, setSort] = useState<SortOption>('recent');
  const [deleteTarget, setDeleteTarget] = useState<Strategy | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localStrategies, setLocalStrategies] = useState(strategies);

  // ─── Stats ───
  const stats = useMemo(() => {
    const flash = localStrategies.filter((s) => s.type === 'flash').length;
    const complete = localStrategies.filter((s) => s.type === 'complete').length;
    const totalCredits = localStrategies.reduce(
      (sum, s) => sum + (s.credits_cost || 0),
      0
    );
    return { flash, complete, totalCredits, total: localStrategies.length };
  }, [localStrategies]);

  // ─── Filtres + Tri ───
  const filtered = useMemo(() => {
    let result = [...localStrategies];

    // Recherche
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter((s) => s.title.toLowerCase().includes(q));
    }

    // Type
    if (typeFilter !== 'all') {
      result = result.filter((s) => s.type === typeFilter);
    }

    // Tri
    if (sort === 'recent') {
      result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sort === 'oldest') {
      result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sort === 'title') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [localStrategies, search, typeFilter, sort]);

  // ─── Suppression ───
  const handleDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setError(null);

    try {
      const res = await fetch(`/api/strategies/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        setLocalStrategies((prev) => prev.filter((s) => s.id !== deleteTarget.id));
        setDeleteTarget(null);
        router.refresh();
      } else {
        setError(data.error || 'Erreur lors de la suppression');
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setDeleting(false);
    }
  };

  // ─── Empty state ───
  if (localStrategies.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl border border-slate-200 bg-white p-8 sm:p-12"
      >
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6366F1]/10">
            <FileText className="h-6 w-6 text-[#6366F1]" />
          </div>
          <h2 className="mb-2 text-base font-semibold text-[#18181B]">
            Votre espace stratégique est prêt
          </h2>
          <p className="mb-6 text-xs leading-relaxed text-slate-500 sm:text-sm">
            Vous n&apos;avez encore créé aucune stratégie. Lancez votre premier
            diagnostic pour obtenir une analyse personnalisée de votre activité.
          </p>
          <Link
            href="/dashboard/generate"
            className="inline-flex items-center gap-1.5 rounded-full bg-[#6366F1] px-5 py-2.5 text-xs font-semibold text-white shadow-sm shadow-[#6366F1]/20 transition-colors hover:bg-[#5558e6]"
          >
            Créer ma première stratégie
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Total" value={String(stats.total)} />
        <StatCard
          label="Diagnostics"
          value={String(stats.flash)}
          hint="Flash"
        />
        <StatCard
          label="Stratégies"
          value={String(stats.complete)}
          hint="Complètes"
        />
      </div>

      {/* Recherche + Filtres */}
      <div className="rounded-xl border border-slate-200 bg-white p-3 sm:p-4">
        {/* Recherche */}
        <div className="relative mb-3">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom..."
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-9 text-xs outline-none transition-colors focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Filtres + Tri */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Chips de filtre */}
          <div className="flex flex-wrap items-center gap-1.5">
            <FilterChip
              active={typeFilter === 'all'}
              onClick={() => setTypeFilter('all')}
              label={`Tous (${localStrategies.length})`}
            />
            <FilterChip
              active={typeFilter === 'flash'}
              onClick={() => setTypeFilter('flash')}
              label={`Flash (${stats.flash})`}
            />
            <FilterChip
              active={typeFilter === 'complete'}
              onClick={() => setTypeFilter('complete')}
              label={`Complètes (${stats.complete})`}
            />
          </div>

          {/* Tri */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] text-slate-700 outline-none transition-colors focus:border-[#6366F1] focus:ring-2 focus:ring-[#6366F1]/20"
          >
            <option value="recent">Plus récentes</option>
            <option value="oldest">Plus anciennes</option>
            <option value="title">Titre (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {error}
        </div>
      )}

      {/* Liste */}
      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/40 p-8 text-center">
          <p className="text-xs text-slate-500">
            Aucune stratégie ne correspond à vos critères.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setTypeFilter('all');
            }}
            className="mt-3 text-[11px] font-semibold text-[#6366F1] hover:underline"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {filtered.map((strategy, index) => (
            <motion.div
              key={strategy.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.02 }}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white transition-all hover:border-[#6366F1]/30 hover:shadow-md"
            >
              <Link
                href={`/dashboard/strategies/${strategy.id}`}
                className="block p-4"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1.5 break-words text-sm font-semibold text-[#18181B] leading-snug">
                      {strategy.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                          strategy.type === 'flash'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-indigo-50 text-indigo-700'
                        }`}
                      >
                        {strategy.type === 'flash' ? (
                          <>
                            <Zap className="h-2.5 w-2.5" />
                            Diagnostic
                          </>
                        ) : (
                          <>
                            <FileText className="h-2.5 w-2.5" />
                            Complète
                          </>
                        )}
                      </span>
                      {strategy.platform && (
                        <span className="text-[10px] text-slate-500">
                          {strategy.platform}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-3 text-[10px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(strategy.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>
                      {strategy.credits_cost} crédit{strategy.credits_cost > 1 ? 's' : ''}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#6366F1]">
                    Voir
                    <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>

              {/* Bouton supprimer (apparaît au hover) */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setDeleteTarget(strategy);
                }}
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-lg bg-white/0 text-slate-300 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
                aria-label="Supprimer"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <AnimatePresence>
        {deleteTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !deleting && setDeleteTarget(null)}
              className="fixed inset-0 z-[300] bg-slate-900/40 backdrop-blur-sm"
            />
            <div className="fixed inset-0 z-[301] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
              >
                <div className="p-5">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                  </div>
                  <h3 className="mb-1.5 text-sm font-semibold text-[#18181B]">
                    Supprimer cette stratégie ?
                  </h3>
                  <p className="text-xs leading-relaxed text-slate-500">
                    Vous êtes sur le point de supprimer{' '}
                    <strong className="text-[#18181B]">
                      &laquo;&nbsp;{deleteTarget.title}&nbsp;&raquo;
                    </strong>
                    . Cette action est irréversible.
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 bg-slate-50/40 px-5 py-4">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(null)}
                    disabled={deleting}
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[#18181B] transition-colors hover:bg-slate-50 disabled:opacity-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Suppression
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-3.5 w-3.5" />
                        Supprimer
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// ============================================
// SOUS-COMPOSANTS
// ============================================

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-bold text-[#18181B]">{value}</p>
      {hint && <p className="mt-0.5 text-[10px] text-slate-400">{hint}</p>}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold transition-colors ${
        active
          ? 'border-[#6366F1] bg-[#6366F1]/10 text-[#6366F1]'
          : 'border-slate-200 bg-white text-slate-500 hover:bg-slate-50'
      }`}
    >
      {label}
    </button>
  );
}