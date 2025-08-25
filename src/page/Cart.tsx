import CartSummary from "@/components/shop/cart/CartSummary"

const Cart = () => {
  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <h1
        className="text-2xl font-bold mb-6"
        style={{ color: "var(--color-primary)" }}
      >
        Cart Contents
      </h1>
      <CartSummary />
    </div>
  )
}

export default Cart
