import { NextRequest, NextResponse } from "next/server";
import { getRequiredEnv, getPublicEnv } from '@/lib/env';
import { getStripeClient } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  const stripe = await getStripeClient();
  try {
    const { planName, userId, userEmail, isYearly } = await req.json();

    if (!userId || !userEmail) {
      return NextResponse.json({ error: "Utilisateur non connecté" }, { status: 401 });
    }

    // Price IDs pour Monthly et Yearly
    const priceIds: Record<string, Record<string, string>> = {
      Pro: {
        monthly: getRequiredEnv('STRIPE_PRICE_ID_PRO'),
        yearly: getRequiredEnv('STRIPE_PRICE_ID_PRO_YEARLY'),
      },
      Premium: {
        monthly: getRequiredEnv('STRIPE_PRICE_ID_PREMIUM'),
        yearly: getRequiredEnv('STRIPE_PRICE_ID_PREMIUM_YEARLY'),
      },
    };

    const planPrices = priceIds[planName];
    if (!planPrices) {
      return NextResponse.json({ error: "Plan invalide" }, { status: 400 });
    }

    const priceId = isYearly ? planPrices.yearly : planPrices.monthly;
    if (!priceId) {
      return NextResponse.json({ error: "Price ID manquant pour cette période" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: "subscription",
      success_url: `${req.headers.get("origin")}/dashboard?success=true`,
      cancel_url: `${req.headers.get("origin")}/pricing?canceled=true`,
      metadata: {
        userId: userId,
        plan: planName.toLowerCase(),
        billingPeriod: isYearly ? "yearly" : "monthly",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("ERREUR STRIPE CHECKOUT:", error.message);
    return NextResponse.json({ error: error.message || "Erreur serveur" }, { status: 500 });
  }
}