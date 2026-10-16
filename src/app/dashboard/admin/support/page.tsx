import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { isAdmin } from '@/lib/admin';
import { SupportList } from './SupportList';

export interface ThreadSummary {
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

  return <SupportList threads={threads} />;
}