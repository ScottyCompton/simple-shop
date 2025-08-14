import { Flex } from "@radix-ui/themes"
import { useGetProductDetailsQuery } from "../../features/shop/productsApiSlice"
import QuantitySelect from "./QuantitySelect"

type ProductDetailProps = {
    id: number
}

const ProductDetail:React.FC<ProductDetailProps> = ({id}: ProductDetailProps) => {

    const {data, isLoading, isError, isUninitialized} = useGetProductDetailsQuery(id)


    if(isLoading || isUninitialized) {
        return (
            <div>Loading...</div>
        )
    }

    if(isError) {
        return (
            <div>Error Locating that product</div>
        )
    }

    const {product} = data

  return (
    <div>
        <div className="py-5"><h1 className="text-3xl bold">{product.mfgName} {product.name}</h1>{product.shortDesc}</div>
        <Flex direction="column" gap="5" className="mb-5">
            <Flex gap="3" className="p-2 mb-2 bg-slate-50 justify-items">
                <div className="flex-none"><img src={product.imgUrl} className="border border-gray-300 rounded-lg shadow-md w-75 h-75" /></div>
                <div className="text-base text-left flex-grow px-5"> 
                    <div>
                        <div className="text-md font-bold">About this product:</div> 
                        <div className="p-3 text-sm">{product.longDesc}</div>
                    </div>
                </div>
                <div className="text-base text-right flex-none">${product.price}</div>
            </Flex>
            <div className="items-end"><QuantitySelect product={product} /></div>
        </Flex>
    </div>
  )
}

export default ProductDetail