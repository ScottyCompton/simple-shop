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
      <Box
        className="bg-slate-50 p-4 sm:p-5 rounded-lg shadow-sm hover:shadow-md transition-shadow w-full"
        style={{ backgroundColor: "var(--component-bg)" }}
      >
        <div
          className="border-b border-gray-200 pb-2 mb-3"
          style={{ borderColor: "var(--border-color)" }}
        >
          <Flex>
            <h3
              className="text-lg font-semibold"
              style={{ color: "var(--color-primary)" }}
            >
              {type === "billing" ? "Billing Address" : "Shipping Address"}
            </h3>
            <div className="flex grow justify-end">
              <BillShipEditDialog editType={type} />
            </div>
          </Flex>
        </div>
        {!data && (
          <div style={{ color: "var(--text-primary)" }}>
            Provide your {type} address to continue.
          </div>
        )}
        {data && (
          <div
            className="space-y-1 text-sm sm:text-base"
            style={{ color: "var(--text-secondary)" }}
          >
            <div
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {data.firstName} {data.lastName}
            </div>
            <div>
              {data.address1} {data.address2 ? `, ${data.address2}` : ""}
            </div>
            <div>
              {data.city}, {data.state} {data.zip}
            </div>
            <div className="flex items-center pt-1">
              <span style={{ color: "var(--text-muted)" }}>Phone:</span>
              <span className="ml-2">{data.phone}</span>
            </div>
          </div>
        )}
      </Box>
    </div>
  )
}

export default BillShipBox
