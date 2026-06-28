import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const user = data?.user;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: invoiceId } = await params;

    const invoice = await stripe.invoices.retrieve(invoiceId);

    if (!invoice.invoice_pdf) {
      return NextResponse.json({ error: 'No PDF available' }, { status: 404 });
    }

    const pdfResponse = await fetch(invoice.invoice_pdf);
    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new Response(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice-${invoiceId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('❌ PDF download error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}