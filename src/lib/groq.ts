import Groq from "groq-sdk";
import type { ChatCompletion, ChatCompletionMessageParam } from "groq-sdk/resources/chat/completions";

let groqClient: Groq | null = null;

function getGroqClient(): Groq | null {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn("️ GROQ_API_KEY is not configured");
    return null;
  }
  
  if (!groqClient) {
    groqClient = new Groq({
      apiKey,
      dangerouslyAllowBrowser: false,
    });
  }
  
  return groqClient;
}

export const GROQ_MODELS = {
  LLAMA_3_1_8B: "llama-3.1-8b-instant",
  LLAMA_3_1_70B: "llama-3.1-70b-versatile",
  LLAMA_3_3_70B: "llama-3.3-70b-versatile",
  MIXTRAL_8X7B: "mixtral-8x7b-32768",
  GEMMA_7B: "gemma2-9b-it",
} as const;

export type GroqModel = typeof GROQ_MODELS[keyof typeof GROQ_MODELS];

export interface GroqMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function chatCompletion(
  messages: GroqMessage[],
  options: {
    model?: GroqModel;
    temperature?: number;
    max_tokens?: number;
  } = {}
): Promise<string> {
  const client = getGroqClient();
  
  if (!client) {
    throw new Error("Groq client not initialized. Check your GROQ_API_KEY.");
  }

  const {
    model = GROQ_MODELS.LLAMA_3_1_70B,
    temperature = 0.7,
    max_tokens = 4096,
  } = options;

  const groqMessages: ChatCompletionMessageParam[] = messages.map((msg) => ({
    role: msg.role,
    content: msg.content,
  }));

  try {
    const completion: ChatCompletion = await client.chat.completions.create({
      messages: groqMessages,
      model,
      temperature,
      max_tokens,
      stream: false,
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error(`Groq API failed: ${error}`);
  }
}

export async function generateJSON<T>(
  systemPrompt: string,
  userPrompt: string,
  model: GroqModel = GROQ_MODELS.LLAMA_3_1_70B
): Promise<T> {
  const messages: GroqMessage[] = [
    {
      role: "system",
      content: `${systemPrompt}\n\nIMPORTANT: Respond ONLY with valid JSON. No markdown, no explanations, just the JSON object.`,
    },
    {
      role: "user",
      content: userPrompt,
    },
  ];

  try {
    const response = await chatCompletion(messages, {
      model,
      temperature: 0.3,
    });

    const cleanedResponse = response
      .replace(/```json\s*/g, "")
      .replace(/```\s*/g, "")
      .trim();

    return JSON.parse(cleanedResponse) as T;
  } catch (error) {
    console.error("JSON Generation Error:", error);
    throw new Error(`Failed to generate JSON: ${error}`);
  }
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

export function isGroqConfigured(): boolean {
  const enabled = process.env.NEXT_PUBLIC_GROQ_ENABLED === 'true';
  const hasKey = !!process.env.GROQ_API_KEY;
  
  console.log("🔍 Groq check:", {
    NEXT_PUBLIC_GROQ_ENABLED: enabled,
    GROQ_API_KEY_exists: hasKey,
    configured: enabled && hasKey
  });
  
  return enabled && hasKey;
}

export { groqClient as groq };