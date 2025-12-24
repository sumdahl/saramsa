import { GoogleGenAI } from "@google/genai";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";

const apiKey = process.env.GEMINI_SECRET_KEY;

if (!apiKey) {
  throw new Error("GEMINI_SECRET_KEY is not set");
}

const client = new GoogleGenAI({
  apiKey,
});

export async function generateSummaryFromGemini(
  pdfText: string
): Promise<string> {
  if (!pdfText || pdfText.trim().length === 0) {
    throw new Error("PDF text is empty");
  }

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: SUMMARY_SYSTEM_PROMPT,
            },
            {
              text: `Transform the following document into an engaging,
easy-to-read summary with contextually relevant emojis and proper
Markdown formatting:

${pdfText}`,
            },
          ],
        },
      ],
      config: {
        temperature: 0.7,
        maxOutputTokens: 1500,
      },
    });

    const text = response.text;

    if (!text || text.trim().length === 0) {
      throw new Error("Gemini returned an empty response");
    }

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate summary from Gemini");
  }
}
