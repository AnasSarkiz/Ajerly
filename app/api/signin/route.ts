import { signIn } from "lib/auth/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  try {
    const { token, user } = await signIn(email, password)
    return NextResponse.json({ token, user }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
