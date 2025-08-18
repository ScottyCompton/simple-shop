import { useForm } from "react-hook-form"
import { useEffect } from "react"
import type { UserBilling as BillingFormData } from "../../../types"
import "../../../css/checkout.css"
import StateSelect from "../../StateSelect"
import { useAppSelector } from "../../../app/hooks"
import { selectUser } from "../../../features/shop/usersSlice"
import { useGetUserByIdQuery } from "../../../features/shop/userApiSlice"

type CheckoutBillingShippingEditProps = {
  editType: "billing" | "shipping"
}

const CheckoutBillingShippingEdit: React.FC<
  CheckoutBillingShippingEditProps
> = ({ editType }: CheckoutBillingShippingEditProps) => {
  const currUser = useAppSelector(selectUser)
  const userId = currUser?.id ?? -1

  // Fetch user data from API
  const { data, isLoading, isError } = useGetUserByIdQuery(userId)

  // Initialize form with react-hook-form and default values from user data
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<BillingFormData>({
    defaultValues: data?.user
      ? editType === "billing"
        ? data.user.billing
        : data.user.shipping
      : undefined,
  })

  // Update form values when user data is loaded
  useEffect(() => {
    if (data?.user) {
      const addressData =
        editType === "billing" ? data.user.billing : data.user.shipping

      // Set form values from the user data
      Object.entries(addressData).forEach(([key, value]) => {
        setValue(key as keyof BillingFormData, value)
      })
    }
  }, [data, editType, setValue])

  // Handle form submission
  const submitHandler = (formData: BillingFormData) => {
    console.log(`Updated ${editType} data:`, formData)
    // In a real app, you would save this data to the API
    // TODO: Add API call to update user data

    // Close the dialog after submission by finding the dialog close button and clicking it
    const closeButton = document.querySelector(".DialogContent .IconButton")
    if (closeButton instanceof HTMLButtonElement) {
      closeButton.click()
    }
  }

  // Handle form submission with error prevention
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(submitHandler)()
  }

  // Show loading or error states
  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-6 w-24 bg-slate-200 rounded mb-4"></div>
          <div className="h-4 w-36 bg-slate-200 rounded mb-2"></div>
          <div className="h-4 w-32 bg-slate-200 rounded"></div>
        </div>
        <p className="mt-4 text-gray-600">Loading address data...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-4 text-center">
        <div className="text-red-500 mb-2">Error loading user data</div>
        <p className="text-gray-600">Please try again later</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <form onSubmit={onSubmit} className="space-y-6">
        {/* First and Last Name - Two columns on larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              {...register("firstName", { required: "First name is required" })}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.firstName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
              placeholder="John"
            />
            {errors.firstName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.firstName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              {...register("lastName", { required: "Last name is required" })}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.lastName ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
              placeholder="Doe"
            />
            {errors.lastName && (
              <p className="text-sm text-red-500 mt-1">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        {/* Address Line 1 */}
        <div className="space-y-2">
          <label
            htmlFor="address1"
            className="block text-sm font-medium text-gray-700"
          >
            Address Line 1
          </label>
          <input
            id="address1"
            type="text"
            {...register("address1", { required: "Address is required" })}
            className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.address1 ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
            placeholder="123 Main St"
          />
          {errors.address1 && (
            <p className="text-sm text-red-500 mt-1">
              {errors.address1.message}
            </p>
          )}
        </div>

        {/* Address Line 2 (optional) */}
        <div className="space-y-2">
          <label
            htmlFor="address2"
            className="block text-sm font-medium text-gray-700"
          >
            Address Line 2{" "}
            <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            id="address2"
            type="text"
            {...register("address2")}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Apt 4B"
          />
        </div>

        {/* City, State, Zip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <input
              id="city"
              type="text"
              {...register("city", { required: "City is required" })}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.city ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
              placeholder="Los Angeles"
            />
            {errors.city && (
              <p className="text-sm text-red-500 mt-1">{errors.city.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="state"
              className="block text-sm font-medium text-gray-700"
            >
              State
            </label>
            <div className="relative" style={{ zIndex: 2000 }}>
              {/* Higher z-index to ensure dropdown is visible */}
              <input
                type="hidden"
                {...register("state", { required: "State is required" })}
                id="state"
              />
              <StateSelect
                value={
                  data?.user
                    ? editType === "billing"
                      ? data.user.billing.state
                      : data.user.shipping.state
                    : undefined
                }
                onChange={value => {
                  setValue("state", value)
                }}
                name="state"
              />
            </div>
            {errors.state && (
              <p className="text-sm text-red-500 mt-1">
                {errors.state.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="zip"
              className="block text-sm font-medium text-gray-700"
            >
              ZIP Code
            </label>
            <input
              id="zip"
              type="text"
              {...register("zip", {
                required: "ZIP code is required",
                pattern: {
                  value: /^\d{5}(-\d{4})?$/,
                  message: "Invalid ZIP code format",
                },
              })}
              className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.zip ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
              placeholder="90028"
            />
            {errors.zip && (
              <p className="text-sm text-red-500 mt-1">{errors.zip.message}</p>
            )}
          </div>
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            {...register("phone", {
              required: "Phone number is required",
              pattern: {
                value: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                message: "Invalid phone number format",
              },
            })}
            className={`w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 ${errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-blue-500"}`}
            placeholder="(555) 123-4567"
          />
          {errors.phone && (
            <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Address
          </button>
        </div>
      </form>
    </div>
  )
}

export default CheckoutBillingShippingEdit
