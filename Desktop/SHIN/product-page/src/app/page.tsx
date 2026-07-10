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
      { text: "  Installing shin-engine...", color: "text-amber-100/70", delay: 400 },
      { text: "  ✓ shin-engine@0.1.0 installed globally", color: "text-amber-100", delay: 300 },
      { text: "  ✓ Command 'shin' registered in PATH", color: "text-amber-100", delay: 200 },
      { text: "", delay: 150 },
      { text: "  Ready.", color: "text-amber-200", delay: 200 },
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

      <div className="min-h-screen flex flex-col relative bg-black">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-blue-500/30 blur-[150px]" />
          <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full bg-pink-500/25 blur-[140px]" />
          <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] rounded-full bg-amber-100/35 blur-[150px]" />
        </div>
      <div className="flex-1 flex flex-col items-center px-4 pt-32">
        <div className="text-center mb-16">
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white leading-[1.1]"
          >
            Engineering,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-100 to-blue-400">
              Remembered.
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/60 max-w-xl mx-auto">
            Persistent engineering judgment for AI coding agents.
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
                  <span className="text-amber-200">$</span>
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
                  <span className="text-amber-200 text-sm">$</span>
                  <TerminalAnimationBlinkingCursor />
                </TerminalAnimationTrailingPrompt>
              </TerminalAnimationContent>
            </TerminalAnimationWindow>
          </TerminalAnimationContainer>
        </TerminalAnimationRoot>
      </div>
    </div>
    <section className="min-h-screen bg-white" />
  </>);
}
