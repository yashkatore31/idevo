import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function extractJSON(text: string) {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```|```([\s\S]*?)```|([\s\S]*)/);
  if (!jsonMatch) return text;
  return (jsonMatch[1] || jsonMatch[2] || jsonMatch[3]).trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, stacks, complexity } = body;

    if (!role || !stacks?.length || !complexity) {
      return NextResponse.json({ message: "Invalid input." }, { status: 400 });
    }

    const techStack = stacks.map((s: any) => `${s.technology} (${s.category})`).join(", ");

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

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 1.2,      // 🔥 randomness
        topK: 40,
        topP: 0.9,
        maxOutputTokens: 1024,
      },
    });

    const result = await model.generateContent(prompt);
    console.log("AI request sent with prompt:", prompt);

    const response = result.response;
    const rawText = (await response.text()).trim();
    console.log("AI raw response text:", rawText);

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
