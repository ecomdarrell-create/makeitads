import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const ADMIN_EMAIL = 'ecomdarrell@gmail.com';

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Variables Supabase manquantes');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function verifyResendSignature(rawBody: string, svixId: string | null, svixTimestamp: string | null, svixSignature: string | null, secret: string): boolean {
  if (!svixId || !svixTimestamp || !svixSignature) return false;
  const signedContent = `${svixId}.${svixTimestamp}.${rawBody}`;
  let secretBytes: Buffer;
  try {
    const secretBase64 = secret.replace(/^whsec_/, '');
    secretBytes = Buffer.from(secretBase64, 'base64');
  } catch { return false; }
  const expectedSig = crypto.createHmac('sha256', secretBytes).update(signedContent, 'utf8').digest('base64');
  const signatures = svixSignature.split(' ');
  for (const sig of signatures) {
    const [version, hash] = sig.split(',');
    if (version !== 'v1' || !hash) continue;
    try {
      if (crypto.timingSafeEqual(Buffer.from(expectedSig, 'utf8'), Buffer.from(hash, 'utf8'))) return true;
    } catch { continue; }
  }
  return false;
}

async function fetchReceivedEmail(emailId: string): Promise<any> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY manquante');
  const url = `https://api.resend.com/emails/receiving/${emailId}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
  });
  if (!res.ok) throw new Error(`Resend API ${res.status}`);
  return await res.json();
}

async function notifyAdminNewSupportMessage(supabaseAdmin: any, params: { threadId: string, messageId: string, fromEmail: string, fromName: string | null, subject: string, bodyText: string }) {
  try {
    const { data: adminProfile } = await supabaseAdmin.from('profiles').select('id').ilike('email', ADMIN_EMAIL).maybeSingle();
    if (!adminProfile?.id) {
      console.error('[resend-inbound] ⚠️ Admin profile not found for notification');
      return;
    }

    const senderLabel = params.fromName || params.fromEmail;
    const title = `📩 Nouveau message de ${senderLabel}`;
    const previewBody = (params.bodyText || '').replace(/\s+/g, ' ').trim();
    const preview = previewBody.length > 140 ? previewBody.slice(0, 140) + '…' : previewBody;
    const message = preview ? `${params.subject} — ${preview}` : params.subject;

    const { error } = await supabaseAdmin.from('notifications').insert({
      user_id: adminProfile.id,
      event_key: `support_msg_${params.messageId}`,
      type: 'support_message',
      category: 'system',
      title,
      message,
      action_label: 'Lire et répondre',
      action_path: `/dashboard/admin/support/${params.threadId}`,
      metadata: { thread_id: params.threadId, from_email: params.fromEmail, from_name: params.fromName },
    });

    if (error) {
      if (error.code === '23505') console.log('[resend-inbound] ⏭️ Notif admin déjà créée');
      else console.error('[resend-inbound] ⚠️ Erreur insertion notif:', error.message);
    } else {
      console.log(`[resend-inbound] 🔔 Notif admin créée pour ${params.fromEmail}`);
    }
  } catch (err) {
    console.error('[resend-inbound] ⚠️ Exception notif admin:', err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const secret = process.env.RESEND_INBOUND_SECRET;
    if (!secret) return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });

    const svixId = req.headers.get('svix-id');
    const svixTimestamp = req.headers.get('svix-timestamp');
    const svixSignature = req.headers.get('svix-signature');

    if (!verifyResendSignature(rawBody, svixId, svixTimestamp, svixSignature, secret)) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    if (payload.type !== 'email.received') return NextResponse.json({ ignored: true }, { status: 200 });

    const emailId = payload.data?.email_id;
    if (!emailId) return NextResponse.json({ error: 'No email_id' }, { status: 400 });

    const email = await fetchReceivedEmail(emailId);
    const supabaseAdmin = getSupabaseAdmin();

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

    if (!fromEmail) return NextResponse.json({ error: 'No from email' }, { status: 400 });

    const { data: profile } = await supabaseAdmin.from('profiles').select('id').ilike('email', fromEmail).maybeSingle();

    let threadId = messageId;
    if (inReplyTo) {
      const { data: original } = await supabaseAdmin.from('support_messages').select('thread_id').eq('message_id', inReplyTo).maybeSingle();
      if (original?.thread_id) threadId = original.thread_id;
    }

    const { error: insertError } = await supabaseAdmin.from('support_messages').insert({
      direction: 'inbound', from_email: fromEmail, from_name: fromName, to_email: toEmail,
      subject, body_text: bodyText, body_html: bodyHtml, user_id: profile?.id || null,
      thread_id: threadId, message_id: messageId, in_reply_to: inReplyTo, status: 'open',
      metadata: { resend_email_id: emailId, headers },
    });

    if (insertError && insertError.code !== '23505') {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    await notifyAdminNewSupportMessage(supabaseAdmin, { threadId, messageId, fromEmail, fromName, subject, bodyText });

    return NextResponse.json({ success: true, threadId }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 200 });
  }
}