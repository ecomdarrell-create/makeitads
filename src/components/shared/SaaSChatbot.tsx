'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LoaderCircle,
  X,
  ArrowLeft,
  Zap,
  CreditCard,
  TrendingUp,
  Users,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { SUGGESTED_QUESTIONS } from '@/config/chatbot-faq.config';

type ChatMessage = { role: 'user' | 'assistant'; content: string };
type View = 'home' | 'chat';

interface QuickAction {
  id: string;
  icon: typeof Zap;
  title: string;
  subtitle: string;
  color: string;
  bg: string;
  question: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    id: 'plans',
    icon: CreditCard,
    title: 'Choisir un plan',
    subtitle: 'Comparer les 4 formules',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50',
    question: 'Quel plan choisir selon mes besoins ?',
  },
  {
    id: 'credits',
    icon: Zap,
    title: 'Comprendre les crédits',
    subtitle: 'Comment ça marche',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    question: 'Comment fonctionnent les crédits ?',
  },
  {
    id: 'generate',
    icon: TrendingUp,
    title: 'Générer une stratégie',
    subtitle: 'Guide étape par étape',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    question: 'Comment générer une stratégie ?',
  },
  {
    id: 'support',
    icon: Users,
    title: 'Contacter le support',
    subtitle: 'Parler à un humain',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    question: 'Comment contacter le support ?',
  },
];

function cleanResponse(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\*/g, '');
}

