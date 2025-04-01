"use client"
import React, { useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "components/ui/DropDown"
import { Button } from "@headlessui/react"

export default function Page() {
  const [prices, setPrices] = useState([{ amount: "", period: "day" }])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<File[]>([])

  const addPriceField = () => {
    const selectedPeriods = prices.map((price) => price.period)
    const allPeriods = ["hour", "day", "week", "month", "year"]
    const availablePeriods = allPeriods.filter(
      (period) => !selectedPeriods.includes(period),
    )

    if (availablePeriods.length > 0) {
      setPrices([...prices, { amount: "", period: availablePeriods[0]! }])
    } else {
      alert("You can only add up to 4 prices")
    }
  }

  const handlePriceChange = (index: number, field: string, value: string) => {
    const newPrices = prices.map((price, i) =>
      i === index ? { ...price, [field]: value } : price,
    )
    setPrices(newPrices)
  }

  const removePriceField = (index: number) => {
    setPrices(prices.filter((_, i) => i !== index))
  }

  const getAvailablePeriods = (currentIndex: number) => {
    const selectedPeriods = prices.map((price) => price.period)
    const allPeriods = ["day", "week", "month", "year"]
    return allPeriods.filter(
      (period) =>
        period === prices[currentIndex]?.period ||
        !selectedPeriods.includes(period),
    )
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files).filter((file) =>
        file.type.startsWith("image/"),
      )
      if (filesArray.length + selectedImages.length > 3) {
        alert("You can only upload up to 3 images.")
        return
      }
      setSelectedImages((prevImages) =>
        [...prevImages, ...filesArray].slice(0, 3),
      )
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    selectedImages.forEach((image) => {
      formData.append("image", image)
    })

    if (selectedImages.length === 0) {
      alert("Please select at least one image.")
      return
    }

    try {
      const response = await fetch("/api/post/create", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        alert("Post created and images uploaded successfully!")
        console.log("Uploaded images:", data.imageUrls)
        setSelectedImages([])
      } else {
        const errorData = await response.json()
        alert(`Error: ${errorData.error}`)
      }
    } catch (error) {
      alert("An error occurred while uploading the images.")
    }
  }

  return (
    <div className="max-w-screen w-screen px-4 py-10  sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-center mb-6 text-primary">
        Create a New Post
      </h1>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <input type="hidden" name="prices" value={JSON.stringify(prices)} />
        <div>
          <p className="block text-sm mt-10 mb-2  dark:text-white sm:text-lg font-semibold">
            Select Images (max 3) for your post
          </p>
          <div className="mt-8  items-center flex gap-2 pb-4">
            {selectedImages.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Preview ${index + 1}`}
                  className="md:h-64 md:w-64 w-36 h-36 object-contain rounded-lg border border-gray-300 cursor-pointer"
                  onClick={() => setPreviewImage(URL.createObjectURL(image))}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="absolute top-0 cursor-pointer right-0 bg-red-600 text-white w-6 h-6 "
                  onClick={() => {
                    setSelectedImages(
                      selectedImages.filter((_, i) => i !== index),
                    )
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </div>
            ))}
            {selectedImages.length < 3 && (
              <label className="md:h-64 md:w-64 w-36 h-36 flex items-center justify-center border border-gray-300 rounded-lg cursor-pointer">
                <input
                  type="file"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </label>
            )}
          </div>
        </div>
        <div className="flex flex-col justify-center items-center w-full md:pr-20">
          <div className="w-full">
            <p className="block text-sm mt-10 mb-2  dark:text-white sm:text-lg font-semibold">
              Title
            </p>
            <input
              type="text"
              name="title"
              className="w-full border rounded-xl  p-2 sm:text-sm"
              placeholder="Enter post title"
            />
          </div>
          <div className="w-full">
            <p className="block text-sm mt-10 mb-2  dark:text-white sm:text-lg font-semibold">
              Content
            </p>
            <textarea
              name="content"
              className="w-full border rounded-xl  p-2 sm:text-sm"
              rows={4}
              placeholder="Enter post content"
            />
          </div>
          <div className="w-full">
            <p className="block text-sm mt-10 mb-2  dark:text-white sm:text-lg font-semibold">
              Phone Number
            </p>
            <input
              type="tel"
              name="phone"
              className="w-full border rounded-xl  p-2 sm:text-sm"
              placeholder="Enter phone number"
            />
          </div>
          <div className="w-full">
            <p className="block text-sm mt-10 mb-2  dark:text-white sm:text-lg font-semibold">
              Prices
            </p>
            {prices.map((price, index) => (
              <div key={index} className="flex gap-2 mb-2 items-center">
                <input
                  type="number"
                  value={price.amount}
                  onChange={(e) =>
                    handlePriceChange(index, "amount", e.target.value)
                  }
                  className="w-full border rounded-xl  p-2 sm:text-sm"
                  placeholder="Enter price"
                />
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    className="w-full border rounded-xl p-2 sm:text-sm"
                  >
                    <Button>{`Per ${price.period.charAt(0).toUpperCase() + price.period.slice(1)}`}</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuRadioGroup
                      value={price.period}
                      onValueChange={(e) =>
                        handlePriceChange(index, "period", e)
                      }
                    >
                      {getAvailablePeriods(index).map((period) => (
                        <DropdownMenuRadioItem
                          key={period}
                          value={period}
                        >{`Per ${period.charAt(0).toUpperCase() + period.slice(1)}`}</DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-14 cursor-pointer text-red-500 hover:text-red-700 hover:scale-110 transform transition-transform"
                  onClick={() => removePriceField(index)}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1-18 0Z"
                  />
                </svg>
              </div>
            ))}
            <p
              onClick={addPriceField}
              className={`m-1 ${prices.length >= 4 ? "hidden" : ""} w-[140px] cursor-pointer underline  dark:text-white text-sm font-semibold`}
            >
              {`${prices.length === 0 ? "Add Price" : "Add Another Price"}`}
            </p>
          </div>
          <div className="w-full">
            <p className="block text-sm mt-10 mb-2  dark:text-white sm:text-lg font-semibold">
              Location
            </p>
            <input
              type="text"
              name="location"
              className="w-full border rounded-xl  p-2 sm:text-sm"
              placeholder="Enter location"
            />
          </div>
          <button
            type="submit"
            className="w-40 md:w-52 mt-12 inline-flex justify-center py-2 px-4 text-white border border-green-700 bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm text-center me-2 mb-2 dark:border-green-500 dark:text-white dark:bg-green-600 dark:focus:ring-green-800"
          >
            Submit
          </button>
        </div>
      </form>
      {previewImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-[rgba(0,0,0,0.5)] dark:bg-[rgba(0,0,0,0.7)]"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative flex items-center justify-center w-[80%] h-[80%]">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  )
}
