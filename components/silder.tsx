"use client"
import { Product } from "lib/shopify/types"
import Image from "next/image"
import { useEffect, useState } from "react"

export function Slider({ items }: { items: Product[] }) {
  const slides = items.map((item, i) => ({
    id: item.id,
    image: item.featuredImage.url,
    title: item.title,
    description: item.description,
    path: `/product/${item.handle}`,
  }))
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isFading, setIsFading] = useState(false)
  useEffect(() => {
    const timer = setInterval(() => {
      setIsFading(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
        setIsFading(false)
      }, 500)
    }, 3000)

    return () => clearInterval(timer)
  }, [])
  return (
    <div className="relative flex w-full flex-col">
      <section className="relative h-[70vh] overflow-hidden">
        <div
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: isFading ? 0.5 : 1 }}
        >
          <Image
            src={slides[currentSlide]?.image || ""}
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
                <h1 className="text-4xl font-serif  text-green-800 dark:text-green-600  sm:text-5xl md:text-6xl uppercase">
                  {slides[currentSlide]?.title}
                </h1>
                <p className="text-lg text-green-800 dark:text-green-600 uppercase">
                  {slides[currentSlide]?.description}
                </p>
                <button
                  className="text-white bg-green-800 border border-green-700 hover:text-green-700 hover:bg-transparent focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 dark:text-white dark:bg-green-600 dark:border-green-500 dark:hover:text-green-500 dark:hover:bg-transparent dark:focus:ring-green-800"
                  onClick={() => {
                    window.location.href = slides[currentSlide]?.path || ""
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
            {String(currentSlide + 1).padStart(2, "0")}/
            {String(slides.length).padStart(2, "0")}
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
                      ? "bg-green-700 dark:bg-green-400"
                      : "bg-white/40 group-hover:bg-white/60"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
