"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HeroVideo } from "@/components/video-scrub";
import { Skiper58 } from "@/skiper58";

import { About } from "@/components/about";
import { ProductGallery } from "@/components/product-gallery";
import { Benefits } from "@/components/benefits";
import { Contact } from "@/components/contact";
import { SmoothScroll } from "@/components/smooth-scroll";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
    <SmoothScroll>
       <main>
          <HeroVideo />
        <About />
        <ProductGallery />
        <Benefits />
        <Contact />
       </main>
     </SmoothScroll>

      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-6 right-6 z-[100] h-12 w-12 rounded-full bg-[#fdffee] text-[#355E3B] flex items-center justify-center text-lg font-black shadow-lg hover:scale-105 transition-transform"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="menu-overlay"
            className="fixed inset-0 z-[90] flex items-center justify-center"
            initial={{ clipPath: "circle(0px at calc(100% - 3rem) 3rem)" }}
            animate={{ clipPath: "circle(200% at calc(100% - 3rem) 3rem)" }}
            exit={{ clipPath: "circle(0px at calc(100% - 3rem) 3rem)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ backgroundColor: "#fdffee" }}
          >
            <div className="text-[#355E3B]">
              <Skiper58 onNavigate={() => setMenuOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  );
}

