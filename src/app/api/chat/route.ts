import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const systemPrompt = `Tu es l'assistant officiel de MakeItAds, un SaaS d'aide à la stratégie publicitaire pour les entreprises africaines francophones.
Réponds en français, de façon concise, précise et utile. Aide à choisir un plan, comprendre les crédits, préparer un brief, utiliser le dashboard et contacter le support.
Informations confirmées : Démo = 10 crédits de bienvenue uniques; Pro = 15 crédits renouvelés chaque mois; Premium = 30 crédits renouvelés chaque mois; Élite = 80 crédits renouvelés chaque mois. Une génération flash Démo coûte 6 crédits; une stratégie complète coûte 5 crédits et est réservée aux plans payants. Les recommandations sont générées par IA à partir du brief et ne constituent pas des résultats publicitaires mesurés.
Ne garantis jamais de ventes, ROAS, résultats, certifications, conformité réglementaire ni délais qui ne sont pas explicitement fournis. MakeItAds ne délivre pas de certification SQL. Si la question dépasse les informations connues, dis-le franchement et oriente vers le support Telegram https://t.me/MakeitAds_CEO. Ne demande jamais de mot de passe, de clé API ou de donnée de paiement.`;

export async function POST(request: Request) {
  console.log("ANTHROPIC_API_KEY:", process.env.ANTHROPIC_API_KEY?.slice(0, 15));

  try {
    const body = await request.json();
    const messages = body?.messages;

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Conversation invalide.' }, { status: 400 });
    }

    // ✅ CORRECTION 1 : Forcer le typage strict du 'role' pour satisfaire TypeScript
    const normalizedMessages = messages.slice(-8).map((msg: any) => {
      const roleStr = String(msg?.role);
      const content = typeof msg?.content === 'string' ? msg.content : String(msg?.content || '');
      
      return {
        // On force le type à être littéralement 'user' ou 'assistant'
        role: (roleStr === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: content.slice(0, 1200)
      };
    });

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Clé API manquante dans l\'environnement.' }, { status: 500 });
    }

    const anthropic = new Anthropic({ apiKey });

    console.log('🟡 Envoi de la requête à Anthropic...');

    const result = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      system: systemPrompt,
      messages: normalizedMessages,
      max_tokens: 1024,
      temperature: 0.3,
    });

    // ✅ CORRECTION 2 : Vérifier explicitement que le bloc est de type 'text'
    const textBlock = result.content.find((block): block is Anthropic.TextBlock => block.type === 'text');
    const answer = textBlock?.text || '';

    if (!answer) {
      return NextResponse.json({ error: 'Réponse vide du service IA.' }, { status: 502 });
    }

    console.log('🟢 Succès : Réponse reçue d\'Anthropic');
    return NextResponse.json({ answer });

  } catch (error: any) {
    console.error('==================================================');
    console.error('🔴 ERREUR ANTHROPIC EXACTE CAPTURÉE :');
    console.error('-> error.status :', error.status);
    console.error('-> error.message :', error.message);
    console.error('-> error.error (détails) :', JSON.stringify(error.error, null, 2));
    console.error('==================================================');
    
    return NextResponse.json(
      { error: error.message || 'Erreur interne du serveur.' },
      { status: error.status || 500 }
    );
  }
}