"use client";

import { useState } from "react";

export default function Home() {
  const [role, setRole] = useState("");
  const [category1, setCategory1] = useState("");
  const [technology1, setTechnology1] = useState("");

  return (
    <div className="mt-10 px-4 sm:px-6 lg:px-8 max-w-screen-lg mx-auto">
      <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight text-center">
        Create Stunning Project Idea With{" "}
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-cyan-300">
          Idevo
        </span>
      </h1>
      <p className="text-gray-500 mt-5 text-base tracking-tight sm:text-lg lg:text-xl leading text-center">
        Create advanced developer tools that software engineers would use directly in their workflow.
        Focus on 2025's most cutting-edge technologies and capabilities.
      </p>
      <div className="bg-card border rounded-lg shadow-sm my-6 border-gray-300 py-3 px-3">
        <div className="flex flex-col p-2">
          <div className="font-semibold text-2xl">Select Your Tech Stack</div>
          <p className="text-gray-500 tracking-tight text-sm">
            Choose at least two technologies from different categories to create an advanced developer tool that leverages their most cutting-edge capabilities as of 2025.
          </p>

          <form className="pt-5">
            <div className="font-medium text-lg">Your Developer Role</div>
            <p className="text-gray-500 tracking-tight text-sm py-3">
              Select your role to get tailored developer tool recommendations suitable for your specific workflow.
            </p>
            <label htmlFor="dev-role" className="text-sm font-medium leading-none block my-4">
              Role
            </label>

            {/* Wrapper to include select and chevron */}
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

              {/* Chevron Icon */}
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
            {!role &&
              <div className="bg-card text-center py-6 border mt-6 border-dashed rounded-md text-gray-500 border-gray-400"> <p>please select your developer role first</p></div>}
            {role && 
              <div>
                <div className="font-medium text-lg mt-5">Select Technologies and Framework</div>
            <p className="text-gray-500 tracking-tight text-sm py-3">
              Select the technologies which you have hand on experience 
            </p>
             <div className="font-medium text-lg my-3">Technology Selection 1</div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
              <div><label htmlFor="dev-category1" className="text-sm font-medium leading-none block my-3">
              Category
            </label>

            {/* Wrapper to include select and chevron */}
            <div className="relative">
              <select
                id="dev-category1"
                value={category1}
                onChange={(e) => setCategory1(e.target.value)}
                className="appearance-none w-full rounded-md border border-gray-300 bg-white px-2 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="">Select your Category</option>
                <option value="AI">AI</option>
                <option value="API">API</option>
                <option value="Backend">Backend</option>
                <option value="Frontend">Frontend</option>
                <option value="Database">Database</option>
                <option value="DevOps">DevOps</option>
                <option value="Testing">Testing</option>
                <option value="Mobile">Mobile</option>
              </select>

              {/* Chevron Icon */}
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

            </div></div>
            <div><label htmlFor="dev-technology1" className="text-sm font-medium leading-none block my-3">
              Technology
            </label>

            {/* Wrapper to include select and chevron */}
            <div className="relative">
              <select
                id="dev-technology1"
                value={technology1}
                onChange={(e) => setTechnology1(e.target.value)}
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

              {/* Chevron Icon */}
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

            </div></div>
             </div>
              </div>}
          </form>
        </div>
      </div>
    </div>
  );
}
