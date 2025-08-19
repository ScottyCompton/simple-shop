import { useState } from "react"
import type { ShippingType } from "@/types"
import { Select } from "@radix-ui/themes"
import { useFetchData, FETCHTYPE } from "@/hooks/useFetchData"

type ShippingSelectProps = {
  onSelectShippingType: (value: number) => void
}

const ShippingSelect: React.FC<ShippingSelectProps> = ({
  onSelectShippingType,
}: ShippingSelectProps) => {
  const [selectedShippingType, setSelectedShippingType] = useState("standard")
  const {
    data: shippingTypes,
    error,
    loading,
  } = useFetchData(FETCHTYPE.SHIPPING)

  if (error) {
    return <div>---</div>
  }

  if (loading) {
    return <div>...</div>
  }

  const handleSelectShippingType = (value: string) => {
    setSelectedShippingType(value)
    if (Array.isArray(shippingTypes)) {
      const price =
        (shippingTypes as ShippingType[]).find(
          (type: ShippingType) => type.value === value,
        )?.price ?? 0
      onSelectShippingType(price)
    }
  }

  return (
    <Select.Root
      value={selectedShippingType}
      defaultValue={
        Array.isArray(shippingTypes) &&
        (shippingTypes as ShippingType[]).length > 0
          ? (shippingTypes as ShippingType[])[0].value
          : ""
      }
      onValueChange={handleSelectShippingType}
    >
      <Select.Trigger placeholder="Select a shipping method" />
      <Select.Content>
        <Select.Group className="w-min-150">
          <Select.Label>Shipping Method</Select.Label>
          {(shippingTypes as ShippingType[]).map(option => (
            <Select.Item key={option.value} value={option.value}>
              {option.label} - ${option.price}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}

export default ShippingSelect
