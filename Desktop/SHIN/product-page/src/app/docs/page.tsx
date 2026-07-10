"use client";

import Link from "next/link";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-24 md:py-32">
        <div className="mb-16">
          <Link href="/" className="text-sm text-blue-500 hover:text-blue-600 transition-colors mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-neutral-900 leading-[1.15]">
            SHIN Documentation
          </h1>
          <p className="mt-4 text-lg text-neutral-500 max-w-2xl">
            SHIN is the engineering memory layer for AI coding agents. It preserves every review, every fix, every lesson learned — making them persistent and actionable.
          </p>
        </div>

        <div className="space-y-16">
          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Quick Start</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>Install SHIN globally via npm:</p>
              <pre className="bg-neutral-900 text-amber-100 p-4 rounded-xl text-sm font-mono overflow-x-auto">
                <span className="text-amber-200">$</span> npm install -g shin-engine
              </pre>
              <p>Once installed, the <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-sm font-mono">shin</code> command is available globally. Run <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-sm font-mono">shin --help</code> to get started.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">What is SHIN?</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>
                AI coding agents have access to all the world's knowledge — documentation, tutorials, Stack Overflow answers, and open-source code. But knowledge alone isn't enough.
              </p>
              <p>
                SHIN gives AI agents something they can't get from training data alone: <strong>engineering experience</strong>. Every code review, every bug fix, every architectural decision, every lesson learned becomes part of a growing engineering knowledge graph that persists across sessions, projects, and teams.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Core Concepts</h2>
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Persistent Memory</h3>
                <p className="text-neutral-600 leading-relaxed">
                  SHIN maintains a persistent knowledge graph that grows with every interaction. Code reviews, debugging sessions, architectural decisions, and best practices are automatically captured and indexed. This memory persists across sessions, so your AI agents never forget what they've learned.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Judgment, Not Just Code</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Unlike traditional AI coding tools that only read your codebase, SHIN understands context, tradeoffs, and engineering principles. It surfaces relevant past decisions, warns about known pitfalls, and provides confidence scores for its recommendations.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Experience That Ships</h3>
                <p className="text-neutral-600 leading-relaxed">
                  Every agent response comes backed by real engineering experience. Confidence scores, warnings, and actionable recommendations help you ship with confidence — not just pattern matching.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Commands</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-2">Global Commands</h3>
                <pre className="bg-neutral-900 text-amber-100 p-4 rounded-xl text-sm font-mono overflow-x-auto space-y-1">
                  <div><span className="text-amber-200">$</span> shin init</div>
                  <div><span className="text-zinc-500">Initialize SHIN in your project</span></div>
                  <div><span className="text-amber-200">$</span> shin review</div>
                  <div><span className="text-zinc-500">Review code with SHIN's engineering context</span></div>
                  <div><span className="text-amber-200">$</span> shin learn</div>
                  <div><span className="text-zinc-500">Capture a lesson or decision</span></div>
                  <div><span className="text-amber-200">$</span> shin status</div>
                  <div><span className="text-zinc-500">View SHIN knowledge graph status</span></div>
                </pre>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Configuration</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>SHIN can be configured via a <code className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded text-sm font-mono">shin.config.json</code> file in your project root:</p>
              <pre className="bg-neutral-900 text-amber-100 p-4 rounded-xl text-sm font-mono overflow-x-auto">
{`{
"version": "1.0",
"memory": {
  "autoCapture": true,
  "maxEntries": 10000
},
"review": {
  "confidenceThreshold": 0.7,
  "includeWarnings": true
}
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Integration</h2>
            <div className="space-y-4 text-neutral-600 leading-relaxed">
              <p>SHIN integrates with popular AI coding assistants and CI/CD pipelines. Add SHIN to your workflow:</p>
              <pre className="bg-neutral-900 text-amber-100 p-4 rounded-xl text-sm font-mono overflow-x-auto">
                <span className="text-zinc-500"># CI/CD integration</span>
                <div><span className="text-amber-200">$</span> npx shin ci --check</div>
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Support</h2>
            <p className="text-neutral-600 leading-relaxed">
              For issues, feature requests, or questions, visit our <a href="https://github.com/anomalyco/shin" className="text-blue-500 hover:text-blue-600 underline">GitHub repository</a> or reach out to <a href="mailto:ragwhooooo@gmail.com" className="text-blue-500 hover:text-blue-600 underline">ragwhooooo@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
