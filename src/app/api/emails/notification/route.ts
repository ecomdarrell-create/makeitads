import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createAdminClient } from '@/lib/supabase/admin';
import { NotificationEmail } from '@/emails/NotificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  // 1. Vérifier le secret
  const secret = req.headers.get('x-webhook-secret');
  if (secret !== process.env.WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const notification = body.record;

    if (!notification?.user_id) {
      return NextResponse.json({ error: 'No user_id' }, { status: 400 });
    }

    // 2. Récupérer le profil (email + first_name + plan)
    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, first_name, plan')
      .eq('id', notification.user_id)
      .single();

    if (!profile?.email) {
      return NextResponse.json({ error: 'No email' }, { status: 400 });
    }

    // ✅ 3. NOUVEAU : Filtrer par plan
    // Si la notification cible un plan spécifique et que le user n'y est pas → skip
    if (notification.target_plan && profile.plan !== notification.target_plan) {
      await supabase
        .from('notifications')
        .update({ emailed_at: new Date().toISOString() })
        .eq('id', notification.id);

      return NextResponse.json({ 
        success: true, 
        skipped: 'plan_mismatch',
        userPlan: profile.plan,
        targetPlan: notification.target_plan,
      });
    }

    // 4. Envoyer l'email
    const { error: resendError } = await resend.emails.send({
      from: 'MakeItAds <notifications@makeitads.pro>',
      to: profile.email,
      subject: notification.title,
      react: NotificationEmail({
        firstName: profile.first_name || 'toi',
        title: notification.title,
        message: notification.message,
        actionLabel: notification.action_label,
        actionPath: notification.action_path
          ? `https://makeitads.pro${notification.action_path}`
          : undefined,
        category: notification.category,
      }),
    });

    if (resendError) {
      console.error('Resend error:', resendError);
      return NextResponse.json({ error: 'Email failed' }, { status: 500 });
    }

    // 5. Marquer comme envoyé
    await supabase
      .from('notifications')
      .update({ emailed_at: new Date().toISOString() })
      .eq('id', notification.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}