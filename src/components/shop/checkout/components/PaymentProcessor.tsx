import type { CardData } from "@/types"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import {
  setCartPaymentState,
  setCartOrderCreationState,
  cartOPPaymentState,
} from "@/features/shop/cartSlice"
import { CartPaymentState, CartOrderCreationState } from "@/types"

type Props = {
  ccData: CardData | null
  setIsOpen: (isOpen: boolean) => void
  setPaymentReference: (reference: string | null) => void
}

const generateRandomString = (length = 16) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  let result = ""
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const PaymentProcessor = ({
  ccData,
  setIsOpen,
  setPaymentReference,
}: Props) => {
  const dispatch = useAppDispatch()
  const paymentState = useAppSelector(cartOPPaymentState)

  useEffect(() => {
    console.log(ccData)
    const processPayment = async () => {
      try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        setPaymentReference(generateRandomString(16))
        dispatch(setCartPaymentState(CartPaymentState.Succeeded))
        dispatch(setCartOrderCreationState(CartOrderCreationState.Creating))
      } catch (error) {
        console.error("Payment processing failed:", error)
        dispatch(setCartPaymentState(CartPaymentState.Failed))
        setPaymentReference(null)
      }
    }

    void processPayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {paymentState == CartPaymentState.Processing && (
        <div>Processing Your Payment...</div>
      )}
      {paymentState == CartPaymentState.Failed && (
        <div>
          Payment Failed. Please try again.{" "}
          <div
            onClick={() => {
              setIsOpen(false)
            }}
          >
            Close
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentProcessor
