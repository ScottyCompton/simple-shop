import { useState } from "react"
import { Select } from "@radix-ui/themes"
import { useAxiosGet } from "@/hooks/useAxiosGet"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import {
  cartShippingType,
  setCartShippingType,
} from "@/features/shop/cartSlice"

type ShippingSelectProps = {
  onSelectShippingType: (value: number) => void
}

const ShippingSelect: React.FC<ShippingSelectProps> = ({
  onSelectShippingType,
}: ShippingSelectProps) => {
  const dispatch = useAppDispatch()
  const [selectedShippingType, setSelectedShippingType] = useState(
    useAppSelector(cartShippingType),
  )
  const {
    data: shippingTypes,
    isError,
    isLoading,
  } = useAxiosGet("shippingtypes")

  if (isError) {
    return <div>---</div>
  }

  if (isLoading) {
    return <div>...</div>
  }

  const handleSelectShippingType = (value: string) => {
    setSelectedShippingType(value)
    dispatch(setCartShippingType(value))
    if (shippingTypes) {
      const price = shippingTypes.find(type => type.value === value)?.price ?? 0
      onSelectShippingType(price)
    }
  }

  return (
    <Select.Root
      value={selectedShippingType}
      defaultValue={
        shippingTypes && shippingTypes.length > 0 ? shippingTypes[0].value : ""
      }
      onValueChange={handleSelectShippingType}
    >
      <Select.Trigger placeholder="Select a shipping method" />
      <Select.Content>
        <Select.Group className="w-min-150">
          <Select.Label>Shipping Method</Select.Label>
          {shippingTypes?.map(option => (
            <Select.Item key={option.id} value={option.id.toString()}>
              {option.label} - ${option.price}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}

export default ShippingSelect
