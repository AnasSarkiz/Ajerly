"use client";
import { Product } from "lib/shopify/types";
import Image from "next/image";
import { useEffect, useState } from "react";

export function Slider({ items }: { items: Product[] }) {
  const slides = items.map(
    (item, i) => ({
      id: item.id,
      image: item.featuredImage.url,
      title: item.title,
      description: item.description,
      path: `/product/${item.handle}`,
    }),
  );
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setIsFading(false);
      }, 500);
    }, 3000);

    return () => clearInterval(timer);
  }, []);
  return (
    <div className="relative flex w-full flex-col">
      <section className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: isFading ? 0.5 : 1 }}
        >
          <Image
            src={slides[currentSlide]?.image ??
              "https://community.softr.io/uploads/db9110/original/2X/7/74e6e7e382d0ff5d7773ca9a87e6f6f8817a68a6.jpeg"}
            alt="Hero image"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center">
            <div className="container px-4">
              <div
                className="max-w-xl space-y-4 transition-opacity duration-500"
                style={{ opacity: isFading ? 0 : 1 }}
              >
                <h1 className="text-4xl font-serif text-white sm:text-5xl md:text-6xl uppercase">
                  {slides[currentSlide]?.title}
                </h1>
                <p className="text-lg text-white/90 uppercase">
                  {slides[currentSlide]?.description}
                </p>
                <button
                  className="bg-white text-black hover:bg-white/90 px-4 py-2 rounded"
                  onClick={() => {
                    window.location.href = slides[currentSlide]?.path || "";
                  }}
                >
                  Shop Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 left-4 flex items-center gap-2 text-white">
          <span className="text-sm">
            {String(currentSlide + 1).padStart(2, "0")}/{String(slides.length)
              .padStart(2, "0")}
          </span>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className="group"
              >
                <div
                  className={`h-1 w-8 transition-all duration-300 ${
                    currentSlide === index
                      ? "bg-white"
                      : "bg-white/40 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
