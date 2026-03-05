import { useGetProductCategoriesQuery } from "@/features/shop/productsApiSlice"
import { Select } from "@radix-ui/themes"
import { cartCategory, setCartCategory } from "@/features/shop/cartSlice"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

const CategorySelect = () => {
  const reduxCategory = useAppSelector(cartCategory)
  const [category, setCategory] = useState<string>(reduxCategory)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  // Update local state when Redux category changes
  useEffect(() => {
    setCategory(reduxCategory)
  }, [reduxCategory])

  const { data, isError, isLoading, isUninitialized } =
    useGetProductCategoriesQuery(undefined)

  if (isLoading || isUninitialized) {
    return (
      <div className="text-sm min-w-[120px] sm:min-w-[150px] animate-pulse">
        Loading...
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-sm text-red-300 min-w-[120px] sm:min-w-[150px]">
        Error loading
      </div>
    )
  }
  const { categories } = data

  const onValueChange = (value: string) => {
    if (value === "-1") {
      dispatch(setCartCategory(""))
      void navigate("/shop")
    } else {
      dispatch(setCartCategory(value))
      void navigate(`/shop/${value}`)
    }
  }

  return (
    <div className="min-w-[120px] sm:min-w-[150px]">
      <Select.Root
        size="1"
        value={category || "-1"}
        onValueChange={onValueChange}
      >
        <Select.Trigger placeholder="Select Category" className="w-full" />
        <Select.Content>
          <Select.Group>
            <Select.Label>Select Category</Select.Label>
            <Select.Item value="-1" key="-1">
              All Items
            </Select.Item>
            {categories.map(cat => (
              <Select.Item value={cat.toLowerCase()} key={cat}>
                {cat}
              </Select.Item>
            ))}
          </Select.Group>
        </Select.Content>
      </Select.Root>
    </div>
  )
}

export default CategorySelect
