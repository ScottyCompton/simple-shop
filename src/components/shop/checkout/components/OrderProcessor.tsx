import { useState, useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import {
  cartShippingType,
  cartItems,
  clearCart,
} from "@/features/shop/cartSlice"

import { selectUser } from "@/features/shop/usersSlice"
import axios from "axios"
import { Flex, Heading, Box, Text, Button } from "@radix-ui/themes"
import { useTheme } from "@/context/ThemeContext"

type Props = {
  doClose: (navTo?: string) => void
  paymentReference: string | null
}

const OrderProcessor = ({ doClose, paymentReference }: Props) => {
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const shippingTypeId = useAppSelector(cartShippingType)
  const orderProducts = useAppSelector(cartItems)
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const orderProcessed = useRef(false)
  const { themeConfig } = useTheme()

  // Define fetchData outside useEffect so it can be reused
  const fetchData = async () => {
    // Set flag immediately to prevent duplicate requests
    orderProcessed.current = true
    setLoading(true)

    const orderData = {
      userId: user?.id,
      order: {
        shippingTypeId: parseInt(shippingTypeId),
        orderProducts,
        paymentReference,
      },
    }

    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        throw new Error("No token found")
      }

      // Do not use AbortController here since we need to ensure we get a response
      const response = await axios.post<{
        success: boolean
        order: Record<string, unknown>
        orderNumber: string
        productsAdded: number
      }>(`${import.meta.env.VITE_API_URL as string}/orders/create`, orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      // The orderNumber is at the root level of response.data
      setOrderNumber(response.data.orderNumber)
      dispatch(clearCart())
    } catch (error: unknown) {
      console.error("Order creation error:", error)

      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError(String(error))
      }
      // Reset the flag if there was an error
      orderProcessed.current = false
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Only run this effect once per component instance
    if (orderProcessed.current) {
      return
    }

    void fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <Text className="mb-2 text-lg font-medium">Creating your order...</Text>
        <div className="mt-2 w-6 h-6 border-t-2 border-blue-500 border-solid rounded-full animate-spin"></div>
      </Flex>
    )
  }

  if (error) {
    return (
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="p-6 bg-white rounded-lg shadow-md"
      >
        <Text className="mb-2 text-lg font-medium text-red-600">
          Order Creation Failed
        </Text>
        <Text className="text-center">
          Could not create your order! Error: {error}
        </Text>
        <Box className="mt-4">
          <div
            style={{
              display: "inline-block",
              borderRadius: "8px",
              overflow: "hidden",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <div
              style={{
                padding: "4px",
                borderRadius: "8px",
              }}
            >
              <Button
                variant="outline"
                color={themeConfig.color}
                onClick={() => {
                  orderProcessed.current = false
                  setLoading(true)
                  setError(null)
                  void fetchData()
                }}
              >
                Try Again
              </Button>
            </div>
          </div>
        </Box>
      </Flex>
    )
  }

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <Heading size="5" className="mb-2 text-center">
        Order Confirmed!
      </Heading>
      <Text className="mb-4 text-center">
        Your order has been received! Your order number is:{" "}
        <span className="font-bold">{orderNumber}</span>
      </Text>
      <Box className="mt-4">
        <Button
          variant="solid"
          size="2"
          className="!p-4 !rounded-md !cursor-pointer"
          color={themeConfig.color}
          onClick={() => {
            doClose("/shop/thank-you")
          }}
        >
          View My Orders
        </Button>
      </Box>
    </Flex>
  )
}

export default OrderProcessor
