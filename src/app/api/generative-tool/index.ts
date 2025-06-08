import type { NextApiRequest, NextApiResponse } from "next";

type IPMap = Record<string, number>;

const getIPStore = (): IPMap => {
  if (!(global as any).ipUsageMap) {
    (global as any).ipUsageMap = {};
  }
  return (global as any).ipUsageMap;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const ip = (req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown") as string;
  const clientIP = ip.split(",")[0].trim(); // Handles proxy headers

  const ipStore = getIPStore();
  ipStore[clientIP] = (ipStore[clientIP] || 0) + 1;

  if (ipStore[clientIP] > 3) {
    return res.status(429).json({ error: "You’ve reached your 3-generation limit." });
  }

  // 👇 Replace this with your actual logic
  return res.status(200).json({
    message: `Generated successfully! Attempt ${ipStore[clientIP]}/3.`,
    projectIdea: {
      title: "Sample Title",
      description: "Your generated project idea will go here.",
    },
    implementationSteps: [
      { step: "Step 1", details: "Do this" },
      { step: "Step 2", details: "Then do this" },
    ],
    resumeSummary: {
      title: "Summary Title",
      points: ["Point 1", "Point 2"],
    },
  });
}
