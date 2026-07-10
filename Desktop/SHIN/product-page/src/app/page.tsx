"use client";

import { useState } from "react";
import {
  TerminalAnimationRoot,
  TerminalAnimationBackgroundGradient,
  TerminalAnimationContainer,
  TerminalAnimationWindow,
  TerminalAnimationContent,
  TerminalAnimationCommandBar,
  TerminalAnimationOutput,
  TerminalAnimationBlinkingCursor,
  TerminalAnimationTrailingPrompt,
  TerminalAnimationTabList,
  TerminalAnimationTabTrigger,
  useTerminalAnimation,
  type TabContent,
} from "@/components/ui/terminal-animation";

const shinTabs: TabContent[] = [
  {
    label: "review",
    command: 'shin review "Implement JWT authentication"',
    lines: [
      { text: "", delay: 80 },
      { text: "  Resolving concepts...", color: "text-neutral-400", delay: 400 },
      { text: "  ✓ authentication", color: "text-[#22ff73]", delay: 200 },
      { text: "  ✓ jwt", color: "text-[#22ff73]", delay: 150 },
      { text: "  ✓ spring-security", color: "text-[#22ff73]", delay: 150 },
      { text: "", delay: 200 },
      { text: "  Traversing knowledge graph...", color: "text-neutral-400", delay: 400 },
      { text: "  Found 3 relevant experiences", color: "text-[#32f3e9]", delay: 200 },
      { text: "  Found 2 relevant principles", color: "text-[#32f3e9]", delay: 150 },
      { text: "  Found 1 relevant architecture", color: "text-[#32f3e9]", delay: 150 },
      { text: "", delay: 200 },
      { text: "  Assembling evidence...", color: "text-neutral-400", delay: 300 },
      { text: "", delay: 80 },
      { text: "  ── Judgment Package ──", color: "text-[#b39aff]", delay: 200 },
      { text: "  Confidence: high (0.92)", color: "text-[#22ff73]", delay: 100 },
      { text: "  Lessons: 2", color: "text-neutral-300", delay: 100 },
      { text: "  Warnings: 1", color: "text-yellow-400", delay: 100 },
      { text: "  Recommendations: 3", color: "text-[#32f3e9]", delay: 100 },
      { text: "", delay: 200 },
      { text: "  ⚠ JwtFilter may intercept public routes", color: "text-yellow-400", delay: 150 },
      { text: "  ✓ Use permitAll() on auth endpoints", color: "text-[#22ff73]", delay: 100 },
      { text: "  ✓ Configure security filter chain order", color: "text-[#22ff73]", delay: 100 },
    ],
  },
  {
    label: "graph",
    command: "shin graph",
    lines: [
      { text: "", delay: 80 },
      { text: "  Engineering Brain loaded", color: "text-[#b39aff]", delay: 400 },
      { text: "", delay: 80 },
      { text: "  Nodes: 81", color: "text-neutral-300", delay: 200 },
      { text: "  ├─ Concepts (20)", color: "text-[#32f3e9]", delay: 100 },
      { text: "  ├─ Experiences (31)", color: "text-[#22ff73]", delay: 100 },
      { text: "  ├─ Principles (14)", color: "text-[#b39aff]", delay: 100 },
      { text: "  ├─ Decisions (10)", color: "text-yellow-400", delay: 100 },
      { text: "  ├─ Failures (11)", color: "text-red-400", delay: 100 },
      { text: "  └─ Architectures (5)", color: "text-[#32f3e9]", delay: 100 },
      { text: "", delay: 200 },
      { text: "  Edges: 456", color: "text-neutral-300", delay: 200 },
      { text: "  ──", color: "text-neutral-600", delay: 100 },
      { text: "  authentication ──► jwt", color: "text-[#32f3e9]", delay: 150 },
      { text: "  jwt ──► spring-security", color: "text-[#32f3e9]", delay: 100 },
      { text: "  deployment ──► docker", color: "text-[#32f3e9]", delay: 100 },
      { text: "", delay: 200 },
      { text: "  Graph traversal depth: 3", color: "text-neutral-400", delay: 200 },
    ],
  },
  {
    label: "learn",
    command: "shin learn",
    lines: [
      { text: "", delay: 80 },
      { text: "  Recording experience...", color: "text-neutral-400", delay: 400 },
      { text: "", delay: 80 },
      { text: "  Task: JWT 403 Fix", color: "text-neutral-300", delay: 200 },
      { text: "  Root cause: Public routes intercepted by filter", color: "text-neutral-400", delay: 100 },
      { text: "  Solution: Exclude public routes from filter chain", color: "text-[#22ff73]", delay: 100 },
      { text: "", delay: 200 },
      { text: "  Updating confidence scores...", color: "text-neutral-400", delay: 300 },
      { text: "  exp-jwt-403 confidence: 0.85 → 0.92", color: "text-[#32f3e9]", delay: 150 },
      { text: "  principle-public-routes confidence: 0.88 → 0.92", color: "text-[#32f3e9]", delay: 150 },
      { text: "", delay: 200 },
      { text: "  Graph updated. New edge:", color: "text-neutral-400", delay: 200 },
      { text: "  jwt ──► exp-jwt-403 [strength: 0.92]", color: "text-[#b39aff]", delay: 150 },
      { text: "", delay: 200 },
      { text: "  ✓ Experience recorded. Engine is smarter.", color: "text-[#22ff73]", delay: 300 },
    ],
  },
];

