import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  try {
    const { planName } = await req.json();

    if (!planName) {
      return NextResponse.json({ error: 'Plan name required' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    // Si utilisateur non connecté → rediriger vers login
    if (!user) {
      return NextResponse.json({ 
        redirectUrl: `/auth/login?redirect=/dashboard/billing&plan=${encodeURIComponent(planName)}`
      });
    }

    // Si connecté → rediriger vers billing
    return NextResponse.json({ 
      redirectUrl: `/dashboard/billing?plan=${encodeURIComponent(planName)}`
    });

  } catch (error: any) {
    console.error('❌ Redirect error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}