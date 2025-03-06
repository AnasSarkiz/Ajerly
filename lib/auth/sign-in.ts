import { prisma } from "../db/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    throw new Error("User not found")
  }
  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    throw new Error("Invalid password")
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" })
  return { token, user }
}
