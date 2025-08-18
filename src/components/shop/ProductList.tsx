import { useGetProductsByCategoryQuery } from "@/features/shop/productsApiSlice"
import ProductListItem from "./ProductListItem"
import { useAppSelector } from "@/app/hooks"
import { cartCategory } from "@/features/shop/cartSlice"

const ProductList = () => {
  const category = useAppSelector(cartCategory)
  const { isError, data, isLoading, isUninitialized } =
    useGetProductsByCategoryQuery(category || "")

  if (isLoading || isUninitialized) {
    return <div>loading products...</div>
  }

  if (isError) {
    return <div>No products - he's dead, Jim!</div>
  }

  const { products } = data

  return (
    <>
      <div className="grid gap-4 w-full">
        {products.map(product => {
          return <ProductListItem key={product.id} product={product} />
        })}
      </div>
    </>
  )
}

export default ProductList
