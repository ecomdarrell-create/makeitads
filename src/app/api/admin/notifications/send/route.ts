import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { renderNewsletterHtml } from '@/emails/NewsletterEmail';

export const runtime = 'nodejs';

type NotificationPayload = {
  title: string;
  message: string;
  target_plan: 'all' | 'free' | 'pro' | 'premium' | 'enterprise' | 'custom_emails';
  target_emails?: string[];
  category?: 'welcome' | 'credits' | 'feature' | 'account' | 'system';
  action_label?: string;
  action_path?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Configuration email manquante.' }, { status: 500 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const CEO_EMAIL = process.env.CEO_EMAIL || 'ecomdarrell@gmail.com';

    if (user?.email !== CEO_EMAIL) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const body: NotificationPayload = await request.json();
    const { title, message, target_plan, target_emails, category = 'feature', action_label, action_path } = body;

    if (!title || !message || !target_plan) return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });

    const resend = new Resend(apiKey);

    // ═══ MODE CUSTOM EMAILS ═══
    if (target_plan === 'custom_emails') {
      if (!target_emails || !Array.isArray(target_emails) || target_emails.length === 0) return NextResponse.json({ error: 'Aucun email fourni.' }, { status: 400 });

      const cleaned = Array.from(new Set(target_emails.map((e) => e.trim().toLowerCase()).filter((e) => e.length > 0 && EMAIL_REGEX.test(e))));
      if (cleaned.length === 0) return NextResponse.json({ error: 'Aucun email valide.' }, { status: 400 });

      const htmlContent = renderNewsletterHtml({ title, message, actionLabel: action_label, actionPath: action_path });
      let sentCount = 0;
      const errors: string[] = [];

      for (const email of cleaned) {
        try {
          const { error } = await resend.emails.send({
            from: 'MakeItAds <support@makeitads.pro>', // ✅ Adresse corrigée
            replyTo: 'support@makeitads.pro',         // ✅ Redirection des réponses
            to: email,
            subject: title,
            html: htmlContent,
          });
          if (error) errors.push(`${email}: ${error.message}`);
          else sentCount++;
        } catch (err: any) {
          errors.push(`${email}: ${err.message}`);
        }
        await new Promise((r) => setTimeout(r, 300));
      }

      const serviceSupabase = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
      await serviceSupabase.from('announcements').insert({
        title, message, category, target_segment: 'custom_emails',
        action_label: action_label || null, action_path: action_path || null,
        status: 'published', published_at: new Date().toISOString(),
        created_by: user.id, metadata: { custom_emails: cleaned, sent_count: sentCount, errors },
      });

      return NextResponse.json({ success: true, count: sentCount, total: cleaned.length, errors: errors.length > 0 ? errors.slice(0, 5) : undefined });
    }

    // ═══ MODE PLAN ═══
    const serviceSupabase = createServiceClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
    let targetUserIds: string[] = [];
    
    if (target_plan === 'all') {
      const { data } = await serviceSupabase.from('profiles').select('id');
      targetUserIds = (data || []).map(p => p.id);
    } else {
      const { data } = await serviceSupabase.from('profiles').select('id').eq('plan', target_plan);
      targetUserIds = (data || []).map(p => p.id);
    }

    if (targetUserIds.length === 0) return NextResponse.json({ error: 'Aucun utilisateur trouvé.' }, { status: 404 });

    const notifications = targetUserIds.map(userId => ({
      user_id: userId, type: 'admin_broadcast', category,
      title, message, action_label: action_label || null, action_path: action_path || null,
      metadata: { source: 'admin_dashboard', sent_by: user.email },
      target_plan: target_plan === 'all' ? null : target_plan,
    }));

    const { data: inserted, error: insertError } = await serviceSupabase.from('notifications').insert(notifications).select('id');
    if (insertError) return NextResponse.json({ error: 'Erreur création notifications' }, { status: 500 });

    return NextResponse.json({ success: true, mode: 'plan', count: inserted?.length || 0 });
  } catch (error: any) {
    console.error('Erreur API Notification:', error);
    return NextResponse.json({ error: error.message || 'Erreur serveur' }, { status: 500 });
  }
}