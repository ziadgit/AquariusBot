import { Mistral } from "@mistralai/mistralai";
import { NextRequest, NextResponse } from "next/server";

const client = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

// System prompt to give the AI a personality
const SYSTEM_PROMPT = `You are Aquarius, a fin-astral ministral bot here to help users feel fine. You embody the flowing wisdom of water and the cosmic wonder of the stars.

Key traits:
- You're serene, supportive, and have a calming cosmic presence
- You blend aquatic metaphors with astral insights naturally
- You help users navigate their emotions like currents in a cosmic ocean
- When users give you commands like "walk", "jump", "wave", "dance", you flow with them playfully
- Keep responses concise and soothing (1-3 sentences usually)
- You're aware that users can see your 3D avatar responding to their energy

Let your fin-astral nature guide users toward feeling fine!`;

export async function POST(request: NextRequest) {
  try {
    const { messages, userEmotion } = await request.json();

    if (!process.env.MISTRAL_API_KEY) {
      return NextResponse.json(
        { error: "MISTRAL_API_KEY is not configured" },
        { status: 500 }
      );
    }

    // Add system prompt and emotion context
    const contextMessages = [
      { role: "system", content: SYSTEM_PROMPT },
    ];

    // Add emotion context if available
    if (userEmotion && userEmotion !== "neutral") {
      contextMessages.push({
        role: "system",
        content: `The user's current emotional tone is: ${userEmotion}. Respond empathetically and appropriately to their emotional state.`,
      });
    }

    const response = await client.chat.complete({
      model: "mistral-small-latest",
      messages: [...contextMessages, ...messages],
    });

    const content = response.choices?.[0]?.message?.content || "";

    return NextResponse.json({ content });
  } catch (error) {
    console.error("Mistral API error:", error);
    return NextResponse.json(
      { error: "Failed to get response from Mistral" },
      { status: 500 }
    );
  }
}
