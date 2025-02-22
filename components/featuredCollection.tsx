"use client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef } from "react"
export const FeaturedCollection = () => {
  const items = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80?q=80&w=3000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      path: `/product/${1}`,
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1525845859779-54d477ff291f?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      path: `/product/${2}`,
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1518709414768-a88981a4515d?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      path: `/product/${3}`,
    },
    {
      id: 4,
      image:
        "https://images.unsplash.com/photo-1559059961-dd5b124d1dc5?q=80&w=2592&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      path: `/product/${4}`,
    },
    {
      id: 5,
      image:
        "https://images.unsplash.com/photo-1544070515-dada2bc86650?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      path: `/product/${5}`,
    },
    {
      id: 6,
      image:
        "https://images.unsplash.com/photo-1639951959133-e6fe9e7d41bc?q=80&w=3387&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      path: `/product/${6}`,
    },
  ]
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let lastScrollTop = 0
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentScrollTop =
              window.pageYOffset || document.documentElement.scrollTop
            const scrollSpeed = Math.abs(currentScrollTop - lastScrollTop)
            const animationDuration = Math.max(0.5, 1 - scrollSpeed / 1000)
            ;(entry.target as HTMLElement).style.animationDuration =
              `${animationDuration}s`
            entry.target.classList.add("animate-fadeInUp")
            lastScrollTop = currentScrollTop <= 0 ? 0 : currentScrollTop
          }
        })
      },
      { threshold: 0.1 },
    )

    const elements = containerRef.current?.querySelectorAll(".animate-item")
    elements?.forEach((el) => observer.observe(el))

    return () => {
      elements?.forEach((el) => observer.unobserve(el))
    }
  }, [])

  return (
    <section className="w-full flex  items-center  justify-center  py-24  ">
      <div className="w-full flex flex-col justify-center items-center ">
        <h2 className="text-3xl pl-4 font-serif mb-8">Featured collection</h2>
        <div
          ref={containerRef}
          className="grid items-center w-[90%] justify-center container grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8"
        >
          {items.map((item, i) => (
            <Link
              key={i}
              href={item.path}
              className={`group md:pl-8 opacity-0 relative aspect-square overflow-hidden rounded-lg animate-item`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <Image
                src={item.image}
                alt="Featured plant"
                fill
                className="object-cover transition-transform group-hover:scale-105 duration-500 ease-in-out transform group-hover:translate-y-2 group-hover:opacity-75"
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
