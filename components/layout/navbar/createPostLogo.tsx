"use client"
import clsx from "clsx"
import NextLink from "next/link"
import { usePathname } from "next/navigation"

export default function PostButton({ className }: { className?: string }) {
  const pathname = usePathname()

  if (pathname.split("/").includes("create-new-post")) return null

  return (
    <NextLink
      shallow
      prefetch
      href="/create-new-post"
      className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
    >
      <svg
        className={clsx(
          "h-4 transition-all ease-in-out hover:scale-110",
          className,
        )}
        width="204px"
        height="204px"
        viewBox="0 0 24.00 24.00"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="#000000"
        strokeWidth="0.00024000000000000003"
      >
        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
        <g
          id="SVGRepo_tracerCarrier"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></g>
        <g id="SVGRepo_iconCarrier">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M2 5C2 3.34315 3.34315 2 5 2H19C20.6569 2 22 3.34315 22 5V19C22 20.6569 20.6569 22 19 22H5C3.34315 22 2 20.6569 2 19V5ZM5 4C4.44772 4 4 4.44772 4 5V10H20V5C20 4.44772 19.5523 4 19 4H5ZM4 12V19C4 19.5523 4.44772 20 5 20H19C19.5523 20 20 19.5523 20 19V12H4ZM14 13C14.2652 13 14.5196 13.1054 14.7071 13.2929L18.7071 17.2929C19.0976 17.6834 19.0976 18.3166 18.7071 18.7071C18.3166 19.0976 17.6834 19.0976 17.2929 18.7071L14 15.4142L11.7071 17.7071L10.7071 18.7071C10.3166 19.0976 9.68342 19.0976 9.29289 18.7071C8.90237 18.3166 8.90237 17.6834 9.29289 17.2929L9.58579 17L9 16.4142L6.70711 18.7071C6.31658 19.0976 5.68342 19.0976 5.29289 18.7071C4.90237 18.3166 4.90237 17.6834 5.29289 17.2929L8.29289 14.2929C8.48043 14.1054 8.73478 14 9 14C9.26522 14 9.51957 14.1054 9.70711 14.2929L11 15.5858L13.2929 13.2929C13.4804 13.1054 13.7348 13 14 13ZM11 7C11 6.44772 11.4477 6 12 6H17C17.5523 6 18 6.44772 18 7C18 7.55228 17.5523 8 17 8H12C11.4477 8 11 7.55228 11 7ZM7 8.75C7.9665 8.75 8.75 7.9665 8.75 7C8.75 6.0335 7.9665 5.25 7 5.25C6.0335 5.25 5.25 6.0335 5.25 7C5.25 7.9665 6.0335 8.75 7 8.75Z"
            fill="#000000"
          ></path>
        </g>
      </svg>
    </NextLink>
  )
}
