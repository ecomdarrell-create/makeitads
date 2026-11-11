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
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Configuration email manquante.', code: 'missing_resend_key' },
        { status: 500 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        {
          error: 'Configuration Supabase admin manquante.',
          code: 'missing_service_role',
          details: `URL=${!!supabaseUrl} / SERVICE_KEY=${!!supabaseServiceKey}`,
        },
        { status: 500 }
      );
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const CEO_EMAIL = process.env.CEO_EMAIL || 'ecomdarrell@gmail.com';

    if (user?.email !== CEO_EMAIL) {
      return NextResponse.json(
        { error: 'Accès refusé', code: 'forbidden' },
        { status: 403 }
      );
    }

    const body: NotificationPayload = await request.json();
    const { title, message, target_plan, target_emails, category = 'feature', action_label, action_path } = body;

    if (!title || !message || !target_plan) {
      return NextResponse.json(
        { error: 'Champs manquants (title, message, target_plan).', code: 'missing_fields' },
        { status: 400 }
      );
    }

    const resend = new Resend(apiKey);

    // ═══════════ MODE CUSTOM EMAILS ═══════════
    if (target_plan === 'custom_emails') {
      if (!target_emails || !Array.isArray(target_emails) || target_emails.length === 0) {
        return NextResponse.json(
          { error: 'Aucun email fourni.', code: 'missing_emails' },
          { status: 400 }
        );
      }

      const cleaned = Array.from(
        new Set(
          target_emails
            .map((e) => e.trim().toLowerCase())
            .filter((e) => e.length > 0 && EMAIL_REGEX.test(e))
        )
      );

      if (cleaned.length === 0) {
        return NextResponse.json(
          { error: 'Aucun email valide.', code: 'no_valid_emails' },
          { status: 400 }
        );
      }

      const htmlContent = renderNewsletterHtml({
        title,
        message,
        actionLabel: action_label,
        actionPath: action_path,
      });

      let sentCount = 0;
      const errors: string[] = [];

      for (const email of cleaned) {
        try {
          const { error } = await resend.emails.send({
            from: 'MakeItAds <support@makeitads.pro>',
            replyTo: 'support@makeitads.pro',
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

      const serviceSupabase = createServiceClient(supabaseUrl, supabaseServiceKey);
      const { error: insertErr } = await serviceSupabase
        .from('announcements')
        .insert({
          title,
          message,
          category,
          target_segment: 'custom_emails',
          action_label: action_label || null,
          action_path: action_path || null,
          status: 'published',
          published_at: new Date().toISOString(),
          created_by: user.id,
          metadata: { custom_emails: cleaned, sent_count: sentCount, errors },
        });

      if (insertErr) {
        console.error('🚨 [notifications/send] Insert announcement (custom_emails) error:', {
          message: insertErr.message,
          code: insertErr.code,
          details: insertErr.details,
          hint: insertErr.hint,
        });
        // On retourne quand même le succès des emails envoyés
        return NextResponse.json({
          success: true,
          count: sentCount,
          total: cleaned.length,
          warning: 'Les emails ont été envoyés mais l’annonce n’a pas pu être enregistrée.',
          details: insertErr.message,
        });
      }

      return NextResponse.json({
        success: true,
        count: sentCount,
        total: cleaned.length,
        errors: errors.length > 0 ? errors.slice(0, 5) : undefined,
      });
    }

    // ═══════════ MODE PLAN ═══════════
    const serviceSupabase = createServiceClient(supabaseUrl, supabaseServiceKey);
    let targetUserIds: string[] = [];

    try {
      if (target_plan === 'all') {
        const { data, error: readErr } = await serviceSupabase.from('profiles').select('id');
        if (readErr) {
          console.error('🚨 [notifications/send] SELECT profiles error:', readErr);
          return NextResponse.json(
            { error: 'Impossible de charger les profils.', code: 'select_profiles_error', details: readErr.message },
            { status: 500 }
          );
        }
        targetUserIds = (data || []).map((p) => p.id);
      } else {
        const { data, error: readErr } = await serviceSupabase
          .from('profiles')
          .select('id')
          .eq('plan', target_plan);

        if (readErr) {
          console.error('🚨 [notifications/send] SELECT profiles (plan) error:', readErr);
          return NextResponse.json(
            { error: 'Impossible de charger les profils.', code: 'select_profiles_error', details: readErr.message },
            { status: 500 }
          );
        }
        targetUserIds = (data || []).map((p) => p.id);
      }
    } catch (err: any) {
      console.error('🚨 [notifications/send] Exception select profiles:', err);
      return NextResponse.json(
        { error: 'Erreur lecture profils.', code: 'select_exception', details: err.message },
        { status: 500 }
      );
    }

    if (targetUserIds.length === 0) {
      return NextResponse.json(
        { error: 'Aucun utilisateur trouvé pour ce segment.', code: 'no_users' },
        { status: 404 }
      );
    }

    const notifications = targetUserIds.map((userId) => ({
      user_id: userId,
      type: 'admin_broadcast',
      category,
      title,
      message,
      action_label: action_label || null,
      action_path: action_path || null,
      metadata: { source: 'admin_dashboard', sent_by: user.email },
      target_plan: target_plan === 'all' ? null : target_plan,
    }));

    const { data: inserted, error: insertError } = await serviceSupabase
      .from('notifications')
      .insert(notifications)
      .select('id');

    if (insertError) {
      // ✅ LOG DÉTAILLÉ pour identifier la vraie cause (CHECK constraint, colonne manquante, etc.)
      console.error('🚨 [notifications/send] Insert notifications error:', {
        message: insertError.message,
        code: insertError.code,
        details: insertError.details,
        hint: insertError.hint,
        sample_payload: notifications[0],
      });
      return NextResponse.json(
        {
          error: 'Erreur création notifications.',
          code: insertError.code || 'insert_error',
          details: insertError.message,
          hint: insertError.hint || undefined,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mode: 'plan',
      count: inserted?.length || 0,
    });
  } catch (error: any) {
    console.error('🚨 [notifications/send] Erreur globale:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur serveur', code: 'global_exception', details: String(error) },
      { status: 500 }
    );
  }
}