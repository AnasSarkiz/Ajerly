"use client"

import SignIn from "components/auth/SignIn"
import SignUp from "components/auth/SignUp"
import { useSearchParams, useRouter } from "next/navigation"
import { Suspense, useEffect, useState } from "react"

const Auth = () => {
  const params = useSearchParams()
  const router = useRouter()
  const method = params.get("method")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const res = await fetch("/api/auth/verify", { credentials: "include" })
      console.log("res: ", res)
      if (res.ok) {
        console.log("User is authenticated")
        setIsAuthenticated(true)
        router.push("/profile") // Redirect if authenticated
      }
    }

    checkAuth()
  }, [router])

  if (isAuthenticated) return null // Prevent rendering SignIn/SignUp if authenticated

  return <>{method === "signup" ? <SignUp /> : <SignIn />}</>
}

const Page = () => {
  return (
    <Suspense>
      <Auth />
    </Suspense>
  )
}

export default Page
