import { prisma } from "../db/prisma"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"

export async function signUp(
  email: string,
  password: string,
  username: string,
) {
  const hashedPassword = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      username, // Include username
    },
  })
  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "1h" })
  return { token, user }
}
