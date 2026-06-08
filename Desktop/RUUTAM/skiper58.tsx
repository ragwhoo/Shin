"use client";

import { motion } from "framer-motion";
import React from "react";

import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Home",
    href: "#home",
    description: "[0]",
  },
  {
    name: "About",
    href: "#about",
    description: "[1]",
  },
  {
    name: "Products",
    href: "#products",
    description: "[2]",
  },
  {
    name: "Benefits",
    href: "#benefits",
    description: "[3]",
  },
  {
    name: "Contact",
    href: "#contact",
    description: "[5]",
  },
];

interface Skiper58Props {
  onNavigate?: () => void;
}

export const Skiper58 = ({ onNavigate }: Skiper58Props) => {
  return (
    <ul className="bs flex min-h-full w-full flex-1 flex-col items-center justify-center gap-1.5 rounded-2xl px-7 py-3 backdrop-blur-sm">
      {navigationItems.map((item, index) => (
        <li
          className="relative flex cursor-pointer flex-col items-center overflow-visible"
          key={index}
        >
          <a href={item.href} onClick={(e) => {
            e.preventDefault();
            const el = document.querySelector(item.href);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              setTimeout(() => onNavigate?.(), 400);
            }
          }}>
            <div className="relative flex items-start">
              <TextRoll
                center
                className="text-[clamp(3rem,8vw,8rem)] font-black uppercase leading-[0.85] tracking-[-0.04em] transition-colors"
              >
                {item.name}
              </TextRoll>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};

const STAGGER = 0.035;

const TextRoll: React.FC<{
  children: string;
  className?: string;
  center?: boolean;
}> = ({ children, className, center = false }) => {
  return (
    <motion.span
      initial="initial"
      whileHover="hovered"
      className={cn("relative block overflow-hidden", className)}
      style={{
        lineHeight: 0.75,
      }}
    >
      <div>
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: 0,
                },
                hovered: {
                  y: "-100%",
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
      <div className="absolute inset-0">
        {children.split("").map((l, i) => {
          const delay = center
            ? STAGGER * Math.abs(i - (children.length - 1) / 2)
            : STAGGER * i;

          return (
            <motion.span
              variants={{
                initial: {
                  y: "100%",
                },
                hovered: {
                  y: 0,
                },
              }}
              transition={{
                ease: "easeInOut",
                delay,
              }}
              className="inline-block"
              key={i}
            >
              {l}
            </motion.span>
          );
        })}
      </div>
    </motion.span>
  );
};

export { TextRoll };
