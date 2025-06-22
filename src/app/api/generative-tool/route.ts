import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

function extractJSON(text: string) {
  const jsonMatch = text.match(
    /```json\s*([\s\S]*?)```|```([\s\S]*?)```|([\s\S]*)/
  );
  if (!jsonMatch) return text;
  return (jsonMatch[1] || jsonMatch[2] || jsonMatch[3]).trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { role, stacks, complexity, customInput, projectType } = body;

    if (!role || !stacks?.length || !complexity) {
      return NextResponse.json({ message: "Invalid input." }, { status: 400 });
    }

    const techStack = stacks
      .map((s: any) => `${s.technology} (${s.category})`)
      .join(", ");

    const prompt = `
You are an expert-level software engineer living in the year 2025.

Recommend a completely original, up-to-date, and inventive project idea tailored for a ${role} to create ${projectType} using this technology stack:
${techStack}

The project should align with the ${complexity} skill level.
Also, consider the following input while generating the idea: ${customInput}.

Strictly do NOT include any overdone or cliché project ideas, including:
blockchain solutions, dApps, chat applications, learning/course portals, recipe tools, personal portfolios, popular app clones, or city/travel explorers.

Aim for a novel, standout, and applicable solution—something that clearly breaks away from the ordinary.

Keep the wording straightforward and understandable to non-native English speakers.

Return ONLY a JSON object with the exact format below—no surrounding text, headings, or markdown:

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
  "techstack": {
    "title": "",
    "techstack": needs to be cover all possible stacks and libraries can be used [
      "name",
      "usage"
    ]
  },
  "resumeSummary": {
    "title": "Resume Summary",
    "technologies": "List of technologies used in the project.(eg format: tech1 | tech2 | tech3.)",
    "points": [
      "Point 1",
      "Point 2",
      "Point 3"
    ]
  }
}

Unique request id: ${Math.random().toString(36).slice(2)}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.85,
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
      console.log("Parsed AI response as JSON:", data);
    } catch (parseErr) {
      console.error("Failed to parse AI response as JSON:", parseErr);
      return NextResponse.json({ message: rawText }, { status: 200 });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { message: "Internal server error." },
      { status: 500 }
    );
  }
}
