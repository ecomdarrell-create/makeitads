"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2, Eye, X, Upload, Loader2, FileText, Clock, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase";
import { useSession } from "@/hooks/useSession";
import RichTextEditor from "@/components/RichTextEditor";
import Link from "next/link";

const supabase = createClient();
const CEO_EMAIL = "darrellkamga@gmail.com";

interface Category { id: string; name: string; color: string; icon: string; }
interface Post {
  id: string; title: string; subtitle: string; slug: string; description: string;
  content: string; cover_image: string; og_image: string; category_id: string;
  tags: string[]; status: string; featured: boolean; seo_title: string;
  seo_description: string; views: number; read_time: number;
  author_name: string; author_avatar: string; author_bio: string;
  published_at: string; updated_at: string; created_at: string;
  blog_categories?: Category;
}

export default function AdminInsightsPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useSession();
  
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPost, setCurrentPost] = useState<Partial<Post>>({
    title: '', subtitle: '', slug: '', description: '', content: '',
    cover_image: '', og_image: '', category_id: '', tags: [], status: 'draft',
    featured: false, seo_title: '', seo_description: '', read_time: 5,
    author_name: 'MakeItAds Team',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    author_bio: 'The official voice of MakeItAds.',
  });
  const [tagInput, setTagInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    if (!userLoading && user?.email !== CEO_EMAIL) router.push("/dashboard");
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user?.email === CEO_EMAIL) loadData();
  }, [user]);

  const loadData = async () => {
    const [postsRes, catsRes] = await Promise.all([
      supabase.from('blog_posts').select('*, blog_categories(id, name, color, icon)').order('created_at', { ascending: false }),
      supabase.from('blog_categories').select('id, name, color, icon').order('name'),
    ]);
    if (postsRes.data) setPosts(postsRes.data as Post[]);
    if (catsRes.data) setCategories(catsRes.data as Category[]);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const { error } = await supabase.storage.from('blog-images').upload(fileName, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('blog-images').getPublicUrl(fileName);
      setCurrentPost({ ...currentPost, cover_image: publicUrl, og_image: publicUrl });
    } catch (error) {
      alert("Erreur lors du téléchargement de l'image.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async () => {
    if (!currentPost.title || !currentPost.description || !currentPost.content) {
      alert('Remplis le titre, la description et le contenu.');
      return;
    }

    setLoading(true);
    try {
      const autoSlug = currentPost.slug || currentPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const postData = {
        ...currentPost,
        slug: autoSlug,
        updated_at: new Date().toISOString(),
        published_at: currentPost.status === 'published' ? new Date().toISOString() : null,
      };

      if (currentPost.id) {
        await supabase.from('blog_posts').update(postData).eq('id', currentPost.id);
      } else {
        const { data } = await supabase.from('blog_posts').insert(postData).select().single();
        if (currentPost.status === 'published' && data) {
          setPublishSuccess(true);
          setTimeout(() => {
            router.push(`/insights/${data.slug}`);
          }, 1500);
          return; // Redirection gérée, on sort
        }
      }
      
      await loadData();
      setIsEditing(false);
      setCurrentPost({ title: '', subtitle: '', slug: '', description: '', content: '', cover_image: '', og_image: '', category_id: '', tags: [], status: 'draft', featured: false, seo_title: '', seo_description: '', read_time: 5, author_name: 'MakeItAds Team', author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', author_bio: '' });
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Erreur lors de la sauvegarde');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Supprimer cet article définitivement ?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    await loadData();
  };

  if (userLoading || user?.email !== CEO_EMAIL) return <div className="min-h-screen flex items-center justify-center text-[#64748B]">Vérification...</div>;

  return (
    <div className="min-h-screen bg-[#FAFAFC] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#111827]">Insights Manager</h1>
            <p className="text-sm text-[#64748B] mt-1">Gère, rédige et publie tes articles (Accès CEO)</p>
          </div>
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 px-4 py-2 bg-[#6366f1] text-white rounded-lg text-sm font-medium hover:bg-[#5558e6] transition-colors shadow-sm">
            <Plus className="h-4 w-4" /> Nouvel Article
          </button>
        </div>

        {/* Liste des articles */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] overflow-hidden shadow-sm">
          {posts.length === 0 ? (
            <div className="p-12 text-center text-[#64748B]">
              <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="text-sm">Aucun article. Clique sur "Nouvel Article" pour commencer.</p>
            </div>
          ) : (
            <div className="divide-y divide-[#F1F5F9]">
              {posts.map((post) => (
                <div key={post.id} className="p-4 hover:bg-[#F9FAFB] transition-colors group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-[#111827] truncate group-hover:text-[#6366f1] transition-colors">{post.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1 ${post.status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {post.status === 'published' ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                          {post.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#64748B]">
                        <span>/{post.slug}</span>
                        {post.blog_categories && <span>• {post.blog_categories.icon} {post.blog_categories.name}</span>}
                        <span>• {post.views} vues</span>
                        <span>• {new Date(post.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link href={`/insights/${post.slug}`} target="_blank" className="p-2 hover:bg-[#F3F4F6] rounded-lg"><Eye className="h-4 w-4 text-[#64748B]" /></Link>
                      <button onClick={() => { setCurrentPost(post); setIsEditing(true); }} className="p-2 hover:bg-[#F3F4F6] rounded-lg"><Edit className="h-4 w-4 text-[#64748B]" /></button>
                      <button onClick={() => handleDelete(post.id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="h-4 w-4 text-red-600" /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Édition */}
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-xl w-full max-w-5xl my-8 shadow-2xl">
              <div className="sticky top-0 bg-white border-b border-[#E5E7EB] p-4 rounded-t-xl flex items-center justify-between z-10">
                <h2 className="text-lg font-bold text-[#111827]">{currentPost.id ? 'Modifier l\'article' : 'Nouvel article'}</h2>
                <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-[#F3F4F6] rounded-lg"><X className="h-5 w-5 text-[#64748B]" /></button>
              </div>

              <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
                {publishSuccess && (
                  <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Publié avec succès ! Redirection...
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Titre *</label>
                      <input type="text" value={currentPost.title || ''} onChange={(e) => setCurrentPost({ ...currentPost, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''), seo_title: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none text-lg font-semibold" placeholder="Titre de l'article" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Sous-titre</label>
                      <input type="text" value={currentPost.subtitle || ''} onChange={(e) => setCurrentPost({ ...currentPost, subtitle: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none text-sm" placeholder="Une phrase d'accroche" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Description courte (SEO) *</label>
                      <textarea value={currentPost.description || ''} onChange={(e) => setCurrentPost({ ...currentPost, description: e.target.value, seo_description: e.target.value })} rows={2} className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none resize-none text-sm" placeholder="Résumé pour les moteurs de recherche..." />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Contenu *</label>
                      <RichTextEditor content={currentPost.content || ''} onChange={(content: string) => setCurrentPost({ ...currentPost, content })} />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Image de couverture</label>
                      <div className="flex gap-2 items-start">
                        <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-dashed border-[#6366f1] bg-[#EEF2FF] text-[#6366f1] text-xs font-medium cursor-pointer hover:bg-[#E0E7FF] transition-colors">
                          {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                          {uploadingImage ? 'Upload...' : 'Uploader'}
                          <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploadingImage} />
                        </label>
                        {currentPost.cover_image && <button onClick={() => setCurrentPost({ ...currentPost, cover_image: '', og_image: '' })} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><X className="h-4 w-4" /></button>}
                      </div>
                      {currentPost.cover_image && <div className="mt-2 relative h-32 rounded-lg overflow-hidden border border-[#E5E7EB]"><img src={currentPost.cover_image} alt="Preview" className="w-full h-full object-cover" /></div>}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Catégorie *</label>
                      <select value={currentPost.category_id || ''} onChange={(e) => setCurrentPost({ ...currentPost, category_id: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none text-sm bg-white">
                        <option value="">Sélectionner...</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Statut</label>
                      <select value={currentPost.status || 'draft'} onChange={(e) => setCurrentPost({ ...currentPost, status: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-[#E5E7EB] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none text-sm bg-white">
                        <option value="draft">Brouillon</option>
                        <option value="published">Publié</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#111827] mb-1">Tags</label>
                      <div className="flex gap-2 mb-2">
                        <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), setCurrentPost({ ...currentPost, tags: [...(currentPost.tags || []), tagInput.trim()] }), setTagInput(''))} className="flex-1 px-3 py-2 rounded-lg border border-[#E5E7EB] focus:border-[#6366f1] focus:ring-2 focus:ring-[#6366f1]/20 outline-none text-sm" placeholder="Tag..." />
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(currentPost.tags || []).map((tag: string) => (
                          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-[#EEF2FF] text-[#6366f1] text-xs">
                            {tag}
                            <button onClick={() => setCurrentPost({ ...currentPost, tags: currentPost.tags?.filter((t: string) => t !== tag) })} className="hover:text-red-500"><X className="h-3 w-3" /></button>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sticky bottom-0 bg-white border-t border-[#E5E7EB] p-4 rounded-b-xl flex justify-end gap-2">
                <button onClick={() => setIsEditing(false)} className="px-4 py-2 rounded-lg border border-[#E5E7EB] text-[#475569] text-sm font-medium hover:bg-[#F9FAFB]">Annuler</button>
                <button onClick={handleSave} disabled={loading} className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[#6366f1] text-white text-sm font-medium hover:bg-[#5558e6] disabled:opacity-50 shadow-sm">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sauvegarder'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}