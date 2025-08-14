import { useAppSelector } from "../../app/hooks"
import { cartItems } from "../../features/shop/cartSlice"
import CartItem from "./CartItem"

const CartSummary = () => {
  const items = useAppSelector(cartItems)

  return (
    <div>
        <h2 className="text-lg font-bold mb-4">Cart Summary</h2>
        {items.length === 0 ? (
          <div>Your cart is empty</div>
        ) : (
          <div>
            {items.map(item => (
              <CartItem key={item.id} cartItemId={item.id} />
            ))}
          </div>
        )}

    </div>
  )
}

export default CartSummary