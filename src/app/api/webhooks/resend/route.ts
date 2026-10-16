import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// ─────────────────────────────────────────────────────────────
// VÉRIFICATION SIGNATURE (format Svix : v1,<base64>)
// ─────────────────────────────────────────────────────────────
function verifyResendSignature(
  rawBody: string,
  svixId: string | null,
  svixTimestamp: string | null,
  svixSignature: string | null,
  secret: string
): boolean {
  if (!svixId || !svixTimestamp || !svixSignature) return false;

  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;

  let secretBytes: Buffer;
  try {
    const secretBase64 = secret.replace(/^whsec_/, '');
    secretBytes = Buffer.from(secretBase64, 'base64');
  } catch {
    return false;
  }

  const expectedSig = crypto
    .createHmac('sha256', secretBytes)
    .update(signedContent, 'utf8')
    .digest('base64');

  const signatures = svixSignature.split(' ');

  for (const sig of signatures) {
    const [version, hash] = sig.split(',');
    if (version !== 'v1' || !hash) continue;

    try {
      if (
        crypto.timingSafeEqual(
          Buffer.from(expectedSig, 'utf8'),
          Buffer.from(hash, 'utf8')
        )
      ) {
        return true;
      }
    } catch {
      continue;
    }
  }

  return false;
}

// ─────────────────────────────────────────────────────────────
// RÉCUPÈRE L'EMAIL VIA L'API RESEND (fetch direct)
// ─────────────────────────────────────────────────────────────
async function fetchReceivedEmail(emailId: string): Promise<any> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY manquante');

  // Endpoint officiel Resend pour récupérer un email entrant
  const url = `https://api.resend.com/emails/receiving/${emailId}`;

  console.log(`[resend-inbound] Fetch: ${url}`);

  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
  });

  const text = await res.text();
  console.log(`[resend-inbound] Fetch status: ${res.status}`);
  console.log(`[resend-inbound] Fetch response: ${text.slice(0, 500)}`);

  if (!res.ok) {
    throw new Error(`Resend API ${res.status}: ${text.slice(0, 200)}`);
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Resend API returned invalid JSON');
  }
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

    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.error('[resend-inbound] ❌ Headers Svix manquants');
      return NextResponse.json({ error: 'Missing svix headers' }, { status: 401 });
    }

    const isValid = verifyResendSignature(
      rawBody,
      svixId,
      svixTimestamp,
      svixSignature,
      secret
    );

    if (!isValid) {
      console.error('[resend-inbound] ❌ Signature invalide');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    console.log('[resend-inbound] ✅ Signature valide');

    const payload = JSON.parse(rawBody);
    console.log('[resend-inbound] Event:', payload.type);

    if (payload.type !== 'email.received') {
      return NextResponse.json({ ignored: true, type: payload.type }, { status: 200 });
    }

    const emailId = payload.data?.email_id;
    if (!emailId) {
      return NextResponse.json({ error: 'No email_id' }, { status: 400 });
    }

    // Récupère le contenu complet de l'email
    let email: any;
    try {
      email = await fetchReceivedEmail(emailId);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Erreur inconnue';
      console.error('[resend-inbound] ❌ Fetch email failed:', msg);
      return NextResponse.json({ error: `Fetch failed: ${msg}` }, { status: 500 });
    }

    console.log('[resend-inbound] Email keys:', Object.keys(email));
    console.log('[resend-inbound] Email from:', email.from);
    console.log('[resend-inbound] Email subject:', email.subject);

    const supabaseAdmin = getSupabaseAdmin();

    // Extrait les infos
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
    const messageId = email.id || emailId;
    const headers = email.headers || {};
    const inReplyTo = headers['in-reply-to'] || null;

    if (!fromEmail) {
      return NextResponse.json({ error: 'No from email' }, { status: 400 });
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .ilike('email', fromEmail)
      .maybeSingle();

    let threadId = messageId;
    if (inReplyTo) {
      const { data: original } = await supabaseAdmin
        .from('support_messages')
        .select('thread_id')
        .eq('message_id', inReplyTo)
        .maybeSingle();
      if (original?.thread_id) threadId = original.thread_id;
    }

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