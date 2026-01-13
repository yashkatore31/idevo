import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Extract JSON safely from AI response
function extractJSON(text: string) {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```|```([\s\S]*?)```|([\s\S]*)/);
  if (!jsonMatch) return text;
  return (jsonMatch[1] || jsonMatch[2] || jsonMatch[3]).trim();
}

// Safe JSON parser with trailing comma handling
function safeParseJSON(text: string) {
  try {
    const cleanText = text.replace(/,\s*}/g, "}").replace(/,\s*]/g, "]");
    return JSON.parse(cleanText);
  } catch (err) {
    console.error("JSON parse failed:", err);
    return null;
  }
}

export async function POST(req: Request) {
  try {
    console.log("=== Incoming request ===");
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    const { role, stacks, complexity, customInput, projectType } = body;

    if (!role || !stacks?.length || !complexity) {
      console.warn("Invalid input:", body);
      return NextResponse.json({ message: "Invalid input." }, { status: 400 });
    }

    // Convert stacks into string for prompt
    const techStackStr = stacks.map((s: any) => `${s.technology} (${s.category})`).join(", ");
    console.log("Tech stack string:", techStackStr);

    // Prepare prompt for Gemini
    const prompt = `
You are an expert software engineer in 2025.

Recommend a completely original, up-to-date, and inventive project idea tailored for a ${role} to create ${projectType} using this tech stack:
${techStackStr}

Skill level: ${complexity}
Additional input: ${customInput || "None"}

Rules:
- Do NOT include blockchain, dApps, chat apps, clones, learning portals, recipe tools, portfolios, or city/travel explorers.
- Generate a novel, standout project.
- Return ONLY valid JSON in this exact format:

{
  "projectIdea": {
    "title": "Project Idea Title",
    "description": "Detailed description of the project idea."
  },
  "implementationSteps": [
    { "step": "Step 1: Title", "details": "Details for step 1." },
    { "step": "Step 2: Title", "details": "Details for step 2." },
    { "step": "Step 3: Title", "details": "Details for step 3." },
    { "step": "Step 4: Title", "details": "Details for step 4." },
    { "step": "Step 5: Title", "details": "Details for step 5." },
    { "step": "Step 6: Title", "details": "Details for step 6." }
  ],
  "techstack": {
    "title": "Core Technologies and Libraries",
    "techstack": [
      ["Next.js", "Frontend framework for UI and routing"],
      ["React", "Component-based UI library"],
      ["TypeScript", "Type-safe frontend and backend code"],
      ["Tailwind CSS", "Utility-first styling framework"],
      ["Node.js", "Backend runtime"],
      ["Express.js", "Backend web framework"],
      ["Gemini API", "AI for contextual content generation"],
      ["Next-Auth.js", "Authentication library"],
      ["Prisma", "ORM for PostgreSQL"],
      ["PostgreSQL", "Relational database"]
    ]
  },
  "resumeSummary": {
    "title": "Resume Summary",
    "technologies": "Next.js | React | TypeScript | Tailwind CSS | Node.js | Express.js | Gemini API | Next-Auth.js | Prisma | PostgreSQL",
    "points": [
      "Point 1: Describe implementation details and architecture",
      "Point 2: Highlight tech stack usage and AI integration",
      "Point 3: Show project outcome, results, or impact"
    ]
  }
}

Unique request id: ${Math.random().toString(36).slice(2)}
`;

    console.log("=== Prompt sent to Gemini ===", prompt);

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 4096,
        responseMimeType: "application/json",
      },
    });

    const result = await model.generateContent(prompt);
    console.log("=== Raw AI result object ===", result);

    const rawText = (await result.response.text()).trim();
    console.log("=== Raw AI text ===", rawText);

    const jsonText = extractJSON(rawText);
    console.log("=== Extracted JSON text ===", jsonText);

    const data = safeParseJSON(jsonText);

    if (!data) {
      console.error("Failed to parse JSON. Returning raw text.");
      return NextResponse.json({ message: rawText }, { status: 200 });
    }

    console.log("=== Parsed AI response JSON ===", JSON.stringify(data, null, 2));

    return NextResponse.json(data);
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json({ message: "Internal server error." }, { status: 500 });
  }
}
