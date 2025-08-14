import { useGetProductDetailsQuery } from '../../features/shop/productsApiSlice';
import QuantitySelect from './QuantitySelect';


const CartItem: React.FC<{ cartItemId: number }> = ({ cartItemId }) => {
    const {data, isLoading, isError, isUninitialized} = useGetProductDetailsQuery(cartItemId)
    if (isLoading || isUninitialized) {
      return <div>Loading...</div>
    }

    if (isError) {
      return <div>Error loading product details</div>
    }

    const {product} = data;

  return (
    <>
    <div>{product.name}</div>
    <div>{product.price}</div>
    <div>{product.shortDesc}</div>
    <div>{product.category}</div>
    <div><img src={product.imgUrl} alt={product.name} /></div>
    <div><QuantitySelect product={product} /></div>
    </>
  )
}

export default CartItem