export default function SaaSChatbot({ dashboard = false }: { dashboard?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>('home');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageError, setImageError] = useState(false);
  const [firstName, setFirstName] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Bonjour, je suis Gisèle, votre assistante MakeItAds.\n\nJe peux t'aider à :\n\n• Choisir ton plan\n• Comprendre les crédits\n• Générer ta première stratégie\n• Contacter le support\n\nQue veux-tu savoir ?",
    },
  ]);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Charger le prénom de l'utilisateur
  useEffect(() => {
    const loadName = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('first_name')
          .eq('id', user.id)
          .maybeSingle();

        const name = profile?.first_name || user.email?.split('@')[0] || null;
        if (name) {
          setFirstName(name);
          setMessages([
            {
              role: 'assistant',
              content: `Bonjour ${name}, je suis Gisèle, ton assistante MakeItAds.\n\nJe peux t'aider à :\n\n• Choisir ton plan\n• Comprendre les crédits\n• Générer ta première stratégie\n• Contacter le support\n\nQue veux-tu savoir ?`,
            },
          ]);
        }
      } catch (e) {
        console.warn('Impossible de charger le prénom:', e);
      }
    };
    loadName();
  }, []);

  useEffect(() => {
    if (isOpen && view === 'chat' && messageListRef.current) {
      messageListRef.current.scrollTo({
        top: messageListRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, isOpen, view]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    const updatedMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', content: trimmed },
    ];
    setMessages(updatedMessages);
    setInput('');
    setError('');
    setLoading(true);
    setView('chat');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.slice(-8),
          firstName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'La réponse est indisponible.');
      }

      setMessages((current) => [
        ...current,
        { role: 'assistant', content: cleanResponse(result.answer) },
      ]);
    } catch (sendError: any) {
      console.error('Erreur frontend chat:', sendError);
      setError(sendError.message || 'La réponse est indisponible.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const resetChat = () => {
    setView('home');
    setMessages([
      {
        role: 'assistant',
        content: firstName
          ? `Bonjour ${firstName}. Comment puis-je t'aider ?`
          : "Bonjour, je suis Gisèle. Comment puis-je t'aider ?",
      },
    ]);
    setInput('');
    setError('');
  };

  return (
    <div
      className={`fixed right-4 z-[70] sm:right-6 ${
        dashboard ? 'bottom-24 md:bottom-6' : 'bottom-5'
      }`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            aria-label="Assistante MakeItAds"
            className="mb-3 flex h-[min(68vh,540px)] w-[min(380px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.25)]"
          >
            {/* HEADER */}
            <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] ring-2 ring-white shadow-sm">
                    {!imageError ? (
                      <Image
                        src="/images/gisele.jpg"
                        alt="Gisèle"
                        fill
                        className="object-cover"
                        sizes="40px"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <span className="text-sm font-bold text-white">G</span>
                      </div>
                    )}
                  </div>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Gisèle</p>
                  <p className="flex items-center gap-1 text-[10px] text-slate-500">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    En ligne
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Fermer le chat"
                className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {/* VUE HOME */}
            {view === 'home' && (
              <div className="flex-1 overflow-y-auto">
                {/* Hero en violet avec texte blanc */}
                <div className="relative overflow-hidden bg-gradient-to-br from-[#6366F1] via-[#6366F1] to-[#8B5CF6] p-5">
                  <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
                  <div className="absolute -bottom-14 -left-8 h-32 w-32 rounded-full bg-white/5" />

                  <div className="relative">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-white/90">
                      Gisèle · Assistante MakeItAds
                    </p>
                    <h2 className="mt-2 text-lg font-bold leading-snug text-white">
                      Bonjour {firstName || ''} 👋
                      <br />
                      Comment puis-je t&apos;aider ?
                    </h2>
                    <p className="mt-2 text-[11px] leading-relaxed text-white/95">
                      Je t&apos;accompagne sur les plans, les crédits, la génération de stratégies et tout ce qui concerne la plateforme.
                    </p>
                  </div>
                </div>

                {/* Actions rapides */}
                <div className="p-4">
                  <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Suggestions rapides
                  </p>

                  <div className="space-y-2">
                    {QUICK_ACTIONS.map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.id}
                          type="button"
                          onClick={() => void sendMessage(action.question)}
                          className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 text-left transition-all hover:-translate-y-0.5 hover:border-[#6366F1]/30 hover:shadow-sm"
                        >
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${action.bg} ${action.color}`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-[#18181B]">{action.title}</p>
                            <p className="text-[10px] text-slate-500">{action.subtitle}</p>
                          </div>
                          <ArrowLeft className="h-3.5 w-3.5 rotate-180 text-slate-300 transition-colors group-hover:text-[#6366F1]" />
                        </button>
                      );
                    })}
                  </div>

                  <p className="mb-2.5 mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Questions fréquentes
                  </p>

                  <div className="flex flex-wrap gap-1.5">
                    {SUGGESTED_QUESTIONS.slice(0, 6).map((question) => (
                      <button
                        key={question}
                        type="button"
                        onClick={() => void sendMessage(question)}
                        className="rounded-full border border-slate-200 bg-white px-2.5 py-1.5 text-left text-[10px] font-medium leading-tight text-slate-700 transition-colors hover:border-[#6366F1] hover:bg-indigo-50 hover:text-[#6366F1]"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* VUE CHAT */}
            {view === 'chat' && (
              <>
                <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/60 px-3 py-2">
                  <button
                    type="button"
                    onClick={resetChat}
                    className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-semibold text-slate-600 transition-colors hover:bg-white hover:text-[#6366F1]"
                  >
                    <ArrowLeft className="h-3 w-3" />
                    Retour
                  </button>
                  <span className="text-[10px] text-slate-400">
                    Conversation avec Gisèle
                  </span>
                </div>

                <div
                  ref={messageListRef}
                  className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-3"
                  aria-live="polite"
                >
                  {messages.map((message, index) => (
                    <div key={`${index}-${message.role}`} className="flex items-start gap-2">
                      {message.role === 'assistant' && (
                        <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] ring-1 ring-slate-200">
                          {!imageError ? (
                            <Image
                              src="/images/gisele.jpg"
                              alt="Gisèle"
                              fill
                              className="object-cover"
                              sizes="28px"
                              onError={() => setImageError(true)}
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <span className="text-[10px] font-bold text-white">G</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div
                        className={`max-w-[82%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${
                          message.role === 'user'
                            ? 'ml-auto rounded-br-md bg-[#6366F1] text-white shadow-sm shadow-indigo-200'
                            : 'rounded-bl-md border border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[#6366F1]" />
                      Gisèle répond…
                    </div>
                  )}

                  {error && (
                    <p
                      role="alert"
                      className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700"
                    >
                      {error}
                    </p>
                  )}
                </div>
              </>
            )}

            {/* FORMULAIRE */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 border-t border-slate-100 bg-white p-3"
            >
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                maxLength={1200}
                placeholder="Écris ta question…"
                aria-label="Votre question"
                className="min-w-0 flex-1 rounded-full border border-slate-200 bg-slate-50/60 px-4 py-2 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#6366F1] focus:bg-white"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Envoyer"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#6366F1] text-white transition-colors hover:bg-[#5558e6] disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      {/* BOUTON FLOTTANT */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? "Fermer l'assistante" : "Ouvrir l'assistante MakeItAds"}
        aria-expanded={isOpen}
        className="relative ml-auto flex h-14 w-14 items-center justify-center overflow-visible rounded-full bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white shadow-lg shadow-indigo-900/25 transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6366F1]"
      >
        {/* Photo Gisèle */}
        <span className="relative block h-full w-full overflow-hidden rounded-full">
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex h-full w-full items-center justify-center"
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="relative h-full w-full"
              >
                {!imageError ? (
                  <Image
                    src="/images/gisele.jpg"
                    alt="Gisèle"
                    fill
                    className="object-cover"
                    sizes="56px"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <span className="text-lg font-bold text-white">G</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </span>

        {/* Badge rouge — BEAUCOUP plus visible */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 z-20 flex h-6 w-6 items-center justify-center rounded-full border-[3px] border-white bg-rose-500 text-[11px] font-bold text-white shadow-lg shadow-rose-500/40">
            <span className="absolute inset-0 animate-ping rounded-full bg-rose-500 opacity-60" />
            <span className="relative">1</span>
          </span>
        )}
      </button>
    </div>
  );
}