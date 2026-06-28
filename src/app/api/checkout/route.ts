import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
});

export async function POST(req: Request) {
  try {
    const { planName, billingCycle, userId, userEmail } = await req.json();

    if (!planName || !billingCycle || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prices: Record<string, string> = {
      pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY!,
      pro_yearly: process.env.STRIPE_PRICE_PRO_YEARLY!,
      premium_monthly: process.env.STRIPE_PRICE_PREMIUM_MONTHLY!,
      premium_yearly: process.env.STRIPE_PRICE_PREMIUM_YEARLY!,
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
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing?canceled=true`,
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