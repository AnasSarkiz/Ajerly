import { Carousel } from "components/carousel"
import { FeaturedCollection } from "components/featuredCollection"
import Footer from "components/layout/footer"
import { HomeSlider } from "components/homeSlider"
import { HomeInfo } from "components/homeInfo"
export const metadata = {
  description:
    "High-performance ecommerce store built with Next.js, Vercel, and Shopify.",
  openGraph: {
    type: "website",
  },
}

export default function HomePage() {
  return (
    <>
      <HomeInfo />
      <HomeSlider />
      <FeaturedCollection />
      <Carousel />
      <Footer />
    </>
  )
}
