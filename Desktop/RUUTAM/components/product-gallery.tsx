"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface Product {
  image: string;
  name: string;
  description: string;
}

export const ProductGallery = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    fetch("/content/products.json")
      .then((r) => r.json())
      .then((d) => setProducts(d.body || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!api) return;
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (!products.length) return null;

  return (
    <section id="products" className="flex h-[100dvh] w-full flex-col bg-[#365F37]">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative flex flex-1 justify-center overflow-hidden pt-20 z-10"
      >
        <Carousel
          setApi={setApi}
          opts={{ loop: true, slidesToScroll: 1 }}
          className="h-full w-full"
        >
          <CarouselContent className="flex h-full w-full">
            {products.map((product, index) => (
              <CarouselItem
                key={product.name}
                className="relative flex h-full w-full basis-[85%] items-center justify-center sm:basis-[60%] md:basis-[40%] lg:basis-[33%]"
              >
                <motion.div
                  initial={false}
                  animate={{
                    clipPath:
                      current !== index
                        ? "inset(15% 0 15% 0 round 2rem)"
                        : "inset(0 0 0 0 round 2rem)",
                  }}
                  className="h-full w-full overflow-hidden rounded-3xl"
                >
                  <div className="relative h-full w-full border border-[#fdffee]/10/10">
                    <img
                      src={`/neoproducts/${46 + (index % 5)}.png`}
                      alt={product.name}
                      className="h-full w-full scale-105 object-cover"
                    />
                  </div>
                </motion.div>
                <AnimatePresence mode="wait">
                  {current === index && (
                    <motion.div
                      initial={{ opacity: 0, filter: "blur(10px)" }}
                      animate={{ opacity: 1, filter: "blur(0px)" }}
                      transition={{ duration: 0.5 }}
                      className="absolute bottom-0 left-2 flex h-[14%] w-full translate-y-full items-start justify-start p-2 text-left font-medium tracking-tight text-[#fdffee]"
                    >
                      {product.name}
                    </motion.div>
                  )}
                </AnimatePresence>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>

          <button
              aria-label="Previous slide"
              onClick={() => api?.scrollPrev()}
              className="absolute left-2 sm:left-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#fdffee]/20 p-2 sm:p-4 text-[#fdffee] transition-colors hover:bg-[#fdffee]/30/20 group-hover:hover:bg-[#355E3B]/30"
            >
              <ChevronLeft className="h-5 w-5 sm:h-7 sm:w-7" />
            </button>
            <button
              aria-label="Next slide"
              onClick={() => api?.scrollNext()}
              className="absolute right-2 sm:right-6 top-1/2 z-10 -translate-y-1/2 rounded-full bg-[#fdffee]/20 p-2 sm:p-4 text-[#fdffee] transition-colors hover:bg-[#fdffee]/30/20 group-hover:hover:bg-[#355E3B]/30"
            >
              <ChevronRight className="h-5 w-5 sm:h-7 sm:w-7" />
            </button>

          <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3">
              {Array.from({ length: products.length }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => api?.scrollTo(index)}
                  className={cn(
                    "cursor-pointer rounded-full transition-all",
                    current === index
                      ? "h-3 w-8 bg-[#fdffee]"
                      : "h-3 w-3 bg-[#fdffee]/30 hover:bg-[#fdffee]/50/30",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
      </motion.div>
    </section>
  );
};








