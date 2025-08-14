import { useGetHomeProductCategoriesQuery } from '../../features/shop/productsApiSlice'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../app/hooks'
import { setCartCategory } from '../../features/shop/cartSlice'
import { Flex } from '@radix-ui/themes'

const HomeCats = () => {
    const { data, isError, isLoading, isUninitialized } = useGetHomeProductCategoriesQuery(undefined);
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    if(isLoading || isUninitialized) {
        return <div>Loading categories...</div>
    }

    if(isError) {
        return <div>Problem loading categories</div>
    }

    const { categories } = data;

    const handleClick = (e: React.MouseEvent<HTMLImageElement>) => {
        const categoryName = e.currentTarget.alt;   
        // Navigate to the shop page with the selected category
        dispatch(setCartCategory(categoryName))
        void navigate('/shop');
    }
  return (
    <Flex direction="row" justify="between" gap="2" wrap="wrap">{
        categories.map((category) => <div key={category.name} className="text-center"><img key={category.name} src={category.imgUrl} alt={category.name} className="p-3 border border-gray-300 rounded-sm w-35 h-35 cursor-pointer hover:opacity-75" onClick={handleClick} /><span onClick={handleClick} className="cursor-pointer">{category.name}</span></div>)
    }</Flex>
  )
}

export default HomeCats