"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";

import PillNav from "@/components/ui/PillNav"
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
    label: "install",
    command: "npm install -g shin-engine",
    lines: [
      { text: "", delay: 80 },
      { text: "  Installing shin-engine...", color: "text-neutral-400", delay: 400 },
      { text: "  ✓ shin-engine@0.1.0 installed globally", color: "text-[#22ff73]", delay: 300 },
      { text: "  ✓ Command 'shin' registered in PATH", color: "text-[#22ff73]", delay: 200 },
      { text: "", delay: 150 },
      { text: "  Ready.", color: "text-[#32f3e9]", delay: 200 },
    ],
  },
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

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
        <PillNav
          logo="/shin-logo.png"
          logoAlt="SHIN"
          items={[
            { label: "Home", href: "/" },
            { label: "GitHub", href: "https://github.com/anomalyco/shin" },
            { label: "npm", href: "https://www.npmjs.com/package/shin-engine" },
          ]}
          activeHref="/"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </div>

      <div
        className="min-h-screen bg-cover bg-center flex flex-col"
        style={{ backgroundImage: "url(/bamkin.png)" }}
      >
      <div className="flex-1 flex flex-col items-center px-4 pt-32">
        <div className="text-center mb-16">
          <h1
            className="text-5xl md:text-7xl font-bold tracking-tight text-white"
            style={{ textShadow: "0 0 20px rgba(0,0,0,0.6), 0 0 50px rgba(0,0,0,0.4), 0 0 80px rgba(0,0,0,0.2)" }}
          >
            SHIN
          </h1>
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
    <section className="min-h-screen bg-zinc-900" />
  </>);
}
