import { useGetProductCategoriesQuery } from '../../features/shop/productsApiSlice'
import {Select} from '@radix-ui/themes';
import { setCartCategory, cartCategory } from '../../features/shop/cartSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'


const CategorySelect = () => {
    const dispatch = useAppDispatch()
    // const cartCategory = useAppSelector(cartCategory)
    const [category, setCategory] = useState<string>(useAppSelector(cartCategory))
    const location = useLocation()
    const navigate = useNavigate()

    const { data, isError, isLoading, isUninitialized } = useGetProductCategoriesQuery(undefined);

    if (isLoading || isUninitialized) {
        return <div className="text-sm min-w-[120px] sm:min-w-[150px] animate-pulse">Loading...</div>
    }

    if (isError) {
        return <div className="text-sm text-red-300 min-w-[120px] sm:min-w-[150px]">Error loading</div>
    }
    const { categories } = data;


  const onValueChange = (value: string) => {
        const newCat = value.replace('-1','')
        dispatch(setCartCategory(newCat))
        setCategory(newCat)

        if(location.pathname !== '/shop') {
            void navigate('/shop')
        }
    }

  return (
    <div className="min-w-[120px] sm:min-w-[150px]">
        <Select.Root size="1" value={category} onValueChange={onValueChange}>
        <Select.Trigger placeholder="Select Category" className="w-full"/>
        <Select.Content>
            <Select.Group>
                <Select.Label>Select Category</Select.Label>
                <Select.Item value="-1" key="-1">All Items</Select.Item>
                {categories.map(category => <Select.Item value={category} key={category}>{category}</Select.Item>)}
            </Select.Group>
        </Select.Content>
        </Select.Root>
    </div>
  )
}

export default CategorySelect