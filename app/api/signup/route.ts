import { signUp } from "lib/auth/auth"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { email, password, username } = await req.json()

  try {
    const { token, user } = await signUp(email, password, username)
    return NextResponse.json({ token, user }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
