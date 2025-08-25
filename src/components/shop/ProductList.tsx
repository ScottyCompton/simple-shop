import { useGetProductsByCategoryQuery } from "@/features/shop/productsApiSlice"
import ProductListItem from "./ProductListItem"
// import { useAppSelector } from "@/app/hooks"
// import { cartCategory } from "@/features/shop/cartSlice"
import { Link, useParams } from "react-router-dom"

const ProductList = () => {
  // const category = useAppSelector(cartCategory)
  // get parameters from the url params
  const params = useParams()
  const { category, page } = params
  // Check if we're on a /shop/page/:page route
  const isPageRoute = window.location.pathname.startsWith("/shop/page/")
  const pageParam = isPageRoute ? params.page : page
  const currentPage = pageParam ? parseInt(pageParam) : 1

  // If we're on the /shop/page/:page route, we should use empty category
  const effectiveCategory = isPageRoute ? "" : (category ?? "")

  const { isError, data, isLoading, isUninitialized } =
    useGetProductsByCategoryQuery({
      category: effectiveCategory,
      page: currentPage,
    })

  if (isLoading || isUninitialized) {
    return <div>loading products...</div>
  }

  if (isError) {
    return <div>No products - he's dead, Jim!</div>
  }

  const { products, pagination } = data
  // pagination may be undefined for non-paginated responses
  const totalPages = pagination?.totalPages ?? 1

  return (
    <>
      <div className="grid gap-4 w-full">
        <h1
          className="text-lg font-bold mb-6"
          style={{ color: "var(--color-primary)" }}
        >
          <Link to="/shop">All Products</Link>
          {category && (
            <>
              &gt; <Link to={`/shop/${category}`}>{category}</Link>
            </>
          )}
        </h1>
        {products.map(product => {
          return <ProductListItem key={product.id} product={product} />
        })}

        {pagination && (
          <div className="flex justify-center mt-6 gap-2">
            {currentPage > 1 && (
              <Link
                to={
                  category
                    ? `/shop/${category}/${(currentPage - 1).toString()}`
                    : `/shop/page/${(currentPage - 1).toString()}`
                }
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Previous
              </Link>
            )}

            <div className="flex items-center">
              Page {currentPage} of {totalPages}
            </div>

            {currentPage < totalPages && (
              <Link
                to={
                  category
                    ? `/shop/${category}/${(currentPage + 1).toString()}`
                    : `/shop/page/${(currentPage + 1).toString()}`
                }
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next
              </Link>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default ProductList
