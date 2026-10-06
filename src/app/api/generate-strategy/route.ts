import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJSON } from "@/lib/deepseek";
import {
  SYSTEM_PROMPT,
  buildUserPrompt,
  type Strategy,
  type WizardData,
} from "@/lib/prompts";

// ============================================================
// VALIDATION DES DONNÉES ENTRANTES (Zod)
// ============================================================

const WizardDataSchema = z.object({
  type_business: z.string().min(2, "Type de business trop court"),
  produit: z.string().min(5, "Description du produit trop courte"),
  client_ideal: z.string().min(10, "Client idéal trop vague"),
  zone_geographique: z.string().min(2, "Zone géographique requise"),
  budget_mensuel_fcfa: z.number().positive("Le budget doit être positif"),
  objectif: z.string().min(3, "Objectif requis"),
  moyens_paiement: z
    .array(z.string())
    .min(1, "Au moins un moyen de paiement requis"),
  concurrents: z.string().optional(),
});

// ============================================================
// TYPE D'ERREUR PROPRE
// ============================================================

type ApiError = {
  status?: number;
  message?: string;
};

// ============================================================
// ROUTE POST
// ============================================================

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const parsed = WizardDataSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Données invalides",
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data: WizardData = parsed.data;

    const userPrompt = buildUserPrompt(data);

    const strategy = await generateJSON<Strategy>({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt,
      maxTokens: 4000,
    });

    return NextResponse.json({ success: true, strategy });
  } catch (error) {
    const err = error as ApiError;
    const message = err.message ?? "Erreur inconnue";

    console.error("❌ Erreur API generate-strategy :", message);

    return NextResponse.json(
      { error: message },
      { status: err.status && err.status >= 400 ? err.status : 500 }
    );
  }
}