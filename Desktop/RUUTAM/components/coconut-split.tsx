"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export const CoconutSplit = () => {
  const [stage, setStage] = useState<"full" | "breaking" | "split">("full");

  const handleClick = () => {
    if (stage === "full") setStage("breaking");
    else if (stage === "breaking") setStage("split");
  };

  return (
    <div
      className="relative flex items-center justify-center cursor-pointer select-none"
      style={{ height: 200 }}
      onClick={handleClick}
    >
      <AnimatePresence>
        {stage === "full" && (
          <motion.img
            key="full"
            src="/cococo-v2/full.png"
            alt=""
            className="absolute h-48 w-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}

        {stage === "breaking" && (
          <motion.img
            key="breaking"
            src="/cococo-v2/breaking.png"
            alt=""
            className="absolute h-48 w-auto"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.05, 1], opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        )}

        {stage === "split" && (
          <motion.div
            key="split"
            className="absolute flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src="/cococo-v2/left.png"
              alt=""
              className="h-32 w-auto"
              initial={{ x: 0 }}
              animate={{ x: -120 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="w-32" />
            <motion.img
              src="/cococo-v2/right.png"
              alt=""
              className="h-32 w-auto"
              initial={{ x: 0 }}
              animate={{ x: 120 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
