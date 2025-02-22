"use client"

import { ThemeProvider, ThemeProviderProps } from "next-themes"
import { useEffect, useState } from "react"

export default function Providers({
  children,
  ...props
}: ThemeProviderProps & { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</> // Render children without ThemeProvider during SSR
  }

  return <ThemeProvider {...props}>{children}</ThemeProvider>
}
