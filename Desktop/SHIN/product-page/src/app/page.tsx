"use client";

import { useEffect, useState, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import PillNav from "@/components/ui/PillNav"
import { Footer10 } from "@/components/watermelon-ui/footer-10"
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

gsap.registerPlugin(ScrollTrigger);

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
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    requestAnimationFrame(() => window.scrollTo(0, 0));
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".hero-bg", { opacity: 0, filter: "blur(12px)" });
      gsap.set(".hero-heading", { opacity: 0, filter: "blur(12px)", y: 60 });
      gsap.set(".hero-subtitle", { opacity: 0, filter: "blur(12px)", y: 60 });
      gsap.set(".hero-cta", { opacity: 0, filter: "blur(12px)", y: 60 });
      gsap.set(".hero-scroll", { opacity: 0 });

      const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
      heroTl.to(".hero-bg", { opacity: 1, filter: "blur(0px)", duration: 1.5 })
           .to(".hero-heading", { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.5 }, "-=0.8")
           .to(".hero-subtitle", { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.5 }, "-=0.8")
           .to(".hero-cta", { opacity: 1, filter: "blur(0px)", y: 0, duration: 1.5 }, "-=0.8")
           .to(".hero-scroll", { opacity: 1, duration: 1 }, "-=0.4");
    });

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          } else {
            entry.target.classList.remove("visible");
          }
        });
      },
      { threshold: 0, rootMargin: "-50px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ duration: 1.2 });
    lenis.on("scroll", ScrollTrigger.update);
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  const handleGetStarted = () => {
    const el = document.getElementById("install");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4">
        <PillNav
          logo="/shin-logo.png"
          logoAlt="SHIN"
          items={[
            { label: "Home", href: "/" },
            { label: "Docs", href: "/docs" },
            { label: "GitHub", href: "https://github.com/ragwhoo/Shin.git", target: "_blank", rel: "noopener noreferrer" },
            { label: "npm", href: "https://www.npmjs.com/package/shin-engine", target: "_blank", rel: "noopener noreferrer" },
          ]}
          activeHref="/"
          baseColor="#000000"
          pillColor="#ffffff"
          hoveredPillTextColor="#ffffff"
          pillTextColor="#000000"
        />
      </div>

      <div className="min-h-screen flex flex-col bg-black relative overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center pointer-events-none hero-bg" style={{ backgroundImage: "url(/bg2.png)" }} />
      <div className="flex-1 flex flex-col items-center px-4 pt-32 relative z-10">
        <div className="text-center mb-16">
          <h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white leading-[1.1] hero-heading"
          >
            Engineering,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-300">
              REMEMBERED.
            </span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white max-w-xl mx-auto hero-subtitle">
            SHIN: Persistent engineering judgment for AI coding agents.
          </p>
          <a
            href="#install"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/10 hover:border-white/30 transition-all duration-300 hero-cta"
          >
            Get Started
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>

        <div className="w-full flex-1 flex flex-col items-center hero-terminal">
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
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 hero-scroll">
        <span className="text-zinc-500 text-xs tracking-widest uppercase">Scroll</span>
        <div className="w-5 h-8 rounded-full border-2 border-zinc-600 flex justify-center pt-1.5">
          <div className="w-1 h-2 rounded-full bg-zinc-400 animate-[scroll-bounce_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
    <section className="min-h-screen bg-white why-shin-section">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-20 why-shin-heading reveal">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold text-neutral-900 leading-[1.1]">
            <span className="whitespace-nowrap">Knowledge isn't</span>{" "}
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#3b82f6,#93c5fd,#fbcfe8)]">
              EXPERIENCE
            </span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8 why-shin-grid">
          {[
            {
              title: "Persistent Memory",
              description: "Every review, every fix, every lesson learned becomes part of a growing engineering knowledge graph that your agents carry forward.",
              gradient: "from-blue-500/10 via-blue-400/5 to-transparent",
              icon: (
                <svg className="w-8 h-8 text-blue-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              ),
              iconBg: "bg-blue-50 text-blue-600",
            },
            {
              title: "Judgment, Not Just Code",
              description: "SHIN doesn't just read your codebase — it understands the context, the tradeoffs, and the engineering principles behind every decision.",
              gradient: "from-amber-200/20 via-amber-100/10 to-transparent",
              icon: (
                <svg className="w-8 h-8 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12l2 2 4-4" />
                  <path d="M12 2a10 10 0 1 0 10 10" />
                </svg>
              ),
              iconBg: "bg-amber-50 text-amber-600",
            },
            {
              title: "Experience That Ships",
              description: "Confidence scores, warnings, and actionable recommendations — every agent response comes backed by real engineering experience, not just pattern matching.",
              gradient: "from-pink-500/10 via-pink-400/5 to-transparent",
              icon: (
                <svg className="w-8 h-8 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14" />
                  <path d="M12 5l7 7-7 7" />
                </svg>
              ),
              iconBg: "bg-pink-50 text-pink-600",
            },
          ].map((feature, i) => (
            <div
              key={feature.title}
              className={`group relative rounded-2xl border border-neutral-200 bg-white p-8 transition-all duration-300 hover:border-neutral-300 hover:shadow-lg hover:-translate-y-1 why-shin-card reveal`}
            >
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${feature.iconBg}`}>
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
    <section className="min-h-screen bg-white flex items-center install-section" id="install">
      <div className="max-w-6xl mx-auto px-6 py-24 md:py-32 w-full">
        <div className="text-center mb-12 install-heading reveal">
          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-neutral-900 leading-[1.1]">
            <span className="whitespace-nowrap">Install in</span>
            <br />
            <span className="text-transparent bg-clip-text bg-[linear-gradient(to_right,#3b82f6,#93c5fd,#fbcfe8)]">
              ONE COMMAND
            </span>
          </h2>
        </div>
        <div className="w-full max-w-2xl mx-auto install-terminal reveal">
          <div className="rounded-xl border border-zinc-800 bg-[#0f0f14] shadow-2xl shadow-black/40 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-zinc-800">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-4 px-3 py-1 text-xs rounded-md bg-zinc-800 text-zinc-100">install</span>
            </div>
            <div className="p-5 font-mono text-sm space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-amber-200">$</span>
                <span className="text-amber-100">npm install -g shin-engine</span>
                <span className="w-2 h-5 bg-amber-200/70 animate-pulse" />
              </div>
              <div className="text-amber-100/70 space-y-1">
                <div>⠋ fetching package metadata...</div>
                <div>✔ resolved 1 package</div>
                <div>⠙ installing...</div>
                <div>✔ installed shin-engine v1.0.0</div>
              </div>
            </div>
          </div>
          <p className="text-center text-neutral-500 text-lg mt-8">
            — and ship with confidence.
          </p>
        </div>
      </div>
    </section>
    <Footer10
      bannerTagline="Engineering, Remembered"
      bannerHeading="Give your AI agents the experience they need to ship with confidence."
      bannerCtaLabel="Get Started"
      bannerCtaHref="#install"
      bannerBackgroundImage="/bg2.png"
      contactLabel="Reach out :"
      contactEmail="ragwhooooo@gmail.com"
      contactEmailHref="mailto:ragwhooooo@gmail.com"
      description="SHIN is the engineering memory layer for AI coding agents. Every review, every fix, every lesson learned — preserved and actionable."
      newsletterPlaceholder="Your email"
      brandName="SHIN"
      copyright="© 2026 SHIN. All rights reserved."
      linkColumns={[
        {
          title: "Product",
          links: [
            { label: "Overview", href: "#" },
            { label: "Features", href: "#" },
            { label: "Documentation", href: "/docs" },
          ],
        },
        {
          title: "Resources",
          links: [
            { label: "GitHub", href: "https://github.com/ragwhoo/Shin.git" },
            { label: "npm", href: "https://www.npmjs.com/package/shin-engine" },
            { label: "Blog", href: "#" },
            { label: "Support", href: "#" },
          ],
        },
        {
          title: "Legal",
          links: [
            { label: "Privacy", href: "#" },
            { label: "Terms", href: "#" },
            { label: "Cookies", href: "#" },
          ],
        },
      ]}
    />
  </>);
}
