import clsx from "clsx"
import Price from "./price"

const Label = ({
  title,
  amount,
  currencyCode,
  position = "bottom",
}: {
  title: string
  amount: string
  currencyCode: string
  position?: "bottom" | "center"
}) => {
  return (
    <div
      className={clsx(
        "absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label",
        {
          "lg:px-20 lg:pb-[35%]": position === "center",
        },
      )}
    >
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="mr-4 line-clamp-2 grow pl-2 leading-none tracking-tight">
          {title}
        </h3>
        <Price
          className="flex-none border px-5 py-2.5 text-center me-2 text-white border-green-700 bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm dark:border-green-500  dark:text-white dark:bg-green-600 dark:focus:ring-green-800"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  )
}

export default Label
