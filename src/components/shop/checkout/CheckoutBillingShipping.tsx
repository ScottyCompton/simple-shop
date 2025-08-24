import { Flex } from "@radix-ui/themes"
import BillShipBox from "./components/BillShipBox"
import { useAppSelector } from "@/app/hooks"
import { selectUserLastUpdate } from "@/features/shop/usersSlice"
import { useState, useEffect } from "react"
import axios from "axios"
import { selectUser } from "@/features/shop/usersSlice"

import type { UserBilling, UserShipping, User } from "@/types"

type ApiResponse = {
  data: UserBillShipData
}

type UserBillShipData = {
  user?: {
    billing?: UserBilling
    shipping?: UserShipping
    billingLastUpdate?: Date | string
    shippingLastUpdate?: Date | string
  } & User
}

const CheckoutBillingShipping = () => {
  const lastUpdateState =
    useAppSelector(selectUserLastUpdate) ?? Date.now().toString()
  const [lastUpdate, setLastUpdate] = useState<string | Date>(lastUpdateState)

  useEffect(() => {
    setLastUpdate(lastUpdateState)
  }, [lastUpdateState])

  const currUser = useAppSelector(selectUser)
  const userId = currUser?.id ?? -1
  const [fData, setFData] = useState<{
    billing: UserBilling
    shipping: UserShipping
    billingLastUpdate: Date | string
    shippingLastUpdate: Date | string
  } | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get<ApiResponse>(
          `${import.meta.env.VITE_API_URL as string}/users/${userId.toString()}`,
        )

        // Destructure with type safety
        const responseData = response.data

        // Use optional chaining for safer property access
        const userData = responseData.data.user

        if (!userData) {
          console.log("Invalid response format:", responseData)
          setError("User data not found in server response")
          return
        }

        if (!userData.billing || !userData.shipping) {
          setError("Billing or shipping data not found in server response")
          return
        }

        setFData({
          billing: userData.billing,
          shipping: userData.shipping,
          billingLastUpdate: userData.billingLastUpdate ?? "",
          shippingLastUpdate: userData.shippingLastUpdate ?? "",
        })
      } catch (error) {
        console.log(error)
        setError(error instanceof Error ? error.message : String(error))
      } finally {
        setLoading(false)
      }
    }

    if (userId > 0) {
      void fetchData()
    } else {
      setLoading(false)
    }
  }, [userId, lastUpdate])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="p-4">
      <Flex
        direction={{ initial: "column", sm: "row" }}
        gap="4"
        className="w-full"
      >
        <div className="w-full">
          <BillShipBox
            data-id={`${String(fData?.billingLastUpdate ?? "")}-billing`}
            type="billing"
            data={fData?.billing}
          />
        </div>
        <div className="w-full">
          <BillShipBox
            data-id={`${String(fData?.shippingLastUpdate ?? "")}-shipping`}
            type="shipping"
            data={fData?.shipping}
          />
        </div>
      </Flex>
    </div>
  )
}

export default CheckoutBillingShipping
