import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // ✅ L'email de bienvenue est désactivé car le plan gratuit n'existe plus.
    // On renvoie juste un succès pour ne pas bloquer le front-end s'il appelle cette API.
    console.log("ℹ️ Email de bienvenue ignoré (plus de plan gratuit).");
    
    return NextResponse.json({ success: true, message: 'Welcome email skipped (no free tier).' });
  } catch (error: any) {
    console.error('❌ Send welcome error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}