import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { ProductListApiResponse, 
  CategoryApiResponse, 
  ProductDetailApiResponse, 
  ProductDetailApiDataResponse,
  HomeCategoryApiDataResponse, 
  HomeCategoryApiResponse,
  CategoryApiDataResponse, 
  ProductListApiDataResponse,
 } from "../../types";
// import productsData from './data/products.json'


export const productsApiSlice = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000/api/' }), // Can use any base URL, as queryFn will override
    reducerPath: 'productsApi',
    tagTypes: ['Products'],
    endpoints: build => ({
      getAllProducts: build.query<ProductListApiDataResponse, undefined>({
        query: () => 'products',
        providesTags: (_result, _error, id) => [{ type: "Products", id }],  
        transformResponse: (response: ProductListApiResponse) => {
          return response.data;
        }
      }),
      getProductsByCategory: build.query<ProductListApiDataResponse, string>({
        query: (category) => category !== '' ? `products/category/${category}` : 'products',
        providesTags: (_result, _error, id) => [{ type: "Products", id }],
        transformResponse: (response: ProductListApiResponse) => {
          return response.data;
        }
      }),
      getProductCategories: build.query<CategoryApiDataResponse, undefined>({
        query: () => 'categories',
        providesTags: (_result, _error, id) => [{ type: "Products", id }],
        transformResponse: (response: CategoryApiResponse) => {
          const {data}  = response;
          return data;
        }
      }),
      getHomeProductCategories: build.query<HomeCategoryApiDataResponse,undefined>({
        query: () => 'categories/home',
        providesTags: (_result, _error, id) => [{ type: "Products", id }],
        transformResponse: (response: HomeCategoryApiResponse) => {
          return response.data;
        }
      }),
      getProductDetails: build.query<ProductDetailApiDataResponse, number>({
        query: (id) => `products/${id.toString()}`,
        providesTags: (_result, _error, id) => [{ type: "Products", id }],
        transformResponse: (response: ProductDetailApiResponse) => {
          return response.data;  
  
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