import { useAppSelector } from "../../../app/hooks"
import { selectUser } from "../../../features/shop/usersSlice"
import { useGetUserByIdQuery } from "../../../features/shop/userApiSlice"
import { Box, Flex } from "@radix-ui/themes"
import type { UserShipping, UserBilling } from "../../../types"

const CheckoutBillingShipping = () => {
  const currUser = useAppSelector(selectUser)
  const userId = currUser?.id ?? -1
  const { data, isLoading, isError, isUninitialized } =
    useGetUserByIdQuery(userId)

  if (isLoading || isUninitialized) {
    return <div>loading...</div>
  }

  if (isError) {
    return <div>Error...</div>
  }

  const { user } = data
  const { billing, shipping } = user

  const billShipBox = (
    data: UserShipping | UserBilling,
    type: "billing" | "shipping",
  ) => {
    return (
      <Box className="bg-slate-50 p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full">
        <div className="border-b border-gray-200 pb-2 mb-3">
          <h3 className="text-lg font-semibold text-blue-800">
            {type === "billing" ? "Billing Address" : "Shipping Address"}
          </h3>
        </div>
        <div className="space-y-1 text-sm sm:text-base text-gray-700">
          <div className="font-medium">
            {data.firstName} {data.lastName}
          </div>
          <div>{data.address1}</div>
          {data.address2 && <div>{data.address2}</div>}
          <div>
            {data.city}, {data.state} {data.zip}
          </div>
          <div className="flex items-center pt-1">
            <span className="text-gray-500">Phone:</span>
            <span className="ml-2">{data.phone}</span>
          </div>
        </div>
      </Box>
    )
  }

  return (
    <div className="p-4">
      <Flex
        direction={{ initial: "column", sm: "row" }}
        gap="4"
        className="w-full"
      >
        <div className="w-full">{billShipBox(billing, "billing")}</div>
        <div className="w-full">{billShipBox(shipping, "shipping")}</div>
      </Flex>
    </div>
  )
}

export default CheckoutBillingShipping
