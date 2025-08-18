import { useGetHomeProductCategoriesQuery } from "../../features/shop/productsApiSlice"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/app/hooks"
import { setCartCategory } from "@/features/shop/cartSlice"

const HomeCats = () => {
  const { data, isError, isLoading, isUninitialized } =
    useGetHomeProductCategoriesQuery(undefined)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  if (isLoading || isUninitialized) {
    return (
      <div className="flex justify-center items-center h-40 w-full">
        <div className="text-lg animate-pulse">Loading products...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-40 w-full">
        <div className="text-lg text-red-500">
          No categories found - he's dead, Jim!
        </div>
      </div>
    )
  }

  const { categories } = data

  const handleClick = (
    e: React.MouseEvent<HTMLImageElement | HTMLSpanElement>,
  ) => {
    // For span clicks, we need to get the category name differently
    const categoryName =
      "alt" in e.currentTarget
        ? e.currentTarget.alt
        : e.currentTarget.textContent || ""

    // Navigate to the shop page with the selected category
    dispatch(setCartCategory(categoryName))
    void navigate("/shop")
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6 w-full">
      {categories.map(category => (
        <div key={category.name} className="flex flex-col items-center">
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 w-full">
            <img
              src={category.imgUrl}
              alt={category.name}
              className="p-3 border border-gray-200 rounded-lg w-full aspect-square object-contain cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleClick}
            />
          </div>
          <span
            onClick={handleClick}
            className="cursor-pointer mt-2 text-center text-sm sm:text-base font-medium hover:text-blue-600 transition-colors"
          >
            {category.name}
          </span>
        </div>
      ))}
    </div>
  )
}

export default HomeCats
