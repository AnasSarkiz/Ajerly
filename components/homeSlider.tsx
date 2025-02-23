import { getCollectionProducts, getMenu } from "lib/shopify"
import { Slider } from "./slider"

export async function HomeSlider() {
  const homepageItems = await getCollectionProducts({
    collection: "home-slider",
  })
  //   const homepageMenu = await getMenu("handle2");

  if (!homepageItems[0] || !homepageItems[1] || !homepageItems[2]) return null

  return (
    <Slider items={[homepageItems[0], homepageItems[1], homepageItems[2]]} />
  )
}
