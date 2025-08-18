import CheckoutForm from "@/components/shop/checkout/CheckoutForm"
import { cartCount } from "@/features/shop/cartSlice"
import { useAppSelector } from "@/app/hooks"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"

const Checkout = () => {
  const navigate = useNavigate()
  const itemCount = useAppSelector(cartCount)

  useEffect(() => {
    const doNav = async () => {
      await navigate("/shop")
    }

    if (itemCount === 0) {
      void doNav()
    }
  }, [itemCount, navigate])

  return (
    <div>
      <CheckoutForm />
    </div>
  )
}

export default Checkout
