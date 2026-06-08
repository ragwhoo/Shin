"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CoconutSplit } from "./coconut-split";

interface AboutData {
  subtitle: string;
  storyText: string;
}

export const About = () => {
  const [data, setData] = useState<AboutData | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [returned, setReturned] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const returnTimerRef = useRef<number>(0);
  const wasOutRef = useRef(false);

  useEffect(() => {
    const checkVisibility = () => {
      if (!sectionRef.current || !revealed) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const isOut = rect.bottom < 0 || rect.top > window.innerHeight;
      if (isOut && !wasOutRef.current) {
        wasOutRef.current = true;
        window.clearTimeout(returnTimerRef.current);
        setRevealed(false);
        setReturned(false);
        setResetKey((k) => k + 1);
      } else if (!isOut) {
        wasOutRef.current = false;
      }
    };

    window.addEventListener("scroll", checkVisibility, { passive: true });
    return () => window.removeEventListener("scroll", checkVisibility);
  }, [revealed]);

  useEffect(() => {
    fetch("/content/about.json")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, []);

  const handleSplit = () => {
    setRevealed(true);
    returnTimerRef.current = window.setTimeout(() => setReturned(true), 1500);
  };

  if (!data) return null;

  const paragraphs = data.storyText.split("\n\n").filter(Boolean);

  return (
    <section
      ref={sectionRef}
      id="about"
      className={`h-screen relative overflow-hidden ${
        returned ? "bg-[#365F37]" : revealed ? "bg-[#fdffee]" : "bg-[#365F37]"
      }`}
    >
      <AnimatePresence>
        {!revealed && (
          <motion.div
            key="hidden-text"
            className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="text-center">
              <p className="font-black text-[clamp(5rem,14vw,14rem)] text-[#fdffee] leading-[0.85] uppercase tracking-[-0.04em]">
                Organic
              </p>
              <p className="font-black text-[clamp(5rem,14vw,14rem)] text-[#fdffee] leading-[0.85] uppercase tracking-[-0.04em] mt-4">
                Unadultrated
              </p>
              <p className="font-black text-[clamp(5rem,14vw,14rem)] text-[#fdffee] leading-[0.85] uppercase tracking-[-0.04em] mt-4">
                Natural
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {revealed && !returned && (
          <motion.div
            className="fixed inset-0 z-[85] bg-[#fdffee]"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: "circle(200% at 50% 50%)" }}
            exit={{ opacity: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          />
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-[90] pointer-events-none">
        <div className="pointer-events-auto w-full h-full">
          <CoconutSplit key={resetKey} onSplit={handleSplit} />
        </div>
      </div>

      {revealed && (
        <div className="absolute inset-0 z-[95] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center max-w-3xl mx-auto px-6"
          >
            <span className={`mb-3 block text-xs font-medium tracking-[0.25em] uppercase transition-colors duration-[450ms] ${
              returned ? "text-[#fdffee]/70" : "text-[#355E3B]/70"
            }`}>
              Our Story
            </span>
            <h2 className={`text-[clamp(3.5rem,10vw,10rem)] font-black leading-[0.85] tracking-[-0.04em] transition-colors duration-[450ms] ${
              returned ? "text-[#fdffee]" : "text-[#355E3B]"
            }`}>
              About
            </h2>
            <p className={`mt-6 mx-auto max-w-2xl text-sm tracking-[0.15em] uppercase transition-colors duration-[450ms] ${
              returned ? "text-[#fdffee]/70" : "text-[#355E3B]/70"
            }`}>
              {data.subtitle}
            </p>
            <div className="mt-10 text-justify">
              {paragraphs.map((p, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  className={`mb-4 leading-relaxed transition-colors duration-[450ms] ${
                    returned ? "text-[#fdffee]/80" : "text-[#355E3B]/80"
                  }`}
                >
                  {p}
                </motion.p>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
};






