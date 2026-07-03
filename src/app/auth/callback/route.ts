export const dynamic = 'force-dynamic';

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  console.log("🔐 Auth callback triggered");
  console.log("Code:", code ? "Present" : "Missing");
  console.log("Next:", next);

  if (code) {
    try {
      const supabase = await createClient();
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error("❌ Error exchanging code for session:", error);
        return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
      }
      
      console.log("✅ Session created successfully");
      return NextResponse.redirect(`${origin}${next}`);
    } catch (err) {
      console.error("❌ Exception in auth callback:", err);
      return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
    }
  }

  console.error("❌ No code provided");
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`);
}