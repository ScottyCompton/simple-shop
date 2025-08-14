// import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { useGetProductsByCategoryQuery } from '../../features/shop/productsApiSlice'
import ProductListItem from './ProductListItem';
import { useAppSelector } from '../../app/hooks';
import { cartCategory } from '../../features/shop/cartSlice';


const ProductList = () => {
    const category = useAppSelector(cartCategory)
    const { isError, data,  isLoading, isUninitialized } = useGetProductsByCategoryQuery(category || '');

    if (isLoading || isUninitialized) {
        return (
            <div>loading products...</div>
        )
    }

    if (isError) {
        return <div>Problem loading products</div>
    }

    const { products } = data;

    // const getCartCount = (id: number) => {
    //     const item = currCartItems.find(item => item.id === id)
    //     return item ? item.qty.toString() : ''
    // }

  return (
    <>
    <div>
        {products.map((product) => {
            return (
                <ProductListItem key={product.id} product={product} />
            )
        })}

    </div>
    </>
  )
}

export default ProductList