import { Flex } from "@radix-ui/themes"
import BillShipBox from "./components/BillShipBox"
import { useAppSelector } from "@/app/hooks"
import { selectUserLastUpdate } from "@/features/shop/usersSlice"
import { useState, useEffect } from "react"

const CheckoutBillingShipping = () => {
  const lastUpdateState =
    useAppSelector(selectUserLastUpdate) ?? Date.now().toString()
  const [lastUpdate, setLastUpdate] = useState<string | Date>(lastUpdateState)

  useEffect(() => {
    setLastUpdate(lastUpdateState)
    console.log("UPDATED lastUpdate to ", lastUpdateState)
  }, [lastUpdateState])

  return (
    <div className="p-4">
      <Flex
        direction={{ initial: "column", sm: "row" }}
        gap="4"
        className="w-full"
      >
        <div className="w-full">
          <BillShipBox type="billing" lastUpdate={lastUpdate} />
        </div>
        <div className="w-full">
          <BillShipBox type="shipping" lastUpdate={lastUpdate} />
        </div>
      </Flex>
    </div>
  )
}

export default CheckoutBillingShipping
