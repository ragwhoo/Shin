"use client";

import { useState } from "react";

import {
  TerminalAnimationRoot,
  TerminalAnimationContainer,
  TerminalAnimationWindow,
  TerminalAnimationContent,
  TerminalAnimationCommandBar,
  TerminalAnimationOutput,
  TerminalAnimationBlinkingCursor,
  TerminalAnimationTrailingPrompt,
  TerminalAnimationTabList,
  TerminalAnimationTabTrigger,
  type TabContent,
} from "@/components/ui/terminal-animation";

const tabs: TabContent[] = [
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

export default function Home() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col"
      style={{ backgroundImage: "url(/bamkin.png)" }}
    >
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <span className="text-lg font-bold text-white/90">SHIN</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/anomalyco/shin" className="text-sm text-white/60 hover:text-white/90 transition-colors">GitHub</a>
            <a href="https://www.npmjs.com/package/shin-engine" className="text-sm text-white/60 hover:text-white/90 transition-colors">npm</a>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-rose-200 to-fuchsia-200">
              SHIN
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            AI agents have knowledge but no experience.
            <br />
            <span className="text-white/90 font-semibold">SHIN gives them the latter.</span>
          </p>
        </div>

        <TerminalAnimationRoot
          tabs={tabs}
          activeTab={activeTab}
          onActiveTabChange={setActiveTab}
          alwaysDark
          hideCursorOnComplete
          className="w-full flex-1 flex flex-col items-center"
        >
          <TerminalAnimationContainer className="!pt-0 flex-1 flex flex-col">
            <TerminalAnimationWindow
              backgroundColor="#0f0f14"
              animateOnVisible={false}
              className="flex-1 border border-zinc-800 shadow-2xl shadow-black/40"
            >
              <div className="flex items-center gap-1.5 px-4 pt-3 pb-2 border-b border-zinc-800 shrink-0">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <TerminalAnimationTabList className="ml-4 flex gap-1">
                  {tabs.map((tab, i) => (
                    <TerminalAnimationTabTrigger
                      key={i}
                      index={i}
                      className={`px-3 py-1 text-xs rounded-md transition-colors ${
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

              <TerminalAnimationContent className="flex-1 overflow-y-hidden">
                <div className="flex items-center gap-2 text-sm text-zinc-400 mb-1">
                  <span className="text-[#22ff73]">$</span>
                  <TerminalAnimationCommandBar />
                </div>
                <TerminalAnimationOutput
                  renderLine={(line, index, visible) => {
                    if (!visible) return null;
                    return (
                      <div className="font-mono text-sm leading-relaxed">
                        <span className="text-zinc-600 mr-3 select-none">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <span className={line.color ?? "text-zinc-300"}>
                          {line.text || "\u00A0"}
                        </span>
                      </div>
                    );
                  }}
                />
                <TerminalAnimationTrailingPrompt>
                  <span className="text-[#22ff73] text-sm">$</span>
                  <TerminalAnimationBlinkingCursor />
                </TerminalAnimationTrailingPrompt>
              </TerminalAnimationContent>
            </TerminalAnimationWindow>
          </TerminalAnimationContainer>
        </TerminalAnimationRoot>
      </div>
    </div>
  );
}
