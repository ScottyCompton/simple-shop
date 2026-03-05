import { Flex } from "@radix-ui/themes"
import { useForm, useWatch } from "react-hook-form"
import { useEffect } from "react"
import type { CardData } from "@/types"

type Props = {
  onChange: (cardData: CardData) => void
}

const CheckoutPayment: React.FC<Props> = ({ onChange }: Props) => {
  const defaultValues = {
    ccNumber: "",
    ccExpiry: "",
    ccCVV: "",
  }

  const {
    register,
    formState: { errors },
    control,
  } = useForm<CardData>({
    defaultValues,
  })

  // Watch all form fields
  const formValues = useWatch({
    control,
  })

  // Call onChange prop when form values change
  useEffect(() => {
    // Only call onChange when we have actual values
    if (
      formValues.ccNumber !== undefined ||
      formValues.ccExpiry !== undefined ||
      formValues.ccCVV !== undefined
    ) {
      onChange({
        ccNumber: formValues.ccNumber ?? "",
        ccExpiry: formValues.ccExpiry ?? "",
        ccCVV: formValues.ccCVV ?? "",
      })
    }
  }, [formValues, onChange])

  return (
    <form className="space-y-6">
      <Flex gap="3" direction="row" className="w-full">
        <div className="space-y-2">
          <label
            htmlFor="ccNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Credit Card Number
          </label>
          <input
            id="ccNumber"
            type="text"
            {...register("ccNumber", {
              required: "Credit Card Number is required",
            })}
            className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.ccNumber ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
            placeholder="Doe"
          />
          {errors.ccNumber && (
            <p className="text-sm text-red-500 mt-1">
              {errors.ccNumber.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="ccExpiry"
            className="block text-sm font-medium text-gray-700"
          >
            Expiration Date
          </label>
          <input
            id="ccExpiry"
            type="text"
            {...register("ccExpiry", {
              required: "Expiration Date is required",
            })}
            className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.ccExpiry ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
            placeholder="MM/YY"
          />
          {errors.ccExpiry && (
            <p className="text-sm text-red-500 mt-1">
              {errors.ccExpiry.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="ccCVV"
            className="block text-sm font-medium text-gray-700"
          >
            CVV
          </label>
          <input
            id="ccCVV"
            type="text"
            {...register("ccCVV", { required: "CVV is required" })}
            className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.ccCVV ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
            placeholder="123"
          />
          {errors.ccCVV && (
            <p className="text-sm text-red-500 mt-1">{errors.ccCVV.message}</p>
          )}
        </div>
      </Flex>
    </form>
  )
}

export default CheckoutPayment
