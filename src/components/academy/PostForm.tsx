'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Loader2, Upload, X, Save, Send, Check, Copy, Code2, FileText,
} from 'lucide-react';
import { AcademyEditor } from './AcademyEditor';
import { slugify } from '@/lib/academy/helpers';
import {
  CATEGORY_LABELS, type BlogCategory, type BlogPost, type BlogStatus,
} from '@/lib/academy/types';

interface Props {
  initial?: BlogPost | null;
}

type EditorMode = 'visual' | 'html';

export function PostForm({ initial }: Props) {
  const router = useRouter();
  const isEdit = !!initial;

  const [title, setTitle] = useState(initial?.title || '');
  const [slug, setSlug] = useState(initial?.slug || '');
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const [excerpt, setExcerpt] = useState(initial?.excerpt || '');
  const [content, setContent] = useState(initial?.content || '');
  const [coverUrl, setCoverUrl] = useState<string | null>(initial?.cover_url || null);
  const [category, setCategory] = useState<BlogCategory>(initial?.category || 'tactiques');
  const [tagsInput, setTagsInput] = useState((initial?.tags || []).join(', '));
  const [authorName, setAuthorName] = useState(initial?.author_name || 'Équipe MakeItAds');
  const [metaTitle, setMetaTitle] = useState(initial?.meta_title || '');
  const [metaDescription, setMetaDescription] = useState(initial?.meta_description || '');
  const [editorMode, setEditorMode] = useState<EditorMode>('visual');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slugTouched && title) setSlug(slugify(title));
  }, [title, slugTouched]);

  const uploadCover = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/academy/upload-cover', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.url) setCoverUrl(data.url);
      else setError(data.error || "Erreur d'upload");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (status: BlogStatus) => {
    setError('');
    setSuccess('');
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setError('Titre, extrait et contenu sont obligatoires.');
      return;
    }
    setSaving(true);
    try {
      const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);
      const payload = {
        title: title.trim(),
        slug: (slug || slugify(title)).trim(),
        excerpt: excerpt.trim(),
        content,
        cover_url: coverUrl,
        category,
        tags,
        status,
        author_name: authorName.trim() || 'Équipe MakeItAds',
        meta_title: metaTitle.trim() || null,
        meta_description: metaDescription.trim() || null,
      };

      const url = isEdit ? `/api/academy/${initial!.id}` : '/api/academy';
      const method = isEdit ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur');

      setSuccess(status === 'published' ? 'Article publié.' : 'Brouillon sauvegardé.');
      if (!isEdit && data.post?.id) {
        router.push(`/admin/academy/${data.post.id}`);
      } else {
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || 'Erreur serveur');
    } finally {
      setSaving(false);
    }
  };

  const copyForTelegram = async () => {
    const url = `https://makeitads.pro/insights/${slug}`;
    const msg = `📚 Nouvel article Academy :\n${title}\n\n${excerpt}\n\n👉 Lire l'article : ${url}`;
    try {
      await navigator.clipboard.writeText(msg);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* silencieux */ }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">{error}</div>
      )}
      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700">{success}</div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <label className="mb-1 block text-xs font-medium text-slate-700">Titre *</label>
        <input
          type="text" value={title} onChange={(e) => setTitle(e.target.value)}
          className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Ex : Comment réduire votre coût d'acquisition en 2026"
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <label className="mb-1 block text-xs font-medium text-slate-700">Slug (URL)</label>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">/insights/</span>
          <input
            type="text" value={slug}
            onChange={(e) => { setSlug(slugify(e.target.value)); setSlugTouched(true); }}
            className="min-h-10 flex-1 rounded-xl border border-slate-200 px-3 py-2 font-mono text-xs outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="mon-article"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <label className="mb-1 block text-xs font-medium text-slate-700">Extrait (150-200 caractères) *</label>
        <textarea
          value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={2}
          maxLength={250}
          className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          placeholder="Résumé court qui apparaît sur les cards et dans Google"
        />
        <p className="mt-1 text-[10px] text-slate-400">{excerpt.length}/250</p>
      </div>

      {/* ✅ CONTENU avec toggle visuel / HTML brut */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="text-xs font-medium text-slate-700">Contenu *</label>
          <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-0.5">
            <button
              type="button"
              onClick={() => setEditorMode('visual')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                editorMode === 'visual'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <FileText className="h-3 w-3" />
              Éditeur visuel
            </button>
            <button
              type="button"
              onClick={() => setEditorMode('html')}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium transition-colors ${
                editorMode === 'html'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Code2 className="h-3 w-3" />
              HTML brut
            </button>
          </div>
        </div>

        {editorMode === 'visual' ? (
          <AcademyEditor value={content} onChange={setContent} />
        ) : (
          <div>
            <p className="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-relaxed text-amber-800">
              ⚠️ Mode HTML brut : collez votre code HTML directement. Il sera sauvegardé{' '}
              <strong>tel quel</strong> sans transformation. Idéal pour préserver les balises
              &lt;h2&gt;, &lt;blockquote&gt;, &lt;strong&gt; et les styles premium.
            </p>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              spellCheck={false}
              placeholder={`<p>Votre premier paragraphe…</p>\n\n<h2>Un titre de section</h2>\n\n<p>Du contenu avec <strong>du gras</strong> et un <a href="/signup">lien</a>.</p>`}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-[12px] leading-relaxed text-slate-800 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>{content.length} caractères</span>
              <span>
                Balises détectées :{' '}
                {['h2', 'h3', 'p', 'ul', 'ol', 'blockquote', 'strong', 'em', 'a'].filter((tag) =>
                  content.includes(`<${tag}`)
                ).join(', ') || '—'}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <label className="mb-2 block text-xs font-medium text-slate-700">Image de couverture (16:9)</label>
        {coverUrl ? (
          <div className="relative aspect-[16/9] w-full max-w-md overflow-hidden rounded-xl border border-slate-200">
            <Image src={coverUrl} alt="Couverture" fill className="object-cover" />
            <button
              type="button" onClick={() => setCoverUrl(null)}
              className="absolute right-2 top-2 rounded-full bg-white/90 p-1.5 text-slate-700 shadow hover:bg-white"
            ><X className="h-3.5 w-3.5" /></button>
          </div>
        ) : (
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-8 text-xs text-slate-500 hover:border-[#6366F1] hover:text-[#6366F1]">
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? 'Upload…' : 'Cliquer pour uploader (max 5 Mo)'}
            <input
              type="file" accept="image/jpeg,image/png,image/webp,image/avif"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadCover(f); }}
            />
          </label>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <label className="mb-1 block text-xs font-medium text-slate-700">Catégorie</label>
          <select
            value={category} onChange={(e) => setCategory(e.target.value as BlogCategory)}
            className="min-h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
          >
            {(Object.keys(CATEGORY_LABELS) as BlogCategory[]).map((k) => (
              <option key={k} value={k}>{CATEGORY_LABELS[k]}</option>
            ))}
          </select>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
          <label className="mb-1 block text-xs font-medium text-slate-700">Tags (séparés par virgule)</label>
          <input
            type="text" value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
            className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
            placeholder="facebook ads, ciblage, budget"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <label className="mb-1 block text-xs font-medium text-slate-700">Auteur</label>
        <input
          type="text" value={authorName} onChange={(e) => setAuthorName(e.target.value)}
          className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
        />
      </div>

      <details className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <summary className="cursor-pointer text-xs font-medium text-slate-700">SEO (optionnel)</summary>
        <div className="mt-3 space-y-3">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">Meta title (max 60)</label>
            <input
              type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)}
              maxLength={70}
              className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder={title || 'Titre par défaut'}
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-600">Meta description (max 160)</label>
            <textarea
              value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)}
              rows={2} maxLength={180}
              className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500"
              placeholder={excerpt || 'Description par défaut'}
            />
          </div>
        </div>
      </details>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        {isEdit && initial?.status === 'published' && (
          <button
            type="button" onClick={copyForTelegram}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copié' : 'Copier pour Telegram'}
          </button>
        )}
        <button
          type="button" onClick={() => submit('draft')} disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
        >
          <Save className="h-3.5 w-3.5" /> Brouillon
        </button>
        <button
          type="button" onClick={() => submit('published')} disabled={saving}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#6366F1] px-4 py-2 text-xs font-semibold text-white hover:bg-[#5558e6] disabled:opacity-50"
        >
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          {saving ? 'Enregistrement…' : isEdit && initial?.status === 'published' ? 'Mettre à jour' : 'Publier'}
        </button>
      </div>
    </div>
  );
}