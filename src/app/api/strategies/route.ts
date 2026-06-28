import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase"; // ✅ Import corrigé

export async function GET() {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ count: 0 });
    }

    const { count, error } = await supabase
      .from("strategies")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    if (error) {
      console.error("Error counting strategies:", error);
      return NextResponse.json({ count: 0 });
    }

    return NextResponse.json({ count: count || 0 });
  } catch (error: any) {
    console.error("Unexpected error in /api/strategies/count:", error);
    return NextResponse.json({ count: 0 });
  }
}