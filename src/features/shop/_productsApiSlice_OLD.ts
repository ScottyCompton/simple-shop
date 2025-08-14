import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProductListApiResponse, CategoryApiResponse, ProductDetailApiResponse, HomeCategoryAPIResponse } from "../../types";
import productsData from './data/products.json'


export const productsApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: '/' }), // Can use any base URL, as queryFn will override
    reducerPath: 'productsApi',
    tagTypes: ['Products'],
    endpoints: build => ({
      getAllProducts: build.query<ProductListApiResponse, undefined>({
        queryFn: () => {
            const data = productsData as ProductListApiResponse;
            return { data };
        },
      }),
      getProductsByCategory: build.query<ProductListApiResponse, string>({
        queryFn: (category = '') => {
            const data = productsData as ProductListApiResponse;
            const filteredProducts = category === '' ? data.products : data.products.filter(product => product.category === category);
            return { data: { products: filteredProducts } };
        },
      }),
      getProductCategories: build.query<CategoryApiResponse, undefined>({
        queryFn: () => {
            const data =  productsData as ProductListApiResponse;
            const uniqueCategories = new Set(data.products.map(product => product.category));
            return { data: { categories: Array.from(uniqueCategories) } }
                
        }
      }),
      getHomeProductCategories: build.query<HomeCategoryAPIResponse,undefined>({
        queryFn: () => {
          const data =  productsData as ProductListApiResponse;
          const uniqueCategories = new Set(data.products.map(product => product.category));
          const categories = Array.from(uniqueCategories).map(category => {
            const productsInCategory = data.products.filter(product => product.category === category);
            return {
              name: category,
              imgUrl: productsInCategory[0]?.imgUrl || '',
              productCount: productsInCategory.length
            };
          });
          categories.sort((a, b) => a.name < b.name ? -1 : 1);
          return { data: { categories } }
        }
      }),
      getProductDetails: build.query<ProductDetailApiResponse, number>({
        queryFn: (productId) => {
            const product = productsData.products.find((product) => product.id === productId);
            if (!product) {
                return { error: { status: 404, data: 'Product not found' } };
            }
            return { data: { product } };
        }
      })
    }),
});

export const { 
    useGetAllProductsQuery, 
    useGetProductsByCategoryQuery, 
    useGetProductCategoriesQuery, 
    useGetProductDetailsQuery,
    useGetHomeProductCategoriesQuery 
} = productsApiSlice;