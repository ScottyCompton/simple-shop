import { useGetProductCategoriesQuery } from '../../features/shop/productsApiSlice'
import {Select} from '@radix-ui/themes';
import { setCartCategory, cartCategory } from '../../features/shop/cartSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'


const CategorySelect = () => {
    const dispatch = useAppDispatch()
    const [category, setCategory] = useState<string>(useAppSelector(cartCategory))
    const location = useLocation()
    const navigate = useNavigate()

    const { data, isError, isLoading, isUninitialized } = useGetProductCategoriesQuery(undefined);

    if (isLoading || isUninitialized) {
        return <div>Loading categories...</div>
    }

    if (isError) {
        return <div>Problem loading categories</div>
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
    <div>
        <Select.Root size="1" value={category} onValueChange={onValueChange}>
        <Select.Trigger placeholder="Select Category"/>
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