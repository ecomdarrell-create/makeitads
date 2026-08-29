import { NextRequest, NextResponse } from "next/server";

// Cette route sert uniquement à accuser réception des demandes 
// car la génération des stratégies se fait désormais manuellement.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Nouvelle demande manuelle reçue :", body);
    
    return NextResponse.json(
      { 
        success: true, 
        message: "Demande bien reçue. Un expert MakeItAds vous contactera sur WhatsApp sous 24h." 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du traitement de la demande :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors du traitement de la demande." }, 
      { status: 500 }
    );
  }
}