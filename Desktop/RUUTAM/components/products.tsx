"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Product {
  image: string;
  name: string;
  description: string;
}

export const Products = () => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/content/products.json")
      .then((r) => r.json())
      .then((d) => setItems(d.body || []))
      .catch(() => {});
  }, []);

  if (!items.length) return null;

  return (
    <section id="products" className="bg-[#365F37] px-6 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center"
        >
          <span className="mb-3 block text-xs font-medium tracking-[0.25em] uppercase text-[#fdffee]/70/70">
            Pure & Natural
          </span>
          <h2 className="text-[clamp(3.5rem,10vw,10rem)] font-black leading-[0.85] tracking-[-0.04em] text-[#fdffee]">
            Our Oils
          </h2>
          <p className="mt-6 mx-auto max-w-2xl text-sm tracking-[0.15em] uppercase text-[#fdffee]/70/70">
            Wood cold-pressed using traditional Marachekku machines
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 text-center">
          {items.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-xl bg-[#365F37] p-5 transition-colors hover:bg-[#365F37]/80"
            >
              <div className="mb-4 aspect-square overflow-hidden rounded-lg bg-black/20">
                <img
                  src={`/images/${product.image}`}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg font-semibold text-[#fdffee]">{product.name}</h3>
              <p className="mt-1 text-sm leading-relaxed text-[#fdffee]/60/60">
                {product.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};








