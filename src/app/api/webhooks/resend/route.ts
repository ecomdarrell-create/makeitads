import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    console.log('📬 Email received from Resend:', body);
    
    // Extraire les informations de l'email
    const from = body.from || '';
    const to = body.to || '';
    const subject = body.subject || '(No subject)';
    const text = body.text || '';
    const html = body.html || '';
    
    // Déterminer la priorité
    let priority = 'normal';
    const subjectLower = subject.toLowerCase();
    if (subjectLower.includes('urgent') || subjectLower.includes('help')) {
      priority = 'high';
    }
    if (subjectLower.includes('error') || subjectLower.includes('bug') || subjectLower.includes('down')) {
      priority = 'urgent';
    }
    
    // Sauvegarder dans Supabase
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { error } = await supabase
      .from('support_emails')
      .insert({
        from_email: from,
        to_email: to,
        subject: subject,
        body_text: text,
        body_html: html,
        received_at: new Date().toISOString(),
        status: 'unread',
        priority: priority,
      });
    
    if (error) {
      console.error('❌ Error saving email to database:', error);
      return NextResponse.json({ error: 'Failed to save email' }, { status: 500 });
    }
    
    console.log('✅ Email saved to database');
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Error in Resend webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}