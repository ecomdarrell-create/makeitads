export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getStripePriceId, isStripeConfigured } from '@/config/stripe.config';

export async function POST(request: Request) {
  try {
    // ✅ Vérifier que Stripe est configuré
    if (!isStripeConfigured()) {
      console.error('❌ Stripe not configured. Missing environment variables.');
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      );
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-05-27.dahlia',
    });

    const body = await request.json();
    const planName = body.planName?.toLowerCase();
    const billingCycle = body.billingCycle || 'monthly';
    const userId = body.userId;
    const userEmail = body.userEmail;

    // ✅ Vérifier que les champs requis sont présents
    if (!planName || !billingCycle || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // ✅ Enterprise et Free ne passent pas par Stripe
    if (planName === 'enterprise' || planName === 'free') {
      return NextResponse.json(
        { error: `${planName} plan cannot be purchased through Stripe. Contact sales.` },
        { status: 400 }
      );
    }

    // ✅ Récupérer le Price ID avec gestion d'erreur
    let priceId: string;
    try {
      priceId = getStripePriceId(planName as any, billingCycle as any);
    } catch (error: any) {
      console.error('❌ Error getting price ID:', error.message);
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    // Créer ou récupérer le customer Stripe
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    let customerId = customers.data[0]?.id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: { userId },
      });
      customerId = customer.id;
    }

    // Créer la session de checkout
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/billing?canceled=true`,
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
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}