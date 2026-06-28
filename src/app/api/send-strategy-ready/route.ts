import { NextRequest, NextResponse } from 'next/server';
import { sendStrategyReadyEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, userName, strategyName, strategyId } = await req.json();

    if (!email || !strategyName) {
      return NextResponse.json(
        { error: 'Email et nom de stratégie requis' },
        { status: 400 }
      );
    }

    const result = await sendStrategyReadyEmail({
      to: email,
      userName: userName || 'there',
      strategyName,
      strategyId: strategyId || 'unknown',
    });

    if (result.success) {
      return NextResponse.json({ success: true, message: 'Email envoyé !' });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Erreur send-strategy-ready:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}