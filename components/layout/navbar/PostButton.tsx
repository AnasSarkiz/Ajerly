"use client"
import { NewspaperIcon } from "@heroicons/react/24/outline"
import clsx from "clsx"
import NextLink from "next/link"
import { usePathname } from "next/navigation"

export function PostButton({ className }: { className?: string }) {
  const pathname = usePathname()

  if (pathname.split("/").includes("create")) return null

  return (
    <NextLink
      shallow
      prefetch
      href="/post/create"
      className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
    >
      <NewspaperIcon
        className={clsx(
          "h-4 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
    </NextLink>
  )
}
