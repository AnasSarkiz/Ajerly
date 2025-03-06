import { signIn } from "lib/auth/sign-in"
import { NextRequest, NextResponse } from "next/server"
import { serialize } from "cookie"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  try {
    // Authenticate the user
    const { token, user } = await signIn(email, password)

    // Set the token in an HTTP-only cookie
    const cookie = serialize("authToken", token, {
      httpOnly: true, // Prevent client-side access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // Prevent CSRF attacks
      maxAge: 2592000, // 30 daysq
      path: "/", // Accessible across the entire site
    })

    // Return the user data and set the cookie in the response headers
    const response = NextResponse.json({ user }, { status: 200 })
    response.headers.set("Set-Cookie", cookie)
    return response
  } catch (error) {
    // Return a generic error message
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    )
  }
}
