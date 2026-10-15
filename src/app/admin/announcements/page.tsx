"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Plus,
  X,
  Send,
  Save,
  Loader2,
  Trash2,
  ArrowLeft,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { isAdmin, ADMIN_EMAIL } from "@/lib/admin";

interface Announcement {
  id: string;
  title: string;
  message: string;
  category: string;
  target_segment: string;
  status: "draft" | "published";
  action_label: string | null;
  action_path: string | null;
  published_at: string | null;
  expires_at: string | null;
  created_at: string;
}

const CATEGORIES = [
  { value: "feature", label: "Nouveauté" },
  { value: "credits", label: "Crédits" },
  { value: "account", label: "Compte" },
  { value: "system", label: "Système" },
];

const SEGMENTS = [
  { value: "all", label: "Tous les utilisateurs" },
  { value: "free", label: "Utilisateurs Free" },
  { value: "pro", label: "Utilisateurs Pro" },
  { value: "premium", label: "Utilisateurs Premium" },
  { value: "elite", label: "Utilisateurs Elite" },
];

export default function AdminAnnouncementsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Formulaire
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("feature");
  const [targetSegment, setTargetSegment] = useState("all");
  const [actionLabel, setActionLabel] = useState("");
  const [actionPath, setActionPath] = useState("");

  // Garde admin
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login");
      return;
    }
    if (!isAdmin(user.email)) {
      router.replace("/dashboard");
    }
  }, [user, authLoading, router]);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });
    setAnnouncements((data ?? []) as Announcement[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && isAdmin(user.email)) fetchAnnouncements();
  }, [user, fetchAnnouncements]);

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setCategory("feature");
    setTargetSegment("all");
    setActionLabel("");
    setActionPath("");
    setError("");
  };

  const handleSubmit = async (status: "draft" | "published") => {
    setError("");
    setSuccess("");

    if (!title.trim() || !message.trim()) {
      setError("Titre et message sont obligatoires.");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const { error: insertError } = await supabase
        .from("announcements")
        .insert({
          title: title.trim(),
          message: message.trim(),
          category,
          target_segment: targetSegment,
          action_label: actionLabel.trim() || null,
          action_path: actionPath.trim() || null,
          status,
          published_at: status === "published" ? new Date().toISOString() : null,
          created_by: user?.id ?? null,
        });

      if (insertError) throw insertError;

      setSuccess(
        status === "published"
          ? "Annonce publiée. Les utilisateurs ciblés viennent de la recevoir."
          : "Brouillon sauvegardé."
      );
      resetForm();
      setShowForm(false);
      fetchAnnouncements();
      setTimeout(() => setSuccess(""), 4000);
    } catch {
      setError("Impossible de créer l'annonce. Réessayez.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette annonce ? Les notifications déjà envoyées resteront visibles par les users.")) return;
    const supabase = createClient();
    await supabase.from("announcements").delete().eq("id", id);
    fetchAnnouncements();
  };

  if (authLoading || !user || !isAdmin(user.email)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="animate-pulse text-sm text-slate-400">Vérification…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-16">
      <div className="mx-auto max-w-4xl px-4 pt-6 sm:px-6 sm:pt-10">
        <Link
          href="/dashboard"
          className="mb-5 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-[#6366F1] sm:text-sm"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Retour au dashboard
        </Link>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-slate-900 sm:text-2xl">
              Annonces
            </h1>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Publiez des annonces à vos utilisateurs (nouveautés, améliorations, etc.).
            </p>
          </div>
          <button
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#6366f1]/20 transition-colors hover:bg-[#5558e6] sm:text-sm"
          >
            {showForm ? (
              <>
                <X className="h-3.5 w-3.5" />
                Annuler
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5" />
                Nouvelle annonce
              </>
            )}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 sm:text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 sm:text-sm">
            {success}
          </div>
        )}

        {/* Formulaire */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-5 overflow-hidden"
            >
              <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_2px_12px_rgba(15,23,42,0.04)] sm:p-5">
                <div className="space-y-3.5">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700 sm:text-sm">
                      Titre
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Ex: Découvrez notre nouvelle fonctionnalité"
                      className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-medium text-slate-700 sm:text-sm">
                      Message
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                      placeholder="Présentez brièvement la nouveauté et son bénéfice…"
                      className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700 sm:text-sm">
                        Catégorie
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c.value} value={c.value}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700 sm:text-sm">
                        Segment cible
                      </label>
                      <select
                        value={targetSegment}
                        onChange={(e) => setTargetSegment(e.target.value)}
                        className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
                      >
                        {SEGMENTS.map((s) => (
                          <option key={s.value} value={s.value}>
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700 sm:text-sm">
                        Label d&apos;action (optionnel)
                      </label>
                      <input
                        type="text"
                        value={actionLabel}
                        onChange={(e) => setActionLabel(e.target.value)}
                        placeholder="Ex: Découvrir la fonctionnalité"
                        className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-slate-700 sm:text-sm">
                        Path d&apos;action (optionnel)
                      </label>
                      <input
                        type="text"
                        value={actionPath}
                        onChange={(e) => setActionPath(e.target.value)}
                        placeholder="Ex: /dashboard/generate"
                        className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => handleSubmit("draft")}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:opacity-50 sm:text-sm"
                    >
                      <Save className="h-3.5 w-3.5" />
                      Sauvegarder en brouillon
                    </button>
                    <button
                      onClick={() => handleSubmit("published")}
                      disabled={saving}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white shadow-md shadow-[#6366f1]/20 transition-colors hover:bg-[#5558e6] disabled:opacity-50 sm:text-sm"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          Publication…
                        </>
                      ) : (
                        <>
                          <Send className="h-3.5 w-3.5" />
                          Publier maintenant
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Liste */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_2px_12px_rgba(15,23,42,0.04)]">
          {loading ? (
            <div className="space-y-3 p-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="animate-pulse rounded-xl bg-slate-50 p-4">
                  <div className="h-3 w-1/2 rounded bg-slate-100" />
                  <div className="mt-2 h-2 w-full rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : announcements.length === 0 ? (
            <div className="px-4 py-14 text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
                <Megaphone className="h-6 w-6 text-slate-400" />
              </div>
              <p className="text-sm font-semibold text-slate-900 sm:text-base">
                Aucune annonce
              </p>
              <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm">
                Créez votre première annonce pour informer vos utilisateurs.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {announcements.map((a) => (
                <li key={a.id} className="flex gap-3 px-4 py-4 sm:gap-4 sm:px-5">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
                      a.status === "published"
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    <Megaphone className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={2.4} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[13px] font-semibold text-slate-900 sm:text-sm">
                        {a.title}
                      </p>
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          a.status === "published"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {a.status === "published" ? "Publiée" : "Brouillon"}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-[13px]">
                      {a.message}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-slate-400 sm:text-[11px]">
                      <span>Segment : {SEGMENTS.find((s) => s.value === a.target_segment)?.label ?? a.target_segment}</span>
                      <span>•</span>
                      <span>
                        {a.published_at
                          ? `Publiée le ${new Date(a.published_at).toLocaleDateString("fr-FR")}`
                          : `Créée le ${new Date(a.created_at).toLocaleDateString("fr-FR")}`}
                      </span>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="ml-auto inline-flex items-center gap-1 text-rose-500 transition-colors hover:text-rose-700"
                      >
                        <Trash2 className="h-3 w-3" />
                        Supprimer
                      </button>
                    </div>
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