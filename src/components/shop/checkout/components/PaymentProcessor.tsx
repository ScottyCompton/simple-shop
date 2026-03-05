import type { CardData } from "@/types"
import { useEffect, useState } from "react"

type Props = {
  ccData: CardData | null
  doClose: () => void
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

const PaymentProcessor = ({ ccData, doClose, setPaymentReference }: Props) => {
  const [paymentFailed, setPaymentFailed] = useState<boolean>(false)

  useEffect(() => {
    console.log(ccData)
    const processPayment = async () => {
      try {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000))
        setPaymentReference(generateRandomString(16))
      } catch (error) {
        console.error("Payment processing failed:", error)
        setPaymentFailed(true)
        setPaymentReference(null)
      }
    }

    void processPayment()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      {!paymentFailed && <div>Processing Your Payment...</div>}
      {paymentFailed && (
        <div>
          Payment Failed. Please try again.{" "}
          <div
            onClick={() => {
              doClose()
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
