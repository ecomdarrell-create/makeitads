import { NextResponse } from 'next/server';
import { getRequiredEnv, getPublicEnv } from '@/lib/env';
import { getStripeClient } from '@/lib/stripe';

export async function POST(req: Request) {
  const stripe = getStripeClient();
  try {
    const { planName, billingCycle, userId, userEmail } = await req.json();

    if (!planName || !billingCycle || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prices: Record<string, string> = {
      pro_monthly: getRequiredEnv('STRIPE_PRICE_PRO_MONTHLY'),
      pro_yearly: getRequiredEnv('STRIPE_PRICE_PRO_YEARLY'),
      premium_monthly: getRequiredEnv('STRIPE_PRICE_PREMIUM_MONTHLY'),
      premium_yearly: getRequiredEnv('STRIPE_PRICE_PREMIUM_YEARLY'),
    };

    const priceKey = `${planName.toLowerCase()}_${billingCycle}`;
    const priceId = prices[priceKey];

    if (!priceId) {
      return NextResponse.json(
        { error: `Invalid plan or billing cycle: ${priceKey}` },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${getPublicEnv('NEXT_PUBLIC_APP_URL')}/dashboard/billing?success=true`,
      cancel_url: `${getPublicEnv('NEXT_PUBLIC_APP_URL')}/dashboard/billing?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId,
        planName,
        billingCycle,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Checkout failed' },
      { status: 500 }
    );
  }
}