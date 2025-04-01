import uploadImages from "lib/cloudinary/upload-image"
import { NextRequest, NextResponse } from "next/server"
import { savePost } from "lib/database/posts"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const files = formData.getAll("image") as File[]

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

    const imageUrls = await uploadImages(buffers)
    const userId = "12345"

    const textFields: Record<string, string> = {}
    for (const [key, value] of formData.entries()) {
      if (key !== "image" && typeof value === "string") {
        textFields[key] = value
      }
    }

    let prices: any[] = []
    if (textFields.prices) {
      try {
        prices = JSON.parse(textFields.prices)
      } catch (error) {
        return NextResponse.json(
          { error: "Invalid prices format" },
          { status: 400 },
        )
      }
    }

    let perHour: number | undefined
    let perDay: number | undefined
    let perWeek: number | undefined
    let perMonth: number | undefined
    let perYear: number | undefined

    prices.forEach((price) => {
      const amount = parseFloat(price.amount)
      if (price.period === "hour") perHour = amount
      if (price.period === "day") perDay = amount
      if (price.period === "week") perWeek = amount
      if (price.period === "month") perMonth = amount
      if (price.period === "year") perYear = amount
    })

    if (
      perHour === undefined &&
      perDay === undefined &&
      perWeek === undefined &&
      perMonth === undefined &&
      perYear === undefined
    ) {
      return NextResponse.json(
        { error: "At least one price must be defined" },
        { status: 400 },
      )
    }

    perHour = perHour === undefined ? 0 : perHour
    perDay = perDay === undefined ? 0 : perDay
    perWeek = perWeek === undefined ? 0 : perWeek
    perMonth = perMonth === undefined ? 0 : perMonth
    perYear = perYear === undefined ? 0 : perYear

    const postData = {
      userId,
      ...textFields,
      perHour,
      perDay,
      perWeek,
      perMonth,
      perYear,
      imageUrls,
    }

    try {
      await savePost(postData)
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
