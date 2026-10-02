export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createAdminClient } from '@/lib/supabase/admin';
import { getPlan, normalizePlanId } from '@/config/pricing.config';

async function grantPlanCredits(
  supabase: ReturnType<typeof createAdminClient>,
  userId: string,
  planId: string,
  referenceId: string,
  description: string,
) {
  const plan = getPlan(planId);
  const amount = plan?.monthlyCredits ?? 0;
  if (amount <= 0) return;

  const { data: existing } = await supabase
    .from('credit_transactions')
    .select('id')
    .eq('reference_id', referenceId)
    .maybeSingle();
  if (existing) return;

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single();
  if (profileError || !profile) throw new Error('Profil introuvable pour attribution des crédits');

  const newBalance = (profile.credits_balance || 0) + amount;
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ credits_balance: newBalance, updated_at: new Date().toISOString() })
    .eq('id', userId);
  if (updateError) throw updateError;

  const { error: transactionError } = await supabase
    .from('credit_transactions')
    .insert({
      user_id: userId,
      type: 'monthly_quota',
      amount,
      balance_after: newBalance,
      reference_id: referenceId,
      description,
    });
  if (transactionError) throw transactionError;
}

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
  // ✅ Webhook secret depuis la variable d'environnement
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const planName = session.metadata?.planName ?? session.metadata?.plan;
      const billingCycle = session.metadata?.billingCycle ?? session.metadata?.billingPeriod;

      if (userId && planName) {
        const normalizedPlan = normalizePlanId(planName);
        await supabase
          .from('profiles')
          .update({
            plan: normalizedPlan,
            billing_cycle: billingCycle,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription,
            subscription_status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', userId);

        if (session.payment_status === 'paid') {
          await grantPlanCredits(
            supabase,
            userId,
            normalizedPlan,
            `stripe-checkout:${session.id}`,
            `Crédits mensuels du plan ${getPlan(normalizedPlan)?.name ?? normalizedPlan}`,
          );
        }
      }
      break;
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: user } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (user) {
        await supabase
          .from('profiles')
          .update({
            stripe_subscription_id: subscription.id,
            subscription_status: subscription.status,
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      const { data: user } = await supabase
        .from('profiles')
        .select('id')
        .eq('stripe_customer_id', customerId)
        .single();

      if (user) {
        await supabase
          .from('profiles')
          .update({
            plan: 'free',
            billing_cycle: null,
            stripe_subscription_id: null,
            subscription_status: 'canceled',
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id);
      }
      break;
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice;
      if (invoice.billing_reason !== 'subscription_create' && typeof invoice.customer === 'string') {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, plan')
          .eq('stripe_customer_id', invoice.customer)
          .maybeSingle();

        if (profile) {
          const planId = normalizePlanId(profile.plan);
          await grantPlanCredits(
            supabase,
            profile.id,
            planId,
            `stripe-invoice:${invoice.id}`,
            `Renouvellement mensuel du plan ${getPlan(planId)?.name ?? planId}`,
          );
        }
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;
      console.error('❌ Payment failed for invoice:', invoice.id);
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return NextResponse.json({ received: true });
}