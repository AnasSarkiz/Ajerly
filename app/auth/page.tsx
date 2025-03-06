"use client"

import SignIn from "components/auth/SignIn"
import SignUp from "components/auth/SignUp"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const Auth = () => {
  const params = useSearchParams()
  const method = params.get("method")

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
