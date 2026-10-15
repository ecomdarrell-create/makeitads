import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { isAdmin } from '@/lib/admin';
import { Resend } from 'resend';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createAdminClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY manquante');
  return new Resend(key);
}

export async function POST(req: NextRequest) {
  try {
    // 1) Vérifie session + admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    if (!isAdmin(user.email)) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    // 2) Parse body
    const { threadId, subject, body, inReplyTo } = await req.json();
    if (!threadId || !body || !subject) {
      return NextResponse.json({ error: 'Paramètres manquants' }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // 3) Récupère le 1er message du thread pour avoir l'email du client
    const { data: firstMessage } = await supabaseAdmin
      .from('support_messages')
      .select('from_email')
      .eq('thread_id', threadId)
      .eq('direction', 'inbound')
      .order('created_at', { ascending: true })
      .limit(1)
      .maybeSingle();

    if (!firstMessage?.from_email) {
      return NextResponse.json({ error: 'Destinataire introuvable' }, { status: 404 });
    }

    const toEmail = firstMessage.from_email;

    // 4) Envoi email via Resend
    const resend = getResend();
    const htmlBody = body
      .split('\n')
      .map((line: string) => `<p style="margin: 0 0 12px 0;">${escapeHtml(line) || '&nbsp;'}</p>`)
      .join('');

    const { data: sendData, error: sendError } = await resend.emails.send({
      from: 'MakeItAds Support <support@makeitads.pro>',
      to: toEmail,
      subject,
      text: body,
      html: wrapInTemplate(htmlBody),
      headers: inReplyTo ? { 'In-Reply-To': inReplyTo } : undefined,
    });

    if (sendError) {
      console.error('[support/reply] Erreur Resend:', sendError);
      return NextResponse.json({ error: 'Erreur envoi email' }, { status: 500 });
    }

    // 5) Insert le message outbound
    const { error: insertError } = await supabaseAdmin
      .from('support_messages')
      .insert({
        direction: 'outbound',
        from_email: 'support@makeitads.pro',
        from_name: 'MakeItAds Support',
        to_email: toEmail,
        subject,
        body_text: body,
        body_html: htmlBody,
        thread_id: threadId,
        message_id: sendData?.id || `out-${Date.now()}`,
        in_reply_to: inReplyTo,
        status: 'open',
        replied_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('[support/reply] Insert failed:', insertError);
      // On ne bloque pas, l'email est parti
    }

    console.log(`[support/reply] ✅ Réponse envoyée à ${toEmail}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[support/reply] Exception:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function wrapInTemplate(bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin: 0; padding: 0; background-color: #F9FAFB; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #F9FAFB; padding: 40px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #ffffff; border-radius: 16px; border: 1px solid #E5E7EB;">
        <tr><td style="padding: 32px 40px 16px 40px;">
          <p style="margin: 0; font-size: 18px; font-weight: 700; color: #111827; letter-spacing: -0.02em;">
            MakeIt<span style="color: #6366F1;">Ads</span>
          </p>
        </td></tr>
        <tr><td style="padding: 8px 40px 24px 40px; font-size: 14px; line-height: 1.6; color: #4B5563;">
          ${bodyHtml}
        </td></tr>
        <tr><td style="padding: 0 40px 32px 40px; border-top: 1px solid #F3F4F6; padding-top: 20px;">
          <p style="margin: 0; font-size: 11px; color: #9CA3AF;">
            Répondez directement à cet email pour continuer la conversation.
          </p>
          <p style="margin: 8px 0 0 0; font-size: 11px; color: #9CA3AF;">
            © ${new Date().getFullYear()} MakeItAds
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}