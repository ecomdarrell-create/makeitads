import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const { messageId } = await req.json();

    if (!user || !messageId) {
      return NextResponse.json({ success: false });
    }

    await supabase
      .from("user_founder_messages")
      .update({ dismissed: true })
      .eq("user_id", user.id)
      .eq("message_id", messageId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur API dismiss:", error);
    return NextResponse.json({ success: false });
  }
}