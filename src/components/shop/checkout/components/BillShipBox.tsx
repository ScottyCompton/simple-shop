import { Box, Flex } from "@radix-ui/themes"
import { useAppSelector } from "@/app/hooks"
import { useState, useEffect } from "react"
import {
  selectUser,
  selectHasBilling,
  selectHasShipping,
} from "@/features/shop/usersSlice"
import BillShipEditDialog from "./BillShipEditDialog"
import axios from "axios"
import type { UserBilling, UserShipping, User } from "@/types"

type BillShipBoxProps = {
  type: "billing" | "shipping"
  lastUpdate: string | Date
}

type ApiResponse = {
  data: {
    user?: {
      billing?: UserBilling
      shipping?: UserShipping
    } & User
  }
}

const BillShipBox: React.FC<BillShipBoxProps> = ({
  type,
  lastUpdate,
}: BillShipBoxProps) => {
  const currUser = useAppSelector(selectUser)
  const hasBilling = useAppSelector(selectHasBilling)
  const hasShipping = useAppSelector(selectHasShipping)
  const userId = currUser?.id ?? -1
  const [fData, setFData] = useState<UserBilling | UserShipping | null>(null)
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

        if (type === "billing") {
          const billingData = userData.billing
          if (billingData) {
            setFData(billingData)
          } else {
            console.log("No billing data found")
          }
        } else {
          const shippingData = userData.shipping
          if (shippingData) {
            setFData(shippingData)
          } else {
            console.log("No shipping data found")
          }
        }
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
    // Add lastUpdate to the dependency array so the component refreshes when it changes
    // Also add hasBilling and hasShipping to reload data when those flags change
  }, [type, userId, lastUpdate, hasBilling, hasShipping])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div data-id={lastUpdate}>
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

        {type === "billing" && !hasBilling && (
          <div>Provide your billing address to continue.</div>
        )}
        {type === "shipping" && !hasShipping && (
          <div>Provide your shipping address to continue.</div>
        )}
        {fData && (type === "billing" ? hasBilling : hasShipping) && (
          <div className="space-y-1 text-sm sm:text-base text-gray-700">
            <div className="font-medium">
              {fData.firstName} {fData.lastName}
            </div>
            <div>
              {fData.address1} {fData.address2}
            </div>
            <div>
              {fData.city}, {fData.state} {fData.zip}
            </div>
            <div className="flex items-center pt-1">
              <span className="text-gray-500">Phone:</span>
              <span className="ml-2">{fData.phone}</span>
            </div>
          </div>
        )}
      </Box>
    </div>
  )
}

export default BillShipBox
