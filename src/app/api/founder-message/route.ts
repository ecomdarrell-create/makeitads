import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ message: null });
    }

    // Récupérer le profil pour déterminer le segment
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, created_at")
      .eq("id", user.id)
      .single();

    const plan = profile?.plan || "free";
    const isNew = profile?.created_at 
      ? (Date.now() - new Date(profile.created_at).getTime() < 7 * 24 * 60 * 60 * 1000)
      : true;
    
    const userSegment = isNew ? "new" : plan;

    // Récupérer les messages actifs pour ce segment ou 'all'
    const { data: messages } = await supabase
      .from("founder_messages")
      .select("*")
      .in("user_segment", ["all", userSegment, "new"])
      .eq("active", true)
      .order("priority", { ascending: false });

    if (!messages || messages.length === 0) {
      return NextResponse.json({ message: null });
    }

    // Vérifier l'historique d'affichage de l'utilisateur
    const { data: history } = await supabase
      .from("user_founder_messages")
      .select("message_id, display_count, last_seen")
      .eq("user_id", user.id);

    // ✅ CORRECTION : Typage explicite pour éviter les erreurs TypeScript
    const historyMap = new Map<string, any>(
      (history || []).map((h: any) => [h.message_id, h])
    );
    
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    let bestMessage: any = null;

    for (const msg of messages) {
      const hist = historyMap.get(msg.id);
      
      // Si jamais vu, c'est le meilleur candidat
      if (!hist) {
        bestMessage = msg;
        break;
      }
      
      // Si vu, mais il y a plus de 24h ET on n'a pas atteint le max d'affichages
      const lastSeen = new Date(hist.last_seen);
      if (lastSeen < oneDayAgo && hist.display_count < (msg.max_displays || 1)) {
        bestMessage = msg;
        break;
      }
    }

    // Fallback : si tous les messages ont été vus récemment, prendre le plus prioritaire
    if (!bestMessage) {
      bestMessage = messages[0];
    }

    // Enregistrer l'affichage
    const hist = historyMap.get(bestMessage.id);
    if (hist) {
      await supabase
        .from("user_founder_messages")
        .update({ 
          display_count: hist.display_count + 1, 
          last_seen: now.toISOString() 
        })
        .eq("id", hist.id);
    } else {
      await supabase
        .from("user_founder_messages")
        .insert({
          user_id: user.id,
          message_id: bestMessage.id,
          display_count: 1,
          last_seen: now.toISOString(),
          dismissed: false,
          clicked: false
        });
    }

    return NextResponse.json({ message: bestMessage });
  } catch (error) {
    console.error("Erreur API founder-message:", error);
    return NextResponse.json({ message: null });
  }
}