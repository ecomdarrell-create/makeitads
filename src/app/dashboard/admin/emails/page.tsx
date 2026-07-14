"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Clock, User, Search, RefreshCw, Inbox, Loader2, Send, X, CheckCircle2 } from "lucide-react";
import PageTransition from "@/components/ui/PageTransition";

interface SupportEmail {
  id: string;
  from_email: string;
  to_email: string;
  subject: string;
  body_text: string;
  body_html?: string;
  received_at: string;
  status: string;
  priority: string;
}

export default function AdminEmailsPage() {
  const [emails, setEmails] = useState<SupportEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<SupportEmail | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // États pour la réponse
  const [replyText, setReplyText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/emails");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setEmails(data.emails || []);
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmails(); }, []);

  const handleSendReply = async () => {
    if (!selectedEmail || !replyText.trim()) return;
    
    setIsSending(true);
    try {
      const res = await fetch(`/api/admin/emails/${selectedEmail.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ replyContent: replyText }),
      });

      if (res.ok) {
        setShowSuccess(true);
        setReplyText("");
        setTimeout(() => setShowSuccess(false), 3000);
        fetchEmails(); // Rafraîchir la liste
      } else {
        alert("Erreur lors de l'envoi.");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur réseau.");
    } finally {
      setIsSending(false);
    }
  };

  const filteredEmails = emails.filter(
    (email) => email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
               email.from_email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString("fr-FR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <PageTransition>
      <div className="flex h-[calc(100vh-100px)] flex-col md:flex-row bg-[#080810] text-white rounded-2xl border border-white/10 overflow-hidden">
        
        {/* PANNEAU GAUCHE : LISTE */}
        <div className="w-full md:w-1/3 border-r border-white/10 flex flex-col bg-[#0a0a14]">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-bold flex items-center gap-2">
                <Inbox className="h-5 w-5 text-[#6366f1]" />
                Boîte de réception
              </h1>
              <button onClick={fetchEmails} className="p-2 rounded-lg hover:bg-white/5">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/[0.02] pl-10 pr-4 py-2 text-sm text-white outline-none focus:border-[#6366f1] placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-32"><Loader2 className="h-6 w-6 animate-spin text-[#6366f1]" /></div>
            ) : filteredEmails.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                <Inbox className="h-8 w-8 mb-2 opacity-50" />
                <p className="text-sm">Aucun email</p>
              </div>
            ) : (
              filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => { setSelectedEmail(email); setReplyText(""); setShowSuccess(false); }}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/[0.02] ${
                    selectedEmail?.id === email.id ? "bg-white/[0.05] border-l-2 border-l-[#6366f1]" : ""
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-white truncate flex-1">{email.from_email}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ml-2 ${email.status === 'unread' ? 'bg-[#6366f1]/20 text-[#a5b4fc]' : 'bg-white/5 text-slate-500'}`}>
                      {email.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-200 truncate font-medium">{email.subject}</p>
                  <p className="text-xs text-slate-500 truncate mt-1">{email.body_text?.substring(0, 50)}...</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* PANNEAU DROIT : DÉTAIL & RÉPONSE */}
        <div className="hidden md:flex flex-1 flex-col bg-[#080810]">
          {selectedEmail ? (
            <div className="flex flex-col h-full">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white mb-3">{selectedEmail.subject}</h2>
                <div className="flex items-center gap-4 text-sm text-slate-400">
                  <div className="flex items-center gap-1.5"><User className="h-4 w-4 text-[#6366f1]" /><span>{selectedEmail.from_email}</span></div>
                  <div className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-[#6366f1]" /><span>{formatDate(selectedEmail.received_at)}</span></div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
                  {selectedEmail.body_text}
                </div>
              </div>

              {/* ZONE DE RÉPONSE */}
              <div className="p-4 border-t border-white/10 bg-[#0a0a14]">
                <AnimatePresence>
                  {showSuccess && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-3 flex items-center gap-2 text-emerald-400 text-sm font-medium">
                      <CheckCircle2 className="h-4 w-4" /> Réponse envoyée avec succès !
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Écrivez votre réponse ici..."
                  className="w-full rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm text-white outline-none focus:border-[#6366f1] h-24 resize-none mb-3"
                />
                
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setReplyText("")} 
                    className="px-4 py-2 rounded-lg border border-white/10 text-sm text-slate-400 hover:bg-white/5 flex items-center gap-2"
                  >
                    <X className="h-4 w-4" /> Annuler
                  </button>
                  <button 
                    onClick={handleSendReply} 
                    disabled={!replyText.trim() || isSending}
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] text-sm font-medium text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-[#6366f1]/20"
                  >
                    {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    {isSending ? "Envoi..." : "Envoyer la réponse"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <Mail className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-lg font-medium">Sélectionnez un email</p>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}