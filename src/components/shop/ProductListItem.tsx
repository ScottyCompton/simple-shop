import type { Product } from '../../types'
import { Flex, Link } from '@radix-ui/themes'
import QuantitySelect from './QuantitySelect'
import { Link as RRLink } from 'react-router'

type ProductListItemProps = {
    product: Product
}

const ProductListItem:React.FC<ProductListItemProps> = ({product}: ProductListItemProps) => {

  return (
    <Flex gap="3" key={product.id} className="p-2 rounded mb-2 bg-slate-50 justify-items">
    <div className="flex-none"><RRLink to={`/shop/products/${product.id.toString()}`}><img src={product.imgUrl} className="border border-gray-300 rounded-sm w-25 h-25" /></RRLink></div>
    <div className="text-base text-left flex-grow"> <span className="text-xl text-bold"><Link href={`/shop/products/${product.id.toString()}`}>{product.mfgName} {product.name}</Link></span><br />{product.shortDesc}</div>
    <div className="text-base text-right flex-none">${product.price}</div>
    <QuantitySelect product={product} />

    {/* <div className="text-base">{product.category}</div>    */}
    </Flex>
  )
}

export default ProductListItem
