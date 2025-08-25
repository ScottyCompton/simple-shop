import { Flex } from "@radix-ui/themes"
import { useGetProductDetailsQuery } from "@/features/shop/productsApiSlice"
import QuantitySelect from "../ui/QuantitySelect"

type ProductDetailProps = {
  id: number
}

const ProductDetail: React.FC<ProductDetailProps> = ({
  id,
}: ProductDetailProps) => {
  const { data, isLoading, isError, isUninitialized } =
    useGetProductDetailsQuery(id)

  if (isLoading || isUninitialized) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error Locating that product</div>
  }

  const { product } = data

  return (
    <div className="w-full px-4 sm:px-6 md:px-8">
      <div className="py-3 sm:py-5">
        <h1
          className="text-2xl sm:text-3xl font-bold mb-2"
          style={{ color: "var(--color-primary)" }}
        >
          {product.mfgName} {product.name}
        </h1>
        <p className="text-sm sm:text-base">{product.shortDesc}</p>
      </div>
      <Flex direction="column" gap="3" className="mb-5">
        <div
          className="p-2 sm:p-4 mb-2 bg-slate-50 rounded-lg shadow-sm"
          style={{ backgroundColor: "var(--component-bg)" }}
        >
          {/* Mobile-first layout that stacks on small screens and becomes flex on medium+ */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Image - centered on mobile, left-aligned on larger screens */}
            <div className="flex-none mx-auto md:mx-0">
              <img
                src={product.imgUrl}
                className="border border-gray-300 rounded-lg shadow-md w-full max-w-xs md:max-w-sm object-contain h-auto"
                style={{ borderColor: "var(--border-color)" }}
                alt={`${product.mfgName} ${product.name}`}
              />
            </div>

            {/* Product details - full width on mobile */}
            <div className="flex flex-col flex-grow">
              <div className="text-base text-left px-1 sm:px-3 md:px-5">
                <div>
                  <div
                    className="text-md font-bold mt-2 md:mt-0"
                    style={{ color: "var(--text-primary)" }}
                  >
                    About this product:
                  </div>
                  <div
                    className="p-2 sm:p-3 text-sm"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {product.longDesc}
                  </div>
                </div>
              </div>

              {/* Price and quantity - aligned properly on both mobile and desktop */}
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div
                  className="text-xl font-bold text-left w-full sm:w-auto"
                  style={{ color: "var(--text-primary)" }}
                >
                  ${product.price}
                </div>
                <div className="w-full sm:w-auto">
                  <QuantitySelect product={product} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Flex>
    </div>
  )
}

export default ProductDetail
