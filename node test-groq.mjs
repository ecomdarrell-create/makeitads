import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

console.log("Clé Groq:", process.env.GROQ_API_KEY?.substring(0, 20) + "...");

try {
  const response = await groq.chat.completions.create({
    messages: [{ role: "user", content: "Dis bonjour en une phrase" }],
    model: "llama-3.1-70b-versatile",
    max_tokens: 50,
  });
  console.log("✅ Succès:", response.choices[0].message.content);
} catch (error) {
  console.error("❌ Erreur:", error.message);
  console.error("Status:", error.status);
  console.error("Type:", error.type);
}