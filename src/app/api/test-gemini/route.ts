import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://text.pollinations.ai/openai",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai",
          messages: [{ role: "user", content: "Say hello in one word" }],
        }),
      }
    );

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json({
        error: "Pollinations failed",
        status: response.status,
        fullError: data,
      }, { status: response.status });
    }

    const content = data.choices?.[0]?.message?.content || "No content";
    
    return NextResponse.json({
      success: true,
      response: content,
      provider: "Pollinations.ai (OpenAI compatible)",
      fullResponse: data,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}