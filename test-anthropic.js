import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

async function test() {
  try {
    console.log(" Clé API:", process.env.ANTHROPIC_API_KEY?.substring(0, 20) + "...");
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 100,
      messages: [{ role: "user", content: "Dis bonjour" }]
    });
    console.log("✅ Succès:", response.content[0].text);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
  }
}

test();