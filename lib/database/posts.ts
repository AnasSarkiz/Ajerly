import { PrismaClientValidationError } from "@prisma/client/runtime/library"
import { prisma } from "../db/prisma"
import { Prisma } from "@prisma/client"

export async function savePost(
  postData: Prisma.PostCreateInput,
  imageUrls: string[],
) {
  const {
    userId,
    title,
    content,
    phone,
    location,
    perHour,
    perDay,
    perWeek,
    perMonth,
    perYear,
  } = postData

  const payload = {
    userId,
    title,
    content,
    phone,
    location,
    perHour,
    perDay,
    perWeek,
    perMonth,
    perYear,
    images: {
      create: imageUrls.map((url) => ({ url })),
    },
  }

  try {
    return await prisma.post.create({ data: payload })
  } catch (e) {
    if (e instanceof PrismaClientValidationError) throw e.message
    else throw e
  }
}
