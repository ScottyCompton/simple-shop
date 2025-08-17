import { useState, useEffect } from "react"
import type { ShippingType, ShippingTypesApiResponse } from "../../../../types"
import { Select } from "@radix-ui/themes"

type ShippingSelectProps = {
  onSelectShippingType: (value: number) => void
}

const ShippingSelect: React.FC<ShippingSelectProps> = ({
  onSelectShippingType,
}: ShippingSelectProps) => {
  const [selectedShippingType, setSelectedShippingType] = useState("standard")
  const [shippingTypes, setShippingTypes] = useState<ShippingType[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch shipping types from an API or define them here
    const fetchShippingTypes = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL as string
        const response = await fetch(`${baseUrl}/shippingtypes`)
        if (!response.ok) {
          throw new Error("Failed to fetch shipping types")
        }
        const { data } = (await response.json()) as ShippingTypesApiResponse
        const { shippingTypes } = data
        setShippingTypes(shippingTypes)
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message)
        }
      } finally {
        setLoading(false)
      }
    }

    void fetchShippingTypes()
  }, [])

  if (error) {
    return <div>---</div>
  }

  if (loading) {
    return <div>...</div>
  }

  const handleSelectShippingType = (value: string) => {
    setSelectedShippingType(value)
    const price = shippingTypes.find(type => type.value === value)?.price ?? 0
    onSelectShippingType(price)
  }

  return (
    <Select.Root
      value={selectedShippingType}
      defaultValue={shippingTypes[0].value}
      onValueChange={handleSelectShippingType}
    >
      <Select.Trigger placeholder="Select a shipping method" />
      <Select.Content>
        <Select.Group className="w-min-150">
          <Select.Label>Shipping Method</Select.Label>
          {shippingTypes.map(option => (
            <Select.Item key={option.value} value={option.value}>
              {option.label} - ${option.price.toFixed(2)}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  )
}

export default ShippingSelect
