"use client";

import { useEffect } from "react";
import Link from "next/link";
import Lenis from "lenis";

export default function DocsPage() {
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
    <div className="min-h-screen bg-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/" className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
            ← SHIN
          </Link>
          <span className="text-sm text-neutral-400">Documentation</span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-28 pb-32">
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-[1.15]">
            SHIN Documentation
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl leading-relaxed">
            SHIN is the <strong>Engineering Experience Engine</strong> — a persistent engineering judgment layer for AI coding agents. It transforms accumulated engineering experience into actionable recommendations before planning begins.
          </p>
        </div>

        <div className="space-y-20">
          <section id="overview">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Overview</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                AI coding agents have access to all the world's knowledge — documentation, tutorials, and open-source code. But knowledge alone isn't experience. Agents repeatedly solve the same problems because they don't accumulate engineering judgment across sessions.
              </p>
              <p>
                SHIN solves this by providing a <strong>persistent engineering knowledge graph</strong> that captures concepts, experiences, principles, decisions, failures, and architectures. Every interaction teaches the system, making AI agents smarter over time.
              </p>
              <p>
                SHIN is <strong>not</strong> a memory database. It is a judgment layer that sits between a task and an AI agent's planning process, transforming accumulated experience into actionable recommendations before planning begins.
              </p>
            </div>
          </section>

          <section id="architecture">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Architecture</h2>
            <div className="space-y-6 text-neutral-600 leading-relaxed">
              <p>SHIN has a dual-repository architecture:</p>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">1. Engineering Brain</h3>
                <p>The knowledge repository — a human-readable, AI-readable, git-versioned, portable YAML knowledge graph. It is the source of truth, independent from the engine.</p>
                <pre className="mt-3 bg-neutral-900 text-zinc-300 p-4 rounded-xl text-sm font-mono overflow-x-auto">
{`engineering-brain/
  concepts/       -- 20 concept files
  experiences/    -- 34 experience files
  principles/     -- 14 principle files
  decisions/      -- 10 decision files
  failures/       -- 11 failure files
  architectures/  -- 5 architecture files
  graph/          -- knowledge graph edges with weights
  analytics/      -- usage logging`}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">2. Experience Engine</h3>
                <p>The runtime — a Spring Boot backend (Java 21) + Next.js frontend that serves the brain data via REST API. It processes tasks through the Reflection Engine pipeline.</p>
              </div>
            </div>
          </section>

          <section id="knowledge-model">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Knowledge Model</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">The brain is composed of 6 node types connected by a weighted graph:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-neutral-600">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 font-semibold text-neutral-900">Node Type</th>
                    <th className="text-left py-3 font-semibold text-neutral-900">Purpose</th>
                    <th className="text-left py-3 font-semibold text-neutral-900">Example</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr><td className="py-3 font-mono text-blue-600">Concept</td><td className="py-3">Primary entry point to the graph</td><td className="py-3 text-zinc-500">authentication</td></tr>
                  <tr><td className="py-3 font-mono text-blue-600">Experience</td><td className="py-3">Solved engineering situations</td><td className="py-3 text-zinc-500">JWT filter blocked public routes</td></tr>
                  <tr><td className="py-3 font-mono text-blue-600">Principle</td><td className="py-3">Generalized engineering lessons</td><td className="py-3 text-zinc-500">Public routes must bypass auth</td></tr>
                  <tr><td className="py-3 font-mono text-blue-600">Decision</td><td className="py-3">Engineering trade-offs</td><td className="py-3 text-zinc-500">JWT vs Sessions</td></tr>
                  <tr><td className="py-3 font-mono text-blue-600">Failure</td><td className="py-3">Mistakes worth avoiding</td><td className="py-3 text-zinc-500">Agent reset lost changes</td></tr>
                  <tr><td className="py-3 font-mono text-blue-600">Architecture</td><td className="py-3">Reusable system designs</td><td className="py-3 text-zinc-500">Spring Boot JWT layout</td></tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-2 text-neutral-600 leading-relaxed">
              <p><strong>Relationship types:</strong> <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">RELATES_TO</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">DERIVED_FROM</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">CAUSED_BY</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">SOLVED_BY</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">INFLUENCES</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">CONTRADICTS</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">USED_IN</code>, <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-xs font-mono">APPLIES_TO</code></p>
              <p>Each relationship has a <strong>weight</strong> (0.0–1.0) indicating connection strength.</p>
            </div>
          </section>

          <section id="reflection-engine">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Reflection Engine</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">The core runtime processes tasks through a 4-step pipeline:</p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <h3 className="font-semibold text-neutral-900">Concept Resolution</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mt-1">Match task text to known concepts via title, synonym, and tag matching.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <h3 className="font-semibold text-neutral-900">Graph Traversal</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mt-1">BFS from resolved concepts through the knowledge graph (max depth 3).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <h3 className="font-semibold text-neutral-900">Evidence Assembly</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mt-1">Collect, deduplicate, and rank connected nodes by score (40% concept match + 30% graph distance + 20% confidence + 10% usage).</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <h3 className="font-semibold text-neutral-900">Reflection Synthesis</h3>
                  <p className="text-neutral-600 text-sm leading-relaxed mt-1">Transform evidence into structured Lessons, Warnings, and Recommendations returned as a JSON judgment package.</p>
                </div>
              </div>
            </div>
          </section>

          <section id="quickstart">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Quick Start</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>Install SHIN globally via npm:</p>
              <pre className="bg-neutral-900 text-amber-100 p-4 rounded-xl text-sm font-mono overflow-x-auto">
                <span className="text-amber-200">$</span> npm install -g shin-engine
              </pre>
              <p>Once installed, the <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-sm font-mono">shin</code> command is available globally.</p>
            </div>
          </section>

          <section id="cli">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">CLI Commands</h2>
            <div className="space-y-3">
              {[
                { cmd: "shin start", desc: "Start the Experience Engine server" },
                { cmd: "shin stop", desc: "Stop the running server" },
                { cmd: "shin status", desc: "Check server status and health" },
                { cmd: "shin view", desc: "Open the frontend dashboard" },
              ].map((c) => (
                <div key={c.cmd} className="flex items-center gap-4 py-2">
                  <code className="text-amber-200 bg-neutral-900 px-3 py-1.5 rounded-lg text-sm font-mono shrink-0">{c.cmd}</code>
                  <span className="text-neutral-500 text-sm">{c.desc}</span>
                </div>
              ))}
            </div>
          </section>

          <section id="api">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">REST API</h2>
            <p className="text-neutral-600 leading-relaxed mb-6">Base: <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-sm font-mono">/api/v1</code></p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-neutral-600">
                <thead>
                  <tr className="border-b border-neutral-200">
                    <th className="text-left py-3 font-semibold text-neutral-900">Method</th>
                    <th className="text-left py-3 font-semibold text-neutral-900">Endpoint</th>
                    <th className="text-left py-3 font-semibold text-neutral-900">Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  <tr><td className="py-3"><span className="text-green-600 font-mono">GET</span></td><td className="py-3 font-mono">/concepts</td><td className="py-3">List all concepts</td></tr>
                  <tr><td className="py-3"><span className="text-green-600 font-mono">GET</span></td><td className="py-3 font-mono">/experiences</td><td className="py-3">List all experiences</td></tr>
                  <tr><td className="py-3"><span className="text-green-600 font-mono">GET</span></td><td className="py-3 font-mono">/principles</td><td className="py-3">List all principles</td></tr>
                  <tr><td className="py-3"><span className="text-green-600 font-mono">GET</span></td><td className="py-3 font-mono">/graph</td><td className="py-3">Full knowledge graph</td></tr>
                  <tr><td className="py-3"><span className="text-blue-600 font-mono">POST</span></td><td className="py-3 font-mono">/review</td><td className="py-3">Submit task for judgment</td></tr>
                  <tr><td className="py-3"><span className="text-blue-600 font-mono">POST</span></td><td className="py-3 font-mono">/learn</td><td className="py-3">Add new experience</td></tr>
                  <tr><td className="py-3"><span className="text-green-600 font-mono">GET</span></td><td className="py-3 font-mono">/analytics/overview</td><td className="py-3">Dashboard stats</td></tr>
                </tbody>
              </table>
            </div>
          </section>

          <section id="evaluation">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Evaluation Framework</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                The primary KPI is the <strong>Planning Improvement Rate (PIR)</strong>. For each task, the baseline plan (without reflection) is compared against the reflected plan (with SHIN). 
              </p>
              <p>Metrics measured: risks identified, failures avoided, pattern reuse, architectural consistency, and planning quality.</p>
              <p className="text-sm bg-blue-50 text-blue-700 p-4 rounded-xl">
                <strong>Example:</strong> For JWT authentication implementation, the plan without reflection scored 4/10, while the plan with SHIN reflection scored 8/10 — a 100% improvement.
              </p>
            </div>
          </section>

          <section id="storage">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Storage Strategy</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p><strong>V1 (Current):</strong> YAML + InMemoryGraphStore — the entire graph is rebuilt at startup from YAML files. No database needed.</p>
              <div className="space-y-2 text-sm">
                <p><strong>Roadmap:</strong></p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>V2:</strong> PostgreSQL + pgvector for persistence and vector search</li>
                  <li><strong>V3:</strong> Automatic Git commit extraction, Agent SDK, embedding search, team/community brains</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="tech-stack">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Tech Stack</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                ["Backend", "Java 21, Spring Boot 3.3, Maven, SnakeYAML"],
                ["Frontend", "Next.js 14, TypeScript, TailwindCSS, React Flow"],
                ["CLI", "Node.js (npm package: shin-engine)"],
                ["Distribution", "GitHub Releases, npm"],
                ["Data Format", "YAML (git-versioned, human-readable)"],
                ["Graph", "BFS with configurable max depth"],
              ].map(([label, value]) => (
                <div key={label} className="border border-neutral-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-1">{label}</p>
                  <p className="text-sm text-neutral-700">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="support">
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Support</h2>
            <p className="text-neutral-600 leading-relaxed">
              For issues, feature requests, or questions, visit the{" "}
              <a href="https://github.com/ragwhoo/Shin.git" className="text-blue-500 hover:text-blue-600 underline">GitHub repository</a>{" "}
              or reach out to <a href="mailto:ragwhooooo@gmail.com" className="text-blue-500 hover:text-blue-600 underline">ragwhooooo@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
