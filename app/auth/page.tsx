"use client"

import SignIn from "components/auth/SignIn"
import SignUp from "components/auth/SignUp"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

const SignInUp = () => {
  const params = useSearchParams()
  const method = params.get("method")

  return <>{method === "signup" ? <SignUp /> : <SignIn />}</>
}

const page = () => {
  return (
    <Suspense>
      <SignInUp />
    </Suspense>
  )
}

export default page
