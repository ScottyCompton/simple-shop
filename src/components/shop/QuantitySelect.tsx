import { Button, Flex, Select } from "@radix-ui/themes"
import { useState, useEffect, useMemo } from "react"
import { addUpdateCart, removeFromCart } from "@/features/shop/cartSlice"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { cartItems } from "@/features/shop/cartSlice"
import toast from "react-hot-toast"
import type { CartItem, Product } from "@/types"

const qtyArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

type QuantitySelectProps = {
  product: Product
  className?: string
}

enum BTNTEXT {
  ADD = "Add To cart",
  REMOVE = "Remove from cart",
  UPDATE = "Update cart",
}

const QuantitySelect: React.FC<QuantitySelectProps> = ({
  product,
  className,
}: QuantitySelectProps) => {
  const dispatch = useAppDispatch()
  const currCartItem = useAppSelector(cartItems).find(
    item => item.id === product.id,
  )

  const qtyInCart = useMemo(() => {
    return currCartItem ? currCartItem.qty.toString() : ""
  }, [currCartItem])

  // the currently-selected value
  const [selectedValue, setSelectedValue] = useState(qtyInCart)

  // the button displayed on the text depending upon what's happening
  const [btnText, setBtnText] = useState(
    qtyInCart !== "" ? BTNTEXT.UPDATE : BTNTEXT.ADD,
  )

  // the button disabled state if conditions are met
  // const [btnDisabled, setBtnDisabled] = useState<boolean>(true)

  useEffect(() => {
    // user selects quantiy of zero, and item is already in the cart
    if (selectedValue === "0" && !!qtyInCart) {
      setBtnText(BTNTEXT.REMOVE)
      return
    }

    setBtnText(() => {
      return qtyInCart === "0"
        ? BTNTEXT.REMOVE
        : qtyInCart !== ""
          ? BTNTEXT.UPDATE
          : BTNTEXT.ADD
    })
  }, [qtyInCart, selectedValue])

  const handleClick = () => {
    // user hasn't selected a value yet
    if (!selectedValue) {
      alert("please select a quantity")
      return
    }

    // user selected '0' to remove the item from the cart
    if (currCartItem && selectedValue === "0") {
      dispatch(removeFromCart(product.id))
      toast.success(`Removed ${currCartItem.name} from your cart`)
      return
    }

    const item: CartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      qty: parseInt(selectedValue),
    }

    // user is going to update the quantity or add item to the cart
    dispatch(addUpdateCart(item))
    const msg = qtyInCart
      ? `Updated ${product.name} quantity to ${selectedValue}`
      : `Added ${product.name} from your cart`
    toast.success(msg)
  }

  const handleChange = (val: string) => {
    setSelectedValue(val)
  }

  return (
    <Flex
      direction="row"
      gap="1"
      align="center"
      justify="end"
      className={`w-full sm:w-auto ${className ?? ""}`}
    >
      <div className="flex-none">
        <Select.Root
          size="1"
          value={qtyInCart ? selectedValue : selectedValue.replace("0", "")}
          onValueChange={handleChange}
        >
          <Select.Trigger placeholder="Qty" className="min-w-[80px]" />
          <Select.Content className="text-sm">
            <Select.Group>
              <Select.Label>Qty</Select.Label>
              {!!qtyInCart && (
                <Select.Item value="0" key={0}>
                  0
                </Select.Item>
              )}
              {qtyArray.map(qty => (
                <Select.Item key={qty} value={qty.toString()}>
                  {qty}
                </Select.Item>
              ))}
            </Select.Group>
          </Select.Content>
        </Select.Root>
      </div>
      <div className="flex-none flex-grow sm:flex-grow-0">
        <Button size="1" onClick={handleClick} className="w-full sm:w-auto">
          <span className="cursor-pointer whitespace-nowrap">{btnText}</span>
        </Button>
      </div>
    </Flex>
  )
}

export default QuantitySelect
