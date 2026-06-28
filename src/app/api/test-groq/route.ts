import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    return NextResponse.json({ 
      error: "No API key",
      keyExists: false 
    });
  }

  const groq = new Groq({ apiKey });

  try {
    // Test simple avec le modèle le plus basique
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "user", content: "Say hello" }
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 10,
    });

    return NextResponse.json({
      success: true,
      response: completion.choices[0]?.message?.content,
      model: completion.model,
      keyStart: apiKey.substring(0, 10) + "...",
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      status: error.status,
      keyStart: apiKey.substring(0, 10) + "...",
    }, { status: error.status || 500 });
  }
}