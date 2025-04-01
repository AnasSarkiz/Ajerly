import { prisma } from "../db/prisma"

interface PostData {
  userId: string
  imageUrls: string[]
  title: string
  content: string
  phone: number
  location: string
  prices: any
  perHour: number
  perDay: number
  perWeek: number
  perMonth: number
  perYear: number
}

export async function savePost(postData: PostData) {
  const {
    userId,
    imageUrls,
    title,
    content,
    phone,
    location,
    prices,
    perHour,
    perDay,
    perWeek,
    perMonth,
    perYear,
  } = postData

  if (!title) console.error("Error: title is missing")
  if (!content) console.error("Error: content is missing")
  if (phone === undefined || phone === null)
    console.error("Error: phone is missing")
  if (!location) console.error("Error: location is missing")
  if (!prices) console.error("Error: prices is missing")
  if (
    [perHour, perDay, perWeek, perMonth, perYear].some(
      (val) => val === undefined || val === null,
    )
  ) {
    console.error("Error: one or more pricing fields are missing")
  }

  const processedPrices =
    typeof prices === "string" ? JSON.parse(prices) : prices
  const processedPhone = typeof phone === "string" ? Number(phone) : phone

  const payload = {
    userId,
    title,
    content,
    phone: processedPhone,
    location,
    prices: processedPrices,
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
    console.error("Error creating post:", e)
    throw e
  }
}
