import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: "sk-1f3ec7bc33f24fe19afe6eed509d0b1c", // Remplace par ta vraie clé API DeepSeek (commence par sk-)
});

async function test() {
  try {
    const response = await client.chat.completions.create({
      model: "deepseek-chat",
      messages: [{ role: "user", content: "Dis bonjour en français." }],
    });
    console.log("✅ Réponse de l'IA :", response.choices[0].message.content);
  } catch (error) {
    console.error("❌ Erreur :", error.message);
  }
}

test();