import { useState, useEffect, useRef } from "react"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import {
  cartShippingType,
  cartItems,
  clearCart,
  setCartOrderCreationState,
  cartOPOrderCreationState,
} from "@/features/shop/cartSlice"
import { CartOrderCreationState } from "@/types"

import { selectUser } from "@/features/shop/usersSlice"
import axios from "axios"

type Props = {
  setIsOpen: (isOpen: boolean) => void
  paymentReference: string | null
}

type Result = {
  data: {
    orderNumber: string
  }
}

const OrderProcessor = ({ setIsOpen, paymentReference }: Props) => {
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const shippingTypeId = useAppSelector(cartShippingType)
  const orderProducts = useAppSelector(cartItems)
  const user = useAppSelector(selectUser)
  const orderCreationState = useAppSelector(cartOPOrderCreationState)
  const dispatch = useAppDispatch()
  const orderProcessed = useRef(false)

  useEffect(() => {
    const fetchData = async () => {
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

        await axios
          .post(
            `${import.meta.env.VITE_API_URL as string}/orders/create`,
            orderData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          )
          .then((response: Result) => {
            orderProcessed.current = true
            setOrderNumber(response.data.orderNumber)
            dispatch(clearCart())
            dispatch(setCartOrderCreationState(CartOrderCreationState.Created))
          })
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(String(error))
        }
        dispatch(setCartOrderCreationState(CartOrderCreationState.Failed))
      } finally {
        setLoading(false)
      }
    }

    if (!orderProcessed.current) {
      void fetchData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderCreationState])

  if (loading || orderCreationState === CartOrderCreationState.Creating) {
    return <div>Creating your order</div>
  }

  if (error || orderCreationState === CartOrderCreationState.Failed) {
    return <div>Could not create your order! Error: {error}</div>
  }

  return (
    <div>
      Your Order Has been received! Your order number is: {orderNumber} <br />
      <div
        onClick={() => {
          setIsOpen(false)
        }}
      >
        Close
      </div>
    </div>
  )
}

export default OrderProcessor