function TerminalHero() {
  return (
    <TerminalAnimationRoot
      tabs={shinTabs}
      alwaysDark
      hideCursorOnComplete
      className="relative overflow-hidden"
    >
      <TerminalAnimationBackgroundGradient />
      <div className="relative z-10 flex flex-col items-center pt-24 pb-16 md:pt-32 md:pb-24 px-4">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-300">
              SHIN
            </span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-[family-name:var(--font-geist-mono)]">
            AI agents have knowledge but no experience.
            <br />
            <span className="text-zinc-200 font-semibold">
              SHIN gives them the latter.
            </span>
          </p>
        </div>

        <TerminalAnimationContainer>
          <TerminalWindowFrame />
        </TerminalAnimationContainer>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <code className="px-5 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 text-sm font-[family-name:var(--font-geist-mono)]">
            npx shin-engine start
          </code>
          <a
            href="#get-started"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
          >
            Get Started
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </TerminalAnimationRoot>
  );
}

function TerminalWindowFrame() {
  const { tabs, activeTab, setActiveTab } = useTerminalAnimation();

  return (
    <TerminalAnimationWindow
      backgroundColor="#0f0f14"
      minHeight="26rem"
      className="border border-zinc-800 shadow-2xl shadow-violet-900/20"
    >
      <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 border-b border-zinc-800">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <TerminalAnimationTabList className="ml-4 flex gap-1">
          {tabs.map((tab, i) => (
            <TerminalAnimationTabTrigger
              key={i}
              index={i}
              className={`px-3 py-1 text-xs rounded-md transition-colors font-[family-name:var(--font-geist-mono)] ${
                activeTab === i
                  ? "bg-zinc-800 text-zinc-100"
                  : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {tab.label}
            </TerminalAnimationTabTrigger>
          ))}
        </TerminalAnimationTabList>
      </div>

      <TerminalAnimationContent>
        <div className="flex items-center gap-2 text-sm font-[family-name:var(--font-geist-mono)] text-zinc-400 mb-1">
          <span className="text-[#22ff73]">$</span>
          <TerminalAnimationCommandBar />
          <TerminalAnimationBlinkingCursor />
        </div>
        <TerminalAnimationOutput
          renderLine={(line, i, visible) => (
            <div
              key={`${activeTab}-${i}`}
              className={`text-sm font-[family-name:var(--font-geist-mono)] leading-6 ${
                visible ? "opacity-100" : "opacity-0"
              } transition-opacity duration-100`}
            >
              <span className={line.color || "text-zinc-300"}>
                {line.text || "\u00A0"}
              </span>
            </div>
          )}
        />
        <TerminalAnimationTrailingPrompt>
          <span className="text-[#22ff73] text-sm font-[family-name:var(--font-geist-mono)]">$</span>
          <TerminalAnimationBlinkingCursor />
        </TerminalAnimationTrailingPrompt>
      </TerminalAnimationContent>
    </TerminalAnimationWindow>
  );
}

const features = [
  {
    title: "Persistent Judgment",
    description:
      "Every task passes through a layer of accumulated engineering experience before planning begins. Never solve the same problem twice.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
      </svg>
    ),
  },
  {
    title: "Knowledge Graph",
    description:
      "81 nodes and 456 edges across Concepts, Experiences, Principles, Decisions, Failures, and Architectures. Interconnected engineering wisdom.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
      </svg>
    ),
  },
  {
    title: "Reflection Engine",
    description:
      "Concept resolution → BFS graph traversal → evidence assembly → synthesis. Delivers a judgment package with lessons, warnings, and recommendations.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
      </svg>
    ),
  },
  {
    title: "Learning Loop",
    description:
      "Every review teaches the engine. Confidence scores update, new edges form, and the knowledge graph grows organically with each use.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
      </svg>
    ),
  },
];

const links = [
  {
    label: "GitHub",
    href: "https://github.com/anomalyco/shin",
    description: "Source code & issues",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "npm",
    href: "https://www.npmjs.com/package/shin-engine",
    description: "shin-engine package",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 7.334v8h6.666v1.332H12v-1.332h12V7.334H0zM24 14h-2.667V9.334h-1.333v4.666H16v-4.666h-1.333v4.666H9.333V9.334H8v4.666H6.667v-4.666H5.334v4.666H2.667V9.334H1.333v4.666H0V8.667h24V14z" />
      </svg>
    ),
  },
  {
    label: "API Docs",
    href: "#",
    description: "REST API reference",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
];

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    document.documentElement.style.colorScheme = next;
    localStorage.setItem("shin-theme", next);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
            SHIN
          </span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/anomalyco/shin"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://www.npmjs.com/package/shin-engine"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              npm
            </a>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      <TerminalHero />

      <section className="border-t border-zinc-800/60 py-20 md:py-28 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              What{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
                SHIN
              </span>{" "}
              does
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto">
              A persistent engineering judgment layer for AI coding agents.
              Knowledge + experience = better planning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-zinc-800/60 bg-zinc-900/50 p-6 hover:border-zinc-700/60 transition-colors"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-violet-600/10 text-violet-400 group-hover:bg-violet-600/20 transition-colors">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-lg">{f.title}</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="get-started"
        className="border-t border-zinc-800/60 py-20 md:py-28 px-4"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Get started in seconds
          </h2>
          <p className="text-zinc-400 mb-8">
            Works with any AI coding agent. Requires Java 21+.
          </p>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden text-left">
            <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-800">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              <span className="ml-2 text-xs text-zinc-500 font-[family-name:var(--font-geist-mono)]">
                terminal
              </span>
            </div>
            <div className="p-4 md:p-6 font-[family-name:var(--font-geist-mono)] text-sm space-y-2">
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-[#22ff73]">$</span>
                <span>npm install -g shin-engine</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400">
                <span className="text-[#22ff73]">$</span>
                <span>shin start</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 mt-4">
                <span className="text-[#22ff73]">$</span>
                <span className="text-zinc-300">
                  shin review &ldquo;Implement JWT authentication&rdquo;
                </span>
              </div>
              <div className="pl-5 text-[#22ff73] animate-caret-blink">
                _
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <a
              href="https://www.npmjs.com/package/shin-engine"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M0 7.334v8h6.666v1.332H12v-1.332h12V7.334H0z" />
              </svg>
              View on npm
            </a>
            <a
              href="https://github.com/anomalyco/shin"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-medium transition-colors"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              Source on GitHub
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-zinc-800/60 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            {links.map((link, i) => (
              <a
                key={i}
                href={link.href}
                className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/30 hover:bg-zinc-900/60 hover:border-zinc-700/60 transition-colors group"
              >
                <div className="p-2 rounded-lg bg-zinc-800 text-zinc-400 group-hover:text-zinc-200 transition-colors">
                  {link.icon}
                </div>
                <div>
                  <div className="font-medium text-sm">{link.label}</div>
                  <div className="text-xs text-zinc-500">{link.description}</div>
                </div>
              </a>
            ))}
          </div>
          <div className="text-center text-xs text-zinc-600">
            SHIN — Engineering Experience Engine. MIT licensed.
          </div>
        </div>
      </footer>
    </>
  );
}
