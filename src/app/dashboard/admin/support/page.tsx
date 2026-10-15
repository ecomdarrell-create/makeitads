import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { BackButton } from '@/components/ui/BackButton';
import { isAdmin } from '@/lib/admin';
import { Mail, MailOpen, MessageSquare, CheckCircle2, Clock } from 'lucide-react';

interface ThreadSummary {
  thread_id: string;
  lastMessage: {
    id: string;
    from_email: string;
    from_name: string | null;
    subject: string | null;
    body_text: string | null;
    direction: string;
    created_at: string;
    status: string;
    read_at: string | null;
  };
  messageCount: number;
  hasUnread: boolean;
}

export default async function SupportListPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  if (!isAdmin(user.email)) redirect('/dashboard');

  // Récupère tous les messages, du plus récent au plus ancien
  const { data: messages } = await supabase
    .from('support_messages')
    .select('id, thread_id, from_email, from_name, subject, body_text, direction, created_at, status, read_at')
    .order('created_at', { ascending: false });

  // Groupe par thread_id
  const threadsMap = new Map<string, ThreadSummary>();
  for (const m of messages ?? []) {
    const tid = m.thread_id || m.id;
    if (!threadsMap.has(tid)) {
      threadsMap.set(tid, {
        thread_id: tid,
        lastMessage: m,
        messageCount: 1,
        hasUnread: m.direction === 'inbound' && !m.read_at,
      });
    } else {
      const t = threadsMap.get(tid)!;
      t.messageCount++;
      if (m.direction === 'inbound' && !m.read_at) t.hasUnread = true;
    }
  }

  const threads = Array.from(threadsMap.values());

  return (
    <div className="px-3 py-4 sm:px-6 sm:py-6 max-w-4xl mx-auto">
      <BackButton href="/dashboard/settings" label="Retour aux paramètres" />

      <div className="mb-4 flex items-start gap-3 sm:mb-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#6366F1] to-[#8B5CF6] text-white shadow-sm sm:h-10 sm:w-10">
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <h1 className="text-base font-semibold text-[#111827] sm:text-xl">
            Support client
          </h1>
          <p className="mt-0.5 text-[10px] leading-relaxed text-gray-600 sm:text-xs">
            Répondez aux messages de vos utilisateurs.
          </p>
        </div>
      </div>

      {threads.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-4 py-14 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50">
            <Mail className="h-6 w-6 text-slate-400" />
          </div>
          <p className="text-sm font-semibold text-slate-900">
            Aucun message pour l&apos;instant
          </p>
          <p className="mx-auto mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500">
            Les emails envoyés à <strong>support@makeitads.pro</strong> apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <ul className="divide-y divide-slate-100">
            {threads.map((t) => (
              <li key={t.thread_id}>
                <Link
                  href={`/dashboard/admin/support/${t.thread_id}`}
                  className={`flex gap-3 px-4 py-4 transition-colors hover:bg-slate-50 sm:gap-4 sm:px-5 ${
                    t.hasUnread ? 'bg-indigo-50/30' : ''
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                    t.hasUnread ? 'bg-[#6366F1]/10 text-[#6366F1]' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {t.hasUnread ? <Mail className="h-4 w-4" /> : <MailOpen className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-[13px] leading-tight sm:text-sm ${
                        t.hasUnread ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'
                      }`}>
                        {t.lastMessage.from_name || t.lastMessage.from_email}
                      </p>
                      <span className="shrink-0 text-[10px] text-slate-400 sm:text-[11px]">
                        {timeAgo(t.lastMessage.created_at)}
                      </span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-slate-500 truncate sm:text-xs">
                      {t.lastMessage.from_email}
                    </p>
                    <p className="mt-1 line-clamp-1 text-[12px] font-medium text-slate-700 sm:text-[13px]">
                      {t.lastMessage.subject || '(Sans sujet)'}
                    </p>
                    <p className="mt-0.5 line-clamp-1 text-[11px] text-slate-500 sm:text-xs">
                      {t.lastMessage.direction === 'outbound' && (
                        <span className="text-slate-400">Vous : </span>
                      )}
                      {t.lastMessage.body_text?.slice(0, 120)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-slate-400">
                      <MessageSquare className="h-3 w-3" />
                      {t.messageCount} message{t.messageCount > 1 ? 's' : ''}
                      {t.lastMessage.status === 'closed' && (
                        <span className="ml-2 inline-flex items-center gap-1 text-emerald-600">
                          <CheckCircle2 className="h-3 w-3" />
                          Résolu
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const diff = Date.now() - date.getTime();
  const min = Math.floor(diff / 60000);
  const h = Math.floor(min / 60);
  const d = Math.floor(h / 24);
  if (min < 1) return "À l'instant";
  if (min < 60) return `${min} min`;
  if (h < 24) return `${h} h`;
  if (d < 7) return `${d} j`;
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}