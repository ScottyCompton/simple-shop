import type { Product } from '../../types'
import { Flex } from '@radix-ui/themes'
import QuantitySelect from './QuantitySelect'
import { Link } from 'react-router-dom'

type ProductListItemProps = {
    product: Product
}

const ProductListItem:React.FC<ProductListItemProps> = ({product}: ProductListItemProps) => {

  return (
    <Flex gap="3" key={product.id} className="p-3 rounded shadow-sm mb-2 bg-slate-50 flex-col sm:flex-row">
      <div className="flex-none mb-2 sm:mb-0">
        <Link to={`/shop/products/${product.id.toString()}`}>
          <img 
            src={product.imgUrl} 
            className="border border-gray-300 rounded-sm w-full h-auto sm:w-24 sm:h-24 object-cover" 
            alt={`${product.mfgName} ${product.name}`}
          />
        </Link>
      </div>
      <div className="text-base text-left flex-grow">
        <span className="text-xl font-bold block mb-1">
          <Link to={`/shop/products/${product.id.toString()}`}>
            {product.mfgName} {product.name}
          </Link>
        </span>
        <div className="text-sm text-gray-600">{product.shortDesc}</div>
      </div>
      <Flex direction="column" className="text-right items-end flex-none mt-3 sm:mt-0">
        <div className="text-base text-right font-medium mb-2">${product.price}</div>
        <QuantitySelect product={product} />
      </Flex>
    </Flex>
  )
}

export default ProductListItem
