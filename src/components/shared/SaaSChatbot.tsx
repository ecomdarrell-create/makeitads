'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { Bot, LoaderCircle, MessageCircle, Send, X } from 'lucide-react';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

const suggestedQuestions = [
  'Quel plan choisir selon mes besoins ?',
  'Comment fonctionnent les crédits ?',
  'Comment obtenir une stratégie personnalisée ?',
  'MakeItAds délivre-t-il une certification SQL ?',
];

export default function SaaSChatbot({ dashboard = false }: { dashboard?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Bonjour, je peux vous aider à choisir un plan, comprendre les crédits ou préparer votre première stratégie.' },
  ]);
  const messageListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && messageListRef.current) {
      messageListRef.current.scrollTo({ top: messageListRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || loading) return;

    const updatedMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(updatedMessages);
    setInput('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages.slice(-8) }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'La réponse est indisponible.');
      }
      
      setMessages((current) => [...current, { role: 'assistant', content: result.answer }]);
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

  return (
    <div className={`fixed right-4 z-[70] sm:right-6 ${dashboard ? 'bottom-20 md:bottom-6' : 'bottom-5'}`}>
      {isOpen && (
        <section aria-label="Assistant MakeItAds" className="mb-3 flex h-[min(70vh,520px)] w-[min(360px,calc(100vw-32px))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.2)]">
          <header className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Assistant MakeItAds</p>
                <p className="text-[10px] text-slate-500">Conseils sur la plateforme</p>
              </div>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} aria-label="Fermer le chat" className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900">
              <X className="h-4 w-4" />
            </button>
          </header>

          <div ref={messageListRef} className="flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-3" aria-live="polite">
            {messages.map((message, index) => (
              <div key={`${index}-${message.role}`} className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2.5 text-xs leading-relaxed ${message.role === 'user' ? 'ml-auto rounded-br-md bg-indigo-600 text-white' : 'mr-auto rounded-bl-md border border-slate-200 bg-white text-slate-700'}`}>
                {message.content}
              </div>
            ))}
            {loading && <div className="flex items-center gap-2 text-xs text-slate-500"><LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Réponse en cours…</div>}
            {error && <p role="alert" className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-[11px] text-rose-700">{error}</p>}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {suggestedQuestions.map((question) => (
                  <button key={question} type="button" onClick={() => void sendMessage(question)} className="rounded-full border border-indigo-100 bg-white px-2.5 py-1.5 text-left text-[10px] leading-tight text-indigo-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50">
                    {question}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-100 bg-white p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              maxLength={1200}
              placeholder="Écrivez votre question…"
              aria-label="Votre question"
              className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-indigo-400"
            />
            <button type="submit" disabled={!input.trim() || loading} aria-label="Envoyer" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300">
              <Send className="h-4 w-4" />
            </button>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-label={isOpen ? 'Fermer l’assistant' : 'Ouvrir l’assistant MakeItAds'}
        aria-expanded={isOpen}
        className="ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-900/20 transition-transform hover:scale-105 hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        {isOpen ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </button>
    </div>
  );
}