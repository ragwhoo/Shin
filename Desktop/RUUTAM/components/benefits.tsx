"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Benefit {
  title: string;
  description: string;
}

export const Benefits = () => {
  const [items, setItems] = useState<Benefit[]>([]);

  useEffect(() => {
    fetch("/content/benefits.json")
      .then((r) => r.json())
      .then((d) => setItems(d.body || []))
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <section id="benefits" className="bg-gradient-to-b from-[#3a5e3c] to-[#3d6b40] px-6 py-24">
      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center"
        >
          <span className="mb-3 block text-xs font-medium tracking-[0.25em] uppercase text-[#fdffee]/70">
            Why Choose Us
          </span>
          <h2 className="text-[clamp(3.5rem,10vw,10rem)] font-black leading-[0.85] tracking-[-0.04em] text-[#fdffee]">
            Benefits
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-sm tracking-[0.15em] uppercase text-[#fdffee]/70">
            Wood cold-pressed oils are richer in nutrients
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 text-center">
          {items.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="rounded-xl bg-[#365F37] p-6 border border-transparent hover:bg-[#fdffee] hover:border-[#355E3B]/20 transition-all duration-300 cursor-default group"
            >
              <h3 className="mb-2 text-base font-semibold text-[#fdffee] group-hover:text-[#355E3B] transition-colors duration-300">
                {benefit.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#fdffee]/60 group-hover:text-[#355E3B]/80 transition-colors duration-300">
                {benefit.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};



