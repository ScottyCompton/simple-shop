import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  StatesApiResponse,
  StatesApiDataResponse,
  UserApiDataLoginResponse,
  UserApiLoginResponse,
  UserDetailApiDataResponse,
  UserDetailApiResponse,
} from "@/types"

export const userApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/" }),
  reducerPath: "userApi",
  tagTypes: ["User"],
  endpoints: build => ({
    getUserById: build.query<UserDetailApiDataResponse, number>({
      query: id => `users/${id.toString()}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
      transformResponse: (response: UserDetailApiResponse) => response.data,
    }),
    getUserStates: build.query<StatesApiDataResponse, undefined>({
      query: () => "/states/abbr",
      providesTags: (_result, _error, id) => [{ type: "User", id }],
      transformResponse: (response: StatesApiResponse) => response.data,
    }),
    authenticateUser: build.mutation<
      UserApiDataLoginResponse,
      { email: string; password: string }
    >({
      query: credentials => ({
        url: "users/auth",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response: UserApiLoginResponse) => response.data,
    }),
  }),
})

export const {
  useGetUserByIdQuery,
  useAuthenticateUserMutation,
  useGetUserStatesQuery,
} = userApiSlice
