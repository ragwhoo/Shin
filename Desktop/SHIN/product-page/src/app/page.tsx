"use client";

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
      className="relative overflow-hidden min-h-screen flex items-center justify-center"
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
            href="https://www.npmjs.com/package/shin-engine"
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

export default function Home() {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800/60 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 h-14">
          <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300">
            SHIN
          </span>
          <div className="flex items-center gap-4">
            <a href="https://github.com/anomalyco/shin" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">GitHub</a>
            <a href="https://www.npmjs.com/package/shin-engine" className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors">npm</a>
          </div>
        </div>
      </nav>
      <TerminalHero />
    </>
  );
}
