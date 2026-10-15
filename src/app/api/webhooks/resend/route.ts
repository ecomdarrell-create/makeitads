import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY manquante');
  return new Resend(key);
}

// ─────────────────────────────────────────────────────────────
// VÉRIFICATION SIGNATURE (format Resend/Svix : t=...,v1=...)
// ─────────────────────────────────────────────────────────────
function verifyResendSignature(
  rawBody: string,
  sigHeader: string | null,
  secret: string
): boolean {
  if (!sigHeader) return false;

  // Format 1 : t=...,v1=...
  const parts: Record<string, string> = {};
  sigHeader.split(',').forEach((p) => {
    const [k, v] = p.split('=');
    if (k && v) parts[k.trim()] = v.trim();
  });

  const timestamp = parts['t'];
  const receivedSig = parts['v1'];

  if (timestamp && receivedSig) {
    const signedPayload = `${timestamp}.${rawBody}`;
    const expected = crypto
      .createHmac('sha256', secret)
      .update(signedPayload, 'utf8')
      .digest('hex');

    try {
      return crypto.timingSafeEqual(
        Buffer.from(expected, 'utf8'),
        Buffer.from(receivedSig, 'utf8')
      );
    } catch {
      return false;
    }
  }

  // Format 2 : Svix standard "v1,<base64>"
  try {
    const [version, b64sig] = sigHeader.split(',');
    if (version === 'v1' && b64sig) {
      const secretBytes = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
      const expected = crypto
        .createHmac('sha256', secretBytes)
        .update(rawBody, 'utf8')
        .digest('base64');

      return crypto.timingSafeEqual(
        Buffer.from(expected, 'utf8'),
        Buffer.from(b64sig, 'utf8')
      );
    }
  } catch {
    return false;
  }

  return false;
}

// ─────────────────────────────────────────────────────────────
// POST
// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    console.log('=== [resend-inbound] WEBHOOK REÇU ===');

    const secret = process.env.RESEND_INBOUND_SECRET;
    if (!secret) {
      console.error('[resend-inbound] ❌ RESEND_INBOUND_SECRET manquant');
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    // Resend utilise le header "svix-signature"
    const sig =
      req.headers.get('svix-signature') ||
      req.headers.get('x-resend-signature');

    if (!sig || !verifyResendSignature(rawBody, sig, secret)) {
      console.error('[resend-inbound] ❌ Signature invalide');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('[resend-inbound] ✅ Signature valide');

    const payload = JSON.parse(rawBody);
    console.log('[resend-inbound] Event:', payload.type);

    // On ne traite que email.received
    if (payload.type !== 'email.received') {
      return NextResponse.json({ ignored: true, type: payload.type }, { status: 200 });
    }

    const emailId = payload.data?.email_id;
    if (!emailId) {
      return NextResponse.json({ error: 'No email_id' }, { status: 400 });
    }

    // Récupère le contenu complet de l'email via l'API Resend
    const resend = getResend();
    const { data: email, error: fetchError } = await resend.emails.receiving.get(emailId);

    if (fetchError || !email) {
      console.error('[resend-inbound] ❌ Erreur fetch email:', fetchError);
      return NextResponse.json({ error: 'Fetch failed' }, { status: 500 });
    }

    const supabaseAdmin = getSupabaseAdmin();

    // ─── Extrait les infos — parse "Nom <email@domain.com>" ───
    const rawFrom = (typeof email.from === 'string' ? email.from : '').trim();
    let fromName: string | null = null;
    let fromEmail = '';

    const match = rawFrom.match(/^(.+?)\s*<(.+?)>$/);
    if (match) {
      fromName = match[1].replace(/^"|"$/g, '').trim() || null;
      fromEmail = match[2].toLowerCase().trim();
    } else {
      fromEmail = rawFrom.toLowerCase().trim();
    }

    const toEmail = Array.isArray(email.to) ? email.to[0] : (email.to || '');
    const subject = email.subject || '(Sans sujet)';
    const bodyText = email.text || '';
    const bodyHtml = email.html || '';
    const messageId = (email as any).id || emailId;
    const headers = (email as any).headers || {};
    const inReplyTo = headers['in-reply-to'] || null;

    if (!fromEmail) {
      return NextResponse.json({ error: 'No from email' }, { status: 400 });
    }

    // Cherche l'utilisateur correspondant
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .ilike('email', fromEmail)
      .maybeSingle();

    // Détermine le thread_id :
    // - Si c'est une réponse (in_reply_to présent), on cherche le message original
    // - Sinon, on crée un nouveau thread avec ce message_id
    let threadId = messageId;
    if (inReplyTo) {
      const { data: original } = await supabaseAdmin
        .from('support_messages')
        .select('thread_id')
        .eq('message_id', inReplyTo)
        .maybeSingle();
      if (original?.thread_id) threadId = original.thread_id;
    }

    // Insert
    const { error: insertError } = await supabaseAdmin
      .from('support_messages')
      .insert({
        direction: 'inbound',
        from_email: fromEmail,
        from_name: fromName,
        to_email: toEmail,
        subject,
        body_text: bodyText,
        body_html: bodyHtml,
        user_id: profile?.id || null,
        thread_id: threadId,
        message_id: messageId,
        in_reply_to: inReplyTo,
        status: 'open',
        metadata: { resend_email_id: emailId, headers },
      });

    if (insertError) {
      // Cas doublon : on log mais on renvoie OK (Resend ne retentera pas)
      if (insertError.code === '23505') {
        console.log('[resend-inbound] ⏭️ Message déjà traité');
        return NextResponse.json({ success: true, duplicate: true }, { status: 200 });
      }
      console.error('[resend-inbound] ❌ Insert failed:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    console.log(`[resend-inbound] ✅ Email de ${fromEmail} enregistré (sujet: ${subject})`);

    return NextResponse.json({ success: true, threadId }, { status: 200 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('[resend-inbound] ❌ Exception:', msg);
    return NextResponse.json({ error: msg }, { status: 200 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Webhook Resend inbound opérationnel',
    timestamp: new Date().toISOString(),
  });
}