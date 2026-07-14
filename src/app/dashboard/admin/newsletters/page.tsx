"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, Users, FileText, Megaphone } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";

export default function AdminNewslettersPage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [targetPlan, setTargetPlan] = useState("all");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      setStatus({ type: 'error', msg: 'Le titre et le contenu sont requis.' });
      return;
    }

    setIsSending(true);
    setStatus(null);

    try {
      const res = await fetch('/api/admin/newsletters/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content_html: content, // On envoie le texte brut, tu pourras ajouter un éditeur HTML plus tard
          target_plan: targetPlan 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: 'success', msg: data.message });
        setTitle("");
        setContent("");
      } else {
        setStatus({ type: 'error', msg: data.error || "Erreur lors de l'envoi" });
      }
    } catch (error) {
      setStatus({ type: 'error', msg: "Erreur réseau" });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
            <Megaphone className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Créer une Newsletter</h1>
            <p className="text-sm text-slate-400">Envoyez des mises à jour à vos utilisateurs</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="rounded-2xl border border-white/10 bg-[#0f0f1a] p-6 space-y-6">
          
          {/* Titre */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Sujet de l'email
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Nouvelle fonctionnalité disponible !"
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-all"
            />
          </div>

          {/* Destinataires */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Destinataires
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'free', label: 'Free' },
                { id: 'pro', label: 'Pro' },
                { id: 'premium', label: 'Premium' },
                { id: 'enterprise', label: 'Enterprise' }
              ].map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setTargetPlan(plan.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    targetPlan === plan.id
                      ? "bg-[#6366f1] text-white"
                      : "bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] border border-white/10"
                  }`}
                >
                  {plan.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Contenu (HTML supporté)
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez votre message ici... Vous pouvez utiliser des balises HTML comme <b>, <a>, <h1>."
              rows={12}
              className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-white outline-none focus:border-[#6366f1] transition-all resize-none font-mono text-sm"
            />
            <p className="text-xs text-slate-500 mt-2">
               Astuce : Pour un rendu pro, utilisez du HTML simple. Ex: <code className="bg-white/5 px-1 rounded">&lt;h1&gt;Titre&lt;/h1&gt;&lt;p&gt;Texte...&lt;/p&gt;</code>
            </p>
          </div>

          {/* Status & Bouton */}
          {status && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
              status.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {status.type === 'success' ? <CheckCircle2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              {status.msg}
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              onClick={handleSend}
              disabled={isSending || !title || !content}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-pink-500/20 hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Envoyer la Newsletter
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}