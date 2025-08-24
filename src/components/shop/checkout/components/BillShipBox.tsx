import { Box, Flex } from "@radix-ui/themes"
import BillShipEditDialog from "./BillShipEditDialog"
import type { UserBilling, UserShipping } from "@/types"

type BillShipBoxProps = {
  type: "billing" | "shipping"
  data?: UserBilling | UserShipping | null
}

const BillShipBox: React.FC<BillShipBoxProps> = ({
  type,
  data,
}: BillShipBoxProps) => {
  return (
    <div>
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
        {!data && <div>Provide your {type} address to continue.</div>}
        {data && (
          <div className="space-y-1 text-sm sm:text-base text-gray-700">
            <div className="font-medium">
              {data.firstName} {data.lastName}
            </div>
            <div>
              {data.address1} {data.address2 ? `, ${data.address2}` : ""}
            </div>
            <div>
              {data.city}, {data.state} {data.zip}
            </div>
            <div className="flex items-center pt-1">
              <span className="text-gray-500">Phone:</span>
              <span className="ml-2">{data.phone}</span>
            </div>
          </div>
        )}
      </Box>
    </div>
  )
}

export default BillShipBox
