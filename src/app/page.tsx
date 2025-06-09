"use client";

import { useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import { MdOutlineContentCopy } from "react-icons/md";


export default function Home() {
  const [role, setRole] = useState("");
  const [projectType, setProjectType] = useState("");
  const [category1, setCategory1] = useState("");
  const [technology1, setTechnology1] = useState("");
  const [category2, setCategory2] = useState("");
  const [technology2, setTechnology2] = useState("");
  const [category3, setCategory3] = useState("");
  const [technology3, setTechnology3] = useState("");
  const [complexityValue, setComplexityValue] = useState<number[]>([0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customInput, setCustomInput] = useState("");
  const [result, setResult] = useState<any | null>(null);


  const categoryTechnologyMap: Record<string, string[]> = {
    AI: ["TensorFlow", "PyTorch", "LangChain", "OpenAI API", "Hugging Face", "Stable Diffusion", "FastAI"],
    API: ["GraphQL", "REST", "tRPC", "Postman", "gRPC", "OpenAPI", "API Gateway"],
    Backend: ["Node.js", "Django", "Spring Boot", "Express", "NestJS", "Go (Golang)", "Ruby on Rails", "ASP.NET Core"],
    Frontend: ["React", "Next.js", "Vue", "Svelte", "Angular", "SolidJS", "Qwik"],
    Database: ["MongoDB", "PostgreSQL", "MySQL", "Supabase", "Redis", "Cassandra", "CockroachDB", "Neo4j"],
    DevOps: ["Docker", "Kubernetes", "Terraform", "GitHub Actions", "ArgoCD", "Jenkins", "CircleCI", "Pulumi"],
    Testing: ["Jest", "Cypress", "Playwright", "Vitest", "Mocha", "Chai", "Testing Library"],
    Mobile: ["React Native", "Flutter", "Swift", "Kotlin", "Jetpack Compose", "SwiftUI", "Xamarin"],
    Cloud: ["AWS", "Azure", "Google Cloud", "DigitalOcean", "Vercel", "Netlify", "Cloudflare"],
    Security: ["OWASP", "Snyk", "Burp Suite", "Wireshark", "Metasploit", "HashiCorp Vault"],
    DataEngineering: ["Apache Spark", "Kafka", "Airflow", "Flink", "Beam", "DBT"],
    Blockchain: ["Ethereum", "Solidity", "Polkadot", "Chainlink", "IPFS", "Web3.js"],
    UXUI: ["Figma", "Adobe XD", "Sketch", "Framer", "InVision"],
    AIops: ["DataDog", "New Relic", "Prometheus", "Grafana", "ELK Stack"],
  };


  const selectedCategories = [category1, category2, category3];
  const complexityLabels = ["Beginner", "Intermediate", "Advanced"];

  // Helper to render each category + technology selector block
  const renderTechSelection = (
    number: number,
    category: string,
    setCategory: React.Dispatch<React.SetStateAction<string>>,
    technology: string,
    setTechnology: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const techOptions = category ? categoryTechnologyMap[category] || [] : [];

    return (
      <div key={number} className="mb-6">
        <div className="font-medium text-lg mt-5">
          Select Technologies and Framework {number}
        </div>
        <p className="text-gray-500 tracking-tight text-sm py-3">
          Select the technologies you have hands-on experience with.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          {/* Category Selector */}
          <div>
            <label className="text-sm font-medium block my-3">Category</label>
            <div className="relative">
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setTechnology("");
                }}
                className="appearance-none w-full rounded-md border border-gray-300 bg-white px-2 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select your Category</option>
                {Object.keys(categoryTechnologyMap).map((cat) => {
                  const isSelectedElsewhere = selectedCategories.some(
                    (selectedCat, i) => selectedCat === cat && i !== number - 1
                  );
                  return (
                    <option key={cat} value={cat} disabled={isSelectedElsewhere}>
                      {cat}
                    </option>
                  );
                })}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Technology Selector */}
          <div>
            <label className="text-sm font-medium block my-3">Technology</label>
            <div className="relative">
              <select
                value={technology}
                onChange={(e) => setTechnology(e.target.value)}
                disabled={!category}
                className={`appearance-none w-full rounded-md border border-gray-300 bg-white px-2 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black ${!category ? "opacity-70 cursor-not-allowed" : "opacity-100 cursor-auto"
                  }`}
              >
                <option value="">Select a technology</option>
                {techOptions.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="shrink-0 bg-border h-[1px] w-full my-4" role="none"></div>
      </div>
    );
  };

  // Submit handler with validation + fetch call
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResult(null);

    // Validation
    if (!role) {
      setError("Please select your role.");
      return;
    }
    if (!category1 || !technology1 || !category2 || !technology2) {
      setError("Please select at least two categories and their technologies.");
      return;
    }
    if (
      category1 === category2 ||
      (category3 && (category3 === category1 || category3 === category2))
    ) {
      setError("Please select different categories.");
      return;
    }

    setLoading(true);

    const payload = {
      role,
      stacks: [
        { category: category1, technology: technology1 },
        { category: category2, technology: technology2 },
        ...(category3 && technology3 ? [{ category: category3, technology: technology3 }] : []),
      ],
      complexity: complexityLabels[complexityValue[0]],
      customInput: customInput.trim() || undefined,
    };

    try {
      const res = await fetch("/api/generative-tool/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`API error: ${res.statusText}`);

      const data = await res.json();

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong during generation.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="m-10 px-4 sm:px-6 lg:px-8 max-w-screen-lg mx-auto">
      <div className="max-w-3xl mx-auto items-center text-center">
<h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight bg-clip-text text-transparent bg-[length:200%] bg-gradient-to-r from-orange-400 via-pink-500 to-red-600 animate-gradient [text-shadow:_0_2px_8px_rgba(236,_72,_153,_0.5)]">
  Idevo
</h1>

      <p className="text-2xl sm:text-3xl font-medium mt-3 text-gray-800">
     
        Generate Your Next Project Idea
      </p> <div className="w-24 h-1  bg-gradient-to-r from-orange-400 via-pink-500 to-red-600 rounded-full mx-auto mt-2 mb-3"></div>
      <p className="text-gray-600 mt-2 text-sm sm:text-m  leading-relaxed">
        Create advanced developer tools that software engineers would use directly in their workflow.
        <br className="hidden sm:block" />
        Focus on 2025's most cutting-edge technologies and capabilities.
      </p>
    </div>

      <div className="bg-card border rounded-lg shadow-sm my-6 border-gray-300 py-3 px-3">
        <div className="flex flex-col p-2">
          <div className="font-semibold text-2xl">Select Your Tech Stack</div>
          <p className="text-gray-500 tracking-tight text-sm">
            Choose at least two technologies from different categories to create an advanced developer tool that leverages their most cutting-edge capabilities as of 2025.
          </p>

          <form className="pt-5" onSubmit={handleSubmit}>
            <div className="font-medium text-lg">Your Developer Role</div>
            <p className="text-gray-500 tracking-tight text-sm py-3">
              Select your role to get tailored developer tool recommendations suitable for your specific workflow.
            </p>

            <div><label htmlFor="dev-role" className="text-sm font-medium leading-none block my-4">
              Role
            </label>

              <div className="relative">
                <select
                  id="dev-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="appearance-none w-full rounded-md border border-gray-300 bg-white px-2 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select your role</option>
                  <option value="Frontend Engineer">Frontend Engineer</option>
                  <option value="Backend Engineer">Backend Engineer</option>
                  <option value="Full Stack Engineer">Full Stack Engineer</option>
                  <option value="DevOps Engineer">DevOps Engineer</option>
                  <option value="Data Engineer">Data Engineer</option>
                  <option value="Data Analyst">Data Analyst</option>
                  <option value="Machine Learning Engineer">Machine Learning Engineer</option>
                  <option value="Security Engineer">Security Engineer</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="dev-role" className="text-sm font-medium leading-none block my-4">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  <option value="">Select project type</option>
                  <option value="Developer Tool">Developer Tool</option>
                  <option value="Web Application">Web Application</option>
                  <option value="Mobile App">Mobile App</option>
                  <option value="AI Service">AI Service</option>
                  <option value="API Service">API Service</option>
                  <option value="Browser Extension">Browser Extension</option>
                </select>
              </div>
            </div>


            {!role ? (
              <div className="bg-card text-center py-6 border mt-6 border-dashed rounded-md text-gray-500 border-gray-400">
                <p>Please select your developer role first</p>
              </div>
            ) : (
              <>
                {renderTechSelection(1, category1, setCategory1, technology1, setTechnology1)}
                {renderTechSelection(2, category2, setCategory2, technology2, setTechnology2)}
                {renderTechSelection(3, category3, setCategory3, technology3, setTechnology3)}

                <div className="mt-8">
                  <div className="font-medium text-lg mb-2">Project Complexity Level</div>
                  <p className="text-gray-500 tracking-tight text-sm mb-6">
                    Choose how complex the project should be based on your experience level and challenge preference.
                  </p>

                  <Slider.Root
                    className="relative flex items-center select-none touch-none w-full h-6"
                    value={complexityValue}
                    max={2}
                    step={1}
                    aria-label="Project Complexity"
                    onValueChange={setComplexityValue}
                  >
                    <Slider.Track className="bg-gray-300 relative grow rounded-full h-2">
                      <Slider.Range className="absolute bg-black rounded-full h-full" />
                    </Slider.Track>
                    <Slider.Thumb
                      className="block w-6 h-6 bg-white rounded-full shadow-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-400"
                      aria-label="Complexity level thumb"
                    />
                  </Slider.Root>

                  <div className="flex justify-between text-sm font-sm mt-4 text-gray-700 select-none">
                    {complexityLabels.map((label, idx) => (
                      <span
                        key={label}
                        className={`cursor-pointer ${complexityValue[0] === idx ? "text-gray-600" : ""}`}
                        onClick={() => setComplexityValue([idx])}
                      >
                        {label}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
            <div className="mt-8">
              <div className="font-medium text-lg mb-2">Additional Requirements</div>
              <p className="text-gray-500 tracking-tight text-sm mb-4">
                Add any specific requirements, constraints, or ideas you'd like to include in your project.
              </p>
              <textarea
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="E.g. Must use AI for code generation, should be optimized for mobile, needs to integrate with GitHub..."
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black min-h-[100px]"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-card border-0 rounded-lg shadow-sm mt-4 bg-[hsl(0deg_89.66%_60.4%)] py-2 px-2">
                <p className="text-sm text-center text-white opacity-95">{error}</p>
              </div>
            )}

            {/* Result Cards */}
            {result && (
              <div className="mt-8 flex flex-col gap-6">
                {/* Card 1: Project Idea */}
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm relative">
                  <div
                    className="absolute top-2 right-2 flex items-center p-0 select-none"
                    style={{ maskPosition: "0% 0%" }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${result.projectIdea?.title}\n\n${result.projectIdea?.description}`
                        )
                      }
                      className="text-token-text-secondary hover:bg-token-bg-secondary rounded-lg p-1 m-1 text-gray-600 hover:text-gray-900 active:text-gray-700 hover:shadow-md hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out"
                      aria-label="Copy project idea"
                    >
                      <span className="flex h-[28px] w-[28px] items-center justify-center">
                        <MdOutlineContentCopy size={18} />
                      </span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-semibold text-blue-500 mb-2 mr-5">{result.projectIdea?.title}</h2>
                  <p className="text-gray-700 text-sm sm:text-base">{result.projectIdea?.description}</p>
                </div>

                {/* Card 2: Implementation Steps */}
                <div className="bg-white border border-gray-300 rounded-lg p-6 shadow-sm relative">
                  <div
                    className="absolute top-2 right-2 flex items-center p-0 select-none"
                    style={{ maskPosition: "0% 0%" }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          result.implementationSteps
                            ?.map((stepObj: any, idx: number) => `${idx + 1}. ${stepObj.step}\n${stepObj.details}`)
                            .join("\n\n")
                        )
                      }
                      className="text-token-text-secondary hover:bg-token-bg-secondary rounded-lg p-1 text-gray-600 hover:text-gray-900 active:text-gray-700 hover:shadow-md hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out"
                      aria-label="Copy implementation steps"
                    >
                      <span className="flex h-[28px] w-[28px] items-center justify-center">
                        <MdOutlineContentCopy size={18} />
                      </span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-semibold text-blue-500 mb-4 mr-5">Implementation</h2>
                  <ol className="list-decimal list-inside space-y-4 text-gray-700 text-sm sm:text-base">
                    {result.implementationSteps?.map((stepObj: any, idx: number) => (
                      <li key={idx}>
                        <strong>{stepObj.step}</strong>
                        <p className="mt-1">{stepObj.details}</p>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Card 3: Resume Summary */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md space-y-4 relative">
                  <div
                    className="absolute top-2 right-2 flex items-center p-0 select-none"
                    style={{ maskPosition: "0% 0%" }}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${result.resumeSummary?.title}\n\nTechnologies: ${result.resumeSummary?.technologies
                            ?.split("|")
                            .join(", ")}\n\n${result.resumeSummary?.points?.join("\n")}`
                        )
                      }
                      className="text-token-text-secondary hover:bg-token-bg-secondary rounded-lg p-1 text-gray-600 hover:text-gray-900 active:text-gray-700 hover:shadow-md hover:scale-110 active:scale-90 transition-transform duration-200 ease-in-out"
                      aria-label="Copy resume summary"
                    >
                      <span className="flex h-[28px] w-[28px] items-center justify-center">
                        <MdOutlineContentCopy size={18} />
                      </span>
                    </button>
                  </div>

                  <h2 className="text-2xl font-bold text-blue-500 mr-5">{result.resumeSummary?.title}</h2>

                  {/* Technologies as soft badges */}
                  <div className="flex flex-wrap gap-2 ">
                    {result.resumeSummary?.technologies
                      ?.split("|")
                      .map((tech: string, idx: number) => (
                        <span
                          key={idx}
                          className="bg-gray-50 text-gray-600 text-sm sm:text-xs px-2.5 py-1 rounded-full border border-gray-200"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                  </div>

                  {/* Points List */}
                  <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base pl-2">
                    {result.resumeSummary?.points?.map((point: string, idx: number) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}



            {/* Submit Button */}
            {!result ? (
              <button
                type="submit"
                disabled={loading}
                className="text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  bg-gradient-to-r from-orange-500 via-pink-500 to-red-600 hover:from-orange-700 hover:to-red-700 hover:via-pink-600 h-10 px-4 py-2 w-full border-0 mt-8"
              >
                {loading ? "Generating..." : "Generate"}
              </button>
            ) : (
              <button
                type="submit"
                className="text-white inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50  bg-gradient-to-r from-orange-400 via-pink-500 to-red-600 hover:from-orange-700 hover:to-red-700 hover:via-pink-600 h-10 px-4 py-2 w-full border-0 mt-8"
              >
                Generate Something New
              </button>
            )}
          </form>
        </div>
      </div>
      <div className="text-center container px-4 mb-3">
        <p className="text-gray-500 text-xs font-mono tracking-tighter">
          Made with <span className="text-red-500">❤️</span> by{" "}
          <a
            href="https://github.com/yashkatore31"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-900 font-medium"
          >
            Yash Katore
          </a>
        </p>
        {/* <p  className="text-gray-400 text-xs font-mono tracking-tighter">Happy Coding...</p> */}
      </div>
    </div>
  );
}
