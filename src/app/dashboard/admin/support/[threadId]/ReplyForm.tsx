'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Send, Loader2, CheckCircle2 } from 'lucide-react';

interface ReplyFormProps {
  threadId: string;
  lastMessageId: string | null;
  clientEmail: string;
  defaultSubject: string;
}

export function ReplyForm({
  threadId,
  lastMessageId,
  clientEmail,
  defaultSubject,
}: ReplyFormProps) {
  const [body, setBody] = useState('');
  const [subject, setSubject] = useState(defaultSubject);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setSending(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/support/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId,
          subject,
          body,
          inReplyTo: lastMessageId,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        setError(json.error || 'Erreur lors de l\'envoi');
        setSending(false);
        return;
      }

      setSuccess(true);
      setBody('');
      setSending(false);
      router.refresh();
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError('Impossible d\'envoyer la réponse');
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
      <h3 className="mb-3 text-[13px] font-semibold text-slate-900 sm:text-sm">
        Répondre à {clientEmail}
      </h3>

      <div className="mb-3">
        <label className="mb-1 block text-[11px] font-medium text-slate-600 sm:text-xs">
          Sujet
        </label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="min-h-10 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:min-h-11 sm:text-sm"
        />
      </div>

      <div className="mb-3">
        <label className="mb-1 block text-[11px] font-medium text-slate-600 sm:text-xs">
          Message
        </label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          required
          placeholder="Écrivez votre réponse…"
          className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2.5 text-xs outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 sm:text-sm"
        />
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-700 sm:text-xs">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-2.5 text-[11px] text-emerald-700 sm:text-xs">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Réponse envoyée avec succès
        </div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={sending || !body.trim()}
          className="inline-flex items-center gap-2 rounded-full bg-[#6366F1] px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#5558e6] disabled:cursor-not-allowed disabled:opacity-50 sm:text-sm"
        >
          {sending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Envoi…
            </>
          ) : (
            <>
              <Send className="h-3.5 w-3.5" />
              Envoyer la réponse
            </>
          )}
        </button>
      </div>
    </form>
  );
}