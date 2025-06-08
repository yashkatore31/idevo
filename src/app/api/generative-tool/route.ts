import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// In-memory IP tracking (server side)
const getIPStore = () => {
  if (!(global as any).ipUsageMap) {
    (global as any).ipUsageMap = {};
  }
  return (global as any).ipUsageMap as Record<string, number>;
};

function extractJSON(text: string) {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```|```([\s\S]*?)```|([\s\S]*)/);
  if (!jsonMatch) return text;
  return (jsonMatch[1] || jsonMatch[2] || jsonMatch[3]).trim();
}

export async function POST(req: NextRequest) {
  try {
    const ip =
      req.headers.get("x-forwarded-for") ||
      req.ip ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const clientIP = ip.split(",")[0].trim();

    const ipStore = getIPStore();
    ipStore[clientIP] = (ipStore[clientIP] || 0) + 1;

    if (ipStore[clientIP] > 3) {
      return NextResponse.json(
        { message: "🚫 You’ve reached the 3-generation limit for this IP." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { role, stacks, complexity } = body;

    if (!role || !stacks?.length || !complexity) {
      return NextResponse.json({ message: "Invalid input." }, { status: 400 });
    }

    const techStack = stacks
      .map((s: any) => `${s.technology} (${s.category})`)
      .join(", ");

    const prompt = `
You are a top-tier developer in 2025.
Suggest a modern and innovative project idea that a ${role} can build using:
${techStack}.
The project should be ${complexity} level.

Respond ONLY with a JSON object in the following format, without any extra explanation or text:

{
  "projectIdea": {
    "title": "Project Idea Title",
    "description": "Detailed description of the project idea."
  },
  "implementationSteps": [
    {
      "step": "Step 1: Title",
      "details": "Details for step 1."
    },
    {
      "step": "Step 2: Title",
      "details": "Details for step 2."
    }
  ],
  "resumeSummary": {
    "title": "Resume Summary",
    "points": [
      "Point 1",
      "Point 2",
      "Point 3"
    ]
  }
}
`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = result.response;
    const rawText = (await response.text()).trim();
    const jsonText = extractJSON(rawText);

    let data;
    try {
      data = JSON.parse(jsonText);
    } catch (parseErr) {
      console.error("Failed to parse AI response as JSON:", parseErr);
      return NextResponse.json({ message: rawText }, { status: 200 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
