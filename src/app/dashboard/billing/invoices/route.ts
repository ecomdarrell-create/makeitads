import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
});

export async function GET(req: Request) {
  try {
    // Récupérer l'email de l'utilisateur depuis les headers (simplifié)
    // En production, utilise l'auth proper
    
    const invoices = await stripe.invoices.list({
      limit: 10,
    });

    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.number || invoice.id,
      date: new Date(invoice.created * 1000).toISOString(),
      amount: (invoice.amount_paid || 0) / 100,
      currency: invoice.currency.toUpperCase(),
      status: invoice.status,
      pdf_url: invoice.invoice_pdf,
      hosted_invoice_url: invoice.hosted_invoice_url,
      plan: (invoice.lines.data[0] as any)?.plan?.nickname || 'Subscription',
    }));

    return NextResponse.json({ invoices: formattedInvoices });
  } catch (error: any) {
    console.error('❌ Invoices error:', error);
    return NextResponse.json({ error: error.message, invoices: [] }, { status: 500 });
  }
}