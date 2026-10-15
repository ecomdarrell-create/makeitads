import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BackButton } from '@/components/ui/BackButton';
import { isAdmin } from '@/lib/admin';
import { Mail, User as UserIcon, Clock } from 'lucide-react';
import { ReplyForm } from './ReplyForm';

interface Props {
  params: Promise<{ threadId: string }>;
}

export default async function SupportThreadPage({ params }: Props) {
  const { threadId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  if (!isAdmin(user.email)) redirect('/dashboard');

  const { data: messages } = await supabase
    .from('support_messages')
    .select('*')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });

  if (!messages || messages.length === 0) notFound();

  // Marque les messages inbound comme lus
  const unreadIds = messages
    .filter((m) => m.direction === 'inbound' && !m.read_at)
    .map((m) => m.id);

  if (unreadIds.length > 0) {
    await supabase
      .from('support_messages')
      .update({ read_at: new Date().toISOString() })
      .in('id', unreadIds);
  }

  const lastMessage = messages[messages.length - 1];
  const firstMessage = messages[0];
  const clientEmail = firstMessage.from_email;
  const clientName = firstMessage.from_name || clientEmail;
  const subject = firstMessage.subject || '(Sans sujet)';

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      <BackButton href="/dashboard/admin/support" label="Retour à la liste" />

      {/* En-tête du fil */}
      <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#6366F1]/10 text-[#6366F1]">
            <UserIcon className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-sm font-semibold text-[#111827] sm:text-base">
              {clientName}
            </h1>
            <p className="mt-0.5 text-[11px] text-slate-500 sm:text-xs">
              {clientEmail}
            </p>
            <p className="mt-1 text-[12px] font-medium text-slate-700 sm:text-[13px]">
              {subject}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${
            lastMessage.status === 'open'
              ? 'bg-indigo-50 text-indigo-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}>
            {lastMessage.status === 'open' ? 'Ouvert' : 'Résolu'}
          </span>
        </div>
      </div>

      {/* Fil de discussion */}
      <div className="mb-4 space-y-3">
        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>

      {/* Formulaire de réponse */}
      <ReplyForm
        threadId={threadId}
        lastMessageId={lastMessage.message_id}
        clientEmail={clientEmail}
        defaultSubject={subject.startsWith('Re:') ? subject : `Re: ${subject}`}
      />
    </div>
  );
}

function MessageBubble({ message }: { message: any }) {
  const isOutbound = message.direction === 'outbound';

  return (
    <div className={`flex ${isOutbound ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
        isOutbound
          ? 'bg-[#6366F1] text-white'
          : 'bg-white border border-slate-200 text-slate-900'
      }`}>
        <div className={`mb-1 flex items-center gap-2 text-[10px] ${
          isOutbound ? 'text-white/70' : 'text-slate-400'
        }`}>
          <span>{isOutbound ? 'Vous' : (message.from_name || message.from_email)}</span>
          <span>·</span>
          <span>{formatDate(message.created_at)}</span>
        </div>
        <p className={`whitespace-pre-wrap text-[13px] leading-relaxed ${
          isOutbound ? 'text-white' : 'text-slate-700'
        }`}>
          {message.body_text || '(Message vide)'}
        </p>
      </div>
    </div>
  );
}

function formatDate(d: string): string {
  const date = new Date(d);
  return date.toLocaleString('fr-FR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}