import uploadImages from "lib/cloudinary/upload-image"
import { NextRequest, NextResponse } from "next/server"
import { savePost } from "lib/database/posts"
import { Prisma } from "@prisma/client"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll("image") as File[]

    const textFields: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      if (key !== "image" && typeof value === "string") {
        textFields[key] = value
      }
    }

    if (
      !textFields.title ||
      !textFields.content ||
      !textFields.location ||
      !textFields.phone ||
      !textFields.prices
    ) {
      return NextResponse.json(
        { error: "Title, content, location, and phone are required" },
        { status: 400 },
      )
    }

    let prices: any[] = []
    try {
      prices = JSON.parse(textFields.prices)
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid prices format" },
        { status: 400 },
      )
    }

    let perHour: number = 0
    let perDay: number = 0
    let perWeek: number = 0
    let perMonth: number = 0
    let perYear: number = 0

    prices.forEach((price) => {
      const amount = parseFloat(price.amount) || 0
      if (price.period === "hour") perHour = amount
      if (price.period === "day") perDay = amount
      if (price.period === "week") perWeek = amount
      if (price.period === "month") perMonth = amount
      if (price.period === "year") perYear = amount
    })

    if ([perHour, perDay, perWeek, perMonth, perYear].every((val) => !val)) {
      return NextResponse.json(
        { error: "At least one price must be defined" },
        { status: 400 },
      )
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No image files provided" },
        { status: 400 },
      )
    }

    const buffers = await Promise.all(
      files.map(async (file) => {
        const arrayBuffer = await file.arrayBuffer()
        return Buffer.from(arrayBuffer)
      }),
    )

    const userId = "12345" // Replace with actual user ID
    const imageUrls = await uploadImages(buffers)

    const postData: Prisma.PostCreateInput = {
      userId,
      perHour,
      perDay,
      perWeek,
      perMonth,
      perYear,
      content: textFields.content,
      location: textFields.location,
      phone: textFields.phone,
      title: textFields.title,
    }

    try {
      await savePost(postData, imageUrls)
    } catch (e) {
      console.error(e)
      return NextResponse.json(
        { error: "Failed to save post: " + e },
        { status: 500 },
      )
    }

    return NextResponse.json(
      { message: "Post created successfully", imageUrls },
      { status: 200 },
    )
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
