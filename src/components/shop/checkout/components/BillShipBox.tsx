import { Box, Flex } from "@radix-ui/themes"
import { useAppSelector } from "../../../../app/hooks"
import { selectUser } from "../../../../features/shop/usersSlice"
import { useGetUserByIdQuery } from "../../../../features/shop/userApiSlice"
import BillShipEditDialog from "./BillShipEditDialog"

type BillShipBoxProps = {
  type: "billing" | "shipping"
}

const BillShipBox: React.FC<BillShipBoxProps> = ({
  type,
}: BillShipBoxProps) => {
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

  const fData = type === "billing" ? billing : shipping

  return (
    <>
      <Box className="bg-slate-50 p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full">
        <div className="border-b border-gray-200 pb-2 mb-3">
          <Flex>
            <h3 className="text-lg font-semibold text-blue-800">
              {type === "billing" ? "Billing Address" : "Shipping Address"}
            </h3>
            <div className="flex grow justify-end">
              <BillShipEditDialog editType={type} />
            </div>
          </Flex>
        </div>
        <div className="space-y-1 text-sm sm:text-base text-gray-700">
          <div className="font-medium">
            {fData.firstName} {fData.lastName}
          </div>
          <div>{fData.address1}</div>
          {fData.address2 && <div>{fData.address2}</div>}
          <div>
            {fData.city}, {fData.state} {fData.zip}
          </div>
          <div className="flex items-center pt-1">
            <span className="text-gray-500">Phone:</span>
            <span className="ml-2">{fData.phone}</span>
          </div>
        </div>
      </Box>
    </>
  )
}

export default BillShipBox
