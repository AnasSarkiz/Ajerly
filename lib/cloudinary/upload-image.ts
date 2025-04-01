import { v2 as cloudinary, UploadApiResponse } from "cloudinary"

// Configuration
cloudinary.config({
  cloud_name: "dcxfdmm6f",
  api_key: "512926924732289",
  api_secret: "F8zzjFXPRYorDGvNLkl-HD4H8Ws",
})

export default async function uploadImages(
  images: Buffer[],
): Promise<string[]> {
  const uploadPromises = images.map((imageBuffer, index) => {
    const uniqueId = `image_${Date.now()}_${index}`
    return new Promise<{
      success: boolean
      result?: UploadApiResponse
      error?: any
    }>((resolve) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { public_id: uniqueId },
        (error, result) => {
          if (error) {
            resolve({ success: false, error })
          } else {
            resolve({ success: true, result })
          }
        },
      )
      uploadStream.end(imageBuffer)
    })
  })

  const responses = await Promise.all(uploadPromises)

  const failed = responses.find((res) => !res.success)
  if (failed) {
    throw new Error(
      `Image upload failed: ${failed.error?.message || failed.error}`,
    )
  }

  return responses.map((res) => res.result!.secure_url)
}
