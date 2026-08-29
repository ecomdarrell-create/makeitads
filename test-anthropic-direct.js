// test-anthropic-direct.js
import Anthropic from "@anthropic-ai/sdk";

// La clé est passée en argument pour éviter les problèmes de .env.local
const apiKey = process.argv[2];

if (!apiKey) {
  console.error("❌ Usage: node test-anthropic-direct.js <TA_CLE_API>");
  process.exit(1);
}

console.log("🔍 Test direct avec Anthropic...");
console.log("Longueur de la clé:", apiKey.length, "caractères");
console.log("Début de la clé:", apiKey.substring(0, 15) + "...");

const anthropic = new Anthropic({ apiKey });

async function test() {
  try {
    console.log(" Envoi de la requête...");
    
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 100,
      messages: [{ role: "user", content: "Dis bonjour en une phrase" }]
    });

    console.log("✅ SUCCÈS !");
    console.log("Réponse:", response.content[0].text);
    console.log("Modèle utilisé:", response.model);
    console.log("Tokens:", response.usage);
    
  } catch (error) {
    console.error("❌ ÉCHEC !");
    console.error("Message:", error.message);
    console.error("Type:", error.type);
    console.error("Status:", error.status);
    console.error("Code d'erreur:", error.error?.type);
  }
}

test();