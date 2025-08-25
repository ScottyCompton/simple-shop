import { useGetProductDetailsQuery } from "../../../features/shop/productsApiSlice"
import QuantitySelect from "../../ui/QuantitySelect"
import { useAppSelector } from "../../../app/hooks"
import { cartItems } from "../../../features/shop/cartSlice"
import { Link } from "react-router-dom"
import { Flex } from "@radix-ui/themes"

type CartSummaryItemProps = {
  cartItemId: number
  isCheckout?: boolean
}

const CartSummaryItem: React.FC<CartSummaryItemProps> = ({
  cartItemId,
  isCheckout = false,
}: CartSummaryItemProps) => {
  const { data, isLoading, isError, isUninitialized } =
    useGetProductDetailsQuery(cartItemId)
  const cartItem = useAppSelector(cartItems).find(
    item => item.id === cartItemId,
  )

  if (isLoading || isUninitialized) {
    return (
      <div
        className="bg-slate-50 p-4 rounded-lg shadow-sm animate-pulse"
        style={{ backgroundColor: "var(--component-bg)" }}
      >
        <div
          className="h-24 w-full bg-gray-200 rounded"
          style={{ backgroundColor: "var(--component-bg-alt)" }}
        ></div>
      </div>
    )
  }

  if (isError || !cartItem) {
    return (
      <div
        className="bg-slate-50 p-4 rounded-lg shadow-sm"
        style={{ backgroundColor: "var(--component-bg)" }}
      >
        <div className="text-red-500">Error loading product details</div>
      </div>
    )
  }

  const { product } = data
  const subtotal = product.price * cartItem.qty

  return (
    <div
      className="bg-slate-50 p-3 sm:p-4 rounded-lg shadow-sm"
      style={{ backgroundColor: "var(--component-bg)" }}
    >
      {/* Mobile layout (stacked) */}
      <div className="block sm:hidden">
        <Flex direction="row" gap="3" align="start" className="mb-3">
          <div className="flex-none">
            <Link to={`/shop/products/${product.id.toString()}`}>
              <img
                src={product.imgUrl}
                alt={product.name}
                className="border border-gray-300 rounded-sm w-16 h-16 object-cover"
                style={{ borderColor: "var(--border-color)" }}
              />
            </Link>
          </div>
          <div className="flex-grow">
            <Link
              to={`/shop/products/${product.id.toString()}`}
              className="font-medium hover:text-blue-600"
            >
              {product.mfgName} {product.name}
            </Link>
            <div
              className="text-sm text-gray-600 mt-1"
              style={{ color: "var(--text-secondary)" }}
            >
              {product.shortDesc}
            </div>
          </div>
        </Flex>
        <Flex justify="between" className="mb-2 text-sm">
          <span style={{ color: "var(--text-primary)" }}>Price:</span>
          <span
            className="font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            ${product.price}
          </span>
        </Flex>
        <Flex justify="between" className="mb-3">
          <span className="text-sm" style={{ color: "var(--text-primary)" }}>
            Quantity:
          </span>
          {isCheckout ? (
            <span
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {cartItem.qty}
            </span>
          ) : (
            <QuantitySelect product={product} className="max-w-[180px]" />
          )}
        </Flex>
        <Flex
          justify="between"
          className="pt-2 border-t border-gray-200"
          style={{ borderColor: "var(--border-color)" }}
        >
          <span
            className="font-medium"
            style={{ color: "var(--text-primary)" }}
          >
            Subtotal:
          </span>
          <span className="font-bold" style={{ color: "var(--text-primary)" }}>
            ${subtotal.toFixed(2)}
          </span>
        </Flex>
      </div>

      {/* Desktop layout (grid) */}
      <div className="hidden sm:grid grid-cols-12 gap-2 items-center">
        <div className="col-span-6">
          <Flex direction="row" gap="3" align="center">
            <div className="flex-none">
              <Link to={`/shop/products/${product.id.toString()}`}>
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  className="border border-gray-300 rounded-sm w-16 h-16 object-cover"
                />
              </Link>
            </div>
            <div className="flex-grow">
              <Link
                to={`/shop/products/${product.id.toString()}`}
                className="font-medium hover:text-blue-600"
              >
                {product.mfgName} {product.name}
              </Link>
              <div
                className="text-sm text-gray-600 mt-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {product.shortDesc}
              </div>
            </div>
          </Flex>
        </div>
        <div
          className="col-span-2 text-center"
          style={{ color: "var(--text-primary)" }}
        >
          ${product.price}
        </div>
        <div className="col-span-2 text-center">
          {isCheckout ? (
            <span
              className="font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              {cartItem.qty}
            </span>
          ) : (
            <QuantitySelect product={product} className="max-w-[180px]" />
          )}
        </div>
        <div
          className="col-span-2 text-right font-bold"
          style={{ color: "var(--text-primary)" }}
        >
          ${subtotal.toFixed(2)}
        </div>
      </div>
    </div>
  )
}

export default CartSummaryItem
