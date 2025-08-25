import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  ProductListApiResponse,
  CategoryApiResponse,
  ProductDetailApiResponse,
  ProductDetailApiDataResponse,
  HomeCategoryApiDataResponse,
  HomeCategoryApiResponse,
  CategoryApiDataResponse,
  ProductListApiDataResponse,
} from "../../types"

export const productsApiSlice = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL as string,
  }), // Can use any base URL, as queryFn will override
  reducerPath: "productsApi",
  tagTypes: ["Products"],
  endpoints: build => ({
    getAllProducts: build.query<ProductListApiDataResponse, undefined>({
      query: () => "products",
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
      transformResponse: (response: ProductListApiResponse) => {
        return response.data
      },
    }),
    getProductsByCategory: build.query<
      ProductListApiDataResponse,
      { category: string; page?: number }
    >({
      query: ({ category, page }) => {
        if (category !== "") {
          return page
            ? `products/category/${category}/${page.toString()}`
            : `products/category/${category}`
        } else {
          return page ? `products/page/${page.toString()}` : "products"
        }
      },
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
      transformResponse: (response: ProductListApiResponse) => {
        return response.data
      },
    }),
    getProductCategories: build.query<CategoryApiDataResponse, undefined>({
      query: () => "categories",
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
      transformResponse: (response: CategoryApiResponse) => {
        const { data } = response
        return data
      },
    }),
    getHomeProductCategories: build.query<
      HomeCategoryApiDataResponse,
      undefined
    >({
      query: () => "categories/home",
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
      transformResponse: (response: HomeCategoryApiResponse) => {
        return response.data
      },
    }),
    getProductDetails: build.query<ProductDetailApiDataResponse, number>({
      query: id => `products/${id.toString()}`,
      providesTags: (_result, _error, id) => [{ type: "Products", id }],
      transformResponse: (response: ProductDetailApiResponse) => {
        return response.data
      },
    }),
  }),
})

export const {
  useGetAllProductsQuery,
  useGetProductsByCategoryQuery,
  useGetProductCategoriesQuery,
  useGetProductDetailsQuery,
  useGetHomeProductCategoriesQuery,
} = productsApiSlice
