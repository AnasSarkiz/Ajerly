import { v2 as cloudinary } from "cloudinary"

// Configuration
cloudinary.config({
  cloud_name: "dcxfdmm6f",
  api_key: "512926924732289",
  api_secret: "F8zzjFXPRYorDGvNLkl-HD4H8Ws",
})

export default async function destroyImages(imageIds: string[]): Promise<void> {
  const deletePromises = imageIds.map((imageId) => {
    return new Promise<{ success: boolean; error?: any }>((resolve) => {
      cloudinary.uploader.destroy(imageId, (error, result) => {
        if (error || result.result !== "ok") {
          resolve({ success: false, error: error || result })
        } else {
          resolve({ success: true })
        }
      })
    })
  })

  const responses = await Promise.all(deletePromises)

  const failed = responses.find((res) => !res.success)
  if (failed) {
    throw new Error(
      `Image deletion failed: ${failed.error?.message || failed.error}`,
    )
  }
}
