import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    
    // Vérifier le quota Free
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const { count } = await supabase.from("strategies").select("*", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", startOfMonth);
    
    if ((count || 0) >= 1) {
      return NextResponse.json({ error: "Free plan limit reached" }, { status: 403 });
    }

    // TODO: Appel IA ici pour générer la stratégie réelle
    // Pour l'instant, on crée une entrée basique
    const { data: strategy, error } = await supabase.from("strategies").insert({
      user_id: user.id,
      title: `${body.industry} Strategy - ${new Date().toLocaleDateString()}`,
      industry: body.industry,
      objective: body.goal,
      data: body,
    }).select().single();

    if (error) throw error;

    return NextResponse.json({ strategyId: strategy.id });
  } catch (err) {
    console.error("Strategy creation error:", err);
    return NextResponse.json({ error: "Failed to create strategy" }, { status: 500 });
  }
}