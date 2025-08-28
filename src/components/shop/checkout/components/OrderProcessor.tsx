import { useState, useEffect } from "react"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import {
  cartShippingType,
  cartItems,
  clearCart,
} from "@/features/shop/cartSlice"
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
  const dispatch = useAppDispatch()

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
            setOrderNumber(response.data.orderNumber)
            dispatch(clearCart())
          })
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message)
        } else {
          setError(String(error))
        }
      } finally {
        setLoading(false)
      }
    }

    void fetchData()
  }, [orderProducts, shippingTypeId, user?.id, paymentReference, dispatch])

  if (loading) {
    return <div>Creating your order</div>
  }

  if (error) {
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
