import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  UserApiDataLoginResponse,
  UserApiLoginResponse,
  UserDetailApiDataResponse,
  UserDetailApiResponse,
  UserAuthApiResponse,
} from "@/types"

// Define a type for the auth/me endpoint responses
type AuthMeResponse = {
  isValid?: boolean
  user?: UserAuthApiResponse
  data?: {
    user?: UserAuthApiResponse
  }
  success?: boolean
  error?: string
}

// Create a baseQuery with auth header injection
const baseQueryWithAuth = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL as string,
  prepareHeaders: headers => {
    // Get token from localStorage
    const token = localStorage.getItem("authToken")
    // If token exists, add it to the headers
    if (token) {
      headers.set("Authorization", `Bearer ${token}`)
    }
    return headers
  },
})

export const userApiSlice = createApi({
  baseQuery: baseQueryWithAuth,
  reducerPath: "userApi",
  tagTypes: ["User"],
  endpoints: build => ({
    getUserById: build.query<UserDetailApiDataResponse, number>({
      query: id => `users/${id.toString()}`,
      providesTags: (_result, _error, id) => [{ type: "User", id }],
      transformResponse: (response: UserDetailApiResponse) => response.data,
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

// Add social auth verification endpoint
export const userApiSliceExtended = userApiSlice.injectEndpoints({
  endpoints: build => ({
    // Verify a token with the backend
    verifyToken: build.query<
      { isValid: boolean; user?: UserAuthApiResponse },
      string | null
    >({
      query: token => ({
        url: "auth/me",
        method: "GET",
        headers: { Authorization: `Bearer ${token ?? ""}` },
      }),
      transformResponse: (response: AuthMeResponse) => {
        // Handle both response formats (with data.user or directly with user)
        if (response.data?.user) {
          return {
            isValid: true,
            user: response.data.user,
          }
        } else if (response.user) {
          return {
            isValid: response.isValid ?? true,
            user: response.user,
          }
        } else {
          return {
            isValid: false,
          }
        }
      },
      transformErrorResponse: () => ({
        isValid: false,
      }),
    }),
  }),
})

export const { useGetUserByIdQuery, useAuthenticateUserMutation } = userApiSlice

export const { useVerifyTokenQuery } = userApiSliceExtended
