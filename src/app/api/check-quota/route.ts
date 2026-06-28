import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return NextResponse.json({ allowed: false, reason: "unauthorized" }, { status: 401 });

    // Récupérer le plan et le nombre de stratégies ce mois-ci
    const { data: profile } = await supabase.from("profiles").select("plan_id").eq("id", user.id).single();
    const plan = profile?.plan_id || "free";

    if (plan !== "free") return NextResponse.json({ allowed: true });

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    
    const { count } = await supabase
      .from("strategies")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", startOfMonth);

    const used = count || 0;
    const allowed = used < 1;

    return NextResponse.json({ 
      allowed, 
      used, 
      limit: 1,
      message: allowed ? null : "You have reached your Free plan limit. Upgrade to continue generating personalized strategies."
    });

  } catch (err) {
    console.error("Quota check error:", err);
    return NextResponse.json({ allowed: false, reason: "server_error" }, { status: 500 });
  }
}