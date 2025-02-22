import { Navbar } from "components/layout/navbar"
import ThemeProvider from "components/shared-theme/ThemeProvider"
import { WelcomeToast } from "components/welcome-toast"
import { GeistSans } from "geist/font/sans"
import { baseUrl } from "lib/utils"
import { ReactNode } from "react"
import { Toaster } from "sonner"
import "./globals.css"

const { SITE_NAME } = process.env

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME!,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body className="bg-neutral-50 text-black selection:bg-green-700 selection:text-white dark:bg-neutral-900 dark:text-white dark:selection:bg-green-400 dark:selection:text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          enableColorScheme
        >
          <Navbar />
          <main>
            {children}
            <Toaster closeButton />
            <WelcomeToast />
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
