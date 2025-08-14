import { useAppSelector } from "../../app/hooks"
import { cartItems } from "../../features/shop/cartSlice"
import CartItem from "./CartItem"
import { Flex, Button } from "@radix-ui/themes"
import { Link } from "react-router-dom"

const CartSummary = () => {
  const items = useAppSelector(cartItems)
  
  // Calculate total price
  const totalPrice = items.reduce((sum, item) => {
    return sum + (item.price * item.qty)
  }, 0)

  return (
    <div className="w-full">
        <h2 className="text-xl sm:text-2xl font-bold mb-6">Your Cart</h2>
        {items.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-lg shadow-sm">
            <p className="text-lg text-gray-600 mb-4">Your cart is empty</p>
            <Button asChild size="3">
              <Link to="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="hidden sm:grid grid-cols-12 gap-2 p-3 font-semibold text-gray-700 bg-gray-100 rounded-t-lg">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Subtotal</div>
            </div>
            <div className="space-y-3">
              {items.map(item => (
                <CartItem key={item.id} cartItemId={item.id} />
              ))}
            </div>
            
            <Flex direction="column" className="mt-6 sm:mt-8" justify="end">
              <div className="bg-slate-50 p-4 sm:p-6 rounded-lg shadow-sm">
                <Flex justify="between" className="mb-2">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                </Flex>
                <Flex justify="between" className="mb-3">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="font-semibold">Free</span>
                </Flex>
                <div className="h-px w-full bg-gray-200 my-3"></div>
                <Flex justify="between" className="mb-5">
                  <span className="text-lg font-bold">Total:</span>
                  <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
                </Flex>
                <Flex direction="column" gap="2" className="mt-4">
                  <Button size="3" className="w-full">
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" asChild size="3" className="w-full">
                    <Link to="/shop">Continue Shopping</Link>
                  </Button>
                </Flex>
              </div>
            </Flex>
          </div>
        )}
    </div>
  )
}

export default CartSummary