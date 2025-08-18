import { Flex } from "@radix-ui/themes"
import BillShipBox from "./components/BillShipBox"

const CheckoutBillingShipping = () => {
  return (
    <div className="p-4">
      <Flex
        direction={{ initial: "column", sm: "row" }}
        gap="4"
        className="w-full"
      >
        <div className="w-full">
          <BillShipBox type="billing" />
        </div>
        <div className="w-full">
          <BillShipBox type="shipping" />
        </div>
      </Flex>
    </div>
  )
}

export default CheckoutBillingShipping
