import { Carousel } from "components/carousel"
import { ThreeItemGrid } from "components/grid/three-items"
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
      <Carousel />
      <Footer />
    </>
  )
}
