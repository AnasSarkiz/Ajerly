import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

export async function GET() {
  const token = (await cookies()).get("authToken")?.value
  console.log("token: ", token)

  if (!token)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!)
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
}
