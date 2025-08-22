import { jwtDecode } from "jwt-decode"
import type { User } from "@/types"

// Define response type for auth/me endpoint
type AuthMeResponse = {
  isValid?: boolean
  success?: boolean
  user?: User
  data?: {
    user?: User
  }
}

type TokenPayload = {
  id: number
  iat: number
  exp: number
}

type ApiResponse = {
  data: {
    user: User
  }
}

/**
 * Decode JWT token and extract payload
 * This returns the token payload directly, not user data
 */
export const decodeToken = (token: string): TokenPayload | null => {
  try {
    let decoded: TokenPayload | null = null
    try {
      decoded = jwtDecode(token) as TokenPayload
    } catch (err) {
      console.error("jwtDecode failed:", err)
      return null
    }

    // Store user ID in localStorage for future reference
    localStorage.setItem("userId", decoded.id.toString())
    return decoded
  } catch (error) {
    console.error("Error decoding token:", error)
    return null
  }
}

/**
 * Get full user data from a token
 * This combines decodeToken and fetchUserData
 */
export const getUserFromToken = async (token: string): Promise<User | null> => {
  try {
    // First try to get user data directly from the auth/me endpoint
    try {
      const response = await fetch("http://localhost:3000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = (await response.json()) as AuthMeResponse

        // Handle both response formats
        if (data.user) {
          return data.user
        } else if (data.data?.user) {
          return data.data.user
        }
      }
    } catch (directError) {
      console.error("Error fetching from auth/me endpoint:", directError)
      // Fall back to the token decoding approach
    }

    // Fallback: decode the token and fetch user data
    const decoded = decodeToken(token)
    if (!decoded) return null

    // Get auth provider from localStorage if available
    const authProvider = localStorage.getItem("lastAuthProvider")

    // Fetch user data using the ID from the token
    const userData = await fetchUserData(decoded.id, authProvider)
    return userData
  } catch (error) {
    console.error("Error getting user from token:", error)
    return null
  }
}

// Function to get user data from API using the token
export const fetchUserData = async (
  userId: number,
  provider?: string | null,
): Promise<User | null> => {
  try {
    const token = localStorage.getItem("authToken")
    if (!token) return null
    const apiUrl = import.meta.env.VITE_API_URL as string

    const response = await fetch(`${apiUrl}/users/${userId.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        // Include provider info in headers if available
        ...(provider && { "X-Auth-Provider": provider }),
      },
    })

    if (!response.ok) {
      throw new Error("Failed to fetch user data")
    }

    const data = (await response.json()) as ApiResponse

    // Get user data with auth providers
    const user = data.data.user
    // Store current provider for user reference
    if (provider) {
      localStorage.setItem("lastAuthProvider", provider)
    }

    return user
  } catch (error) {
    console.error("Error fetching user data:", error)
    return null
  }
}

// Function to check if token is valid
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem("authToken")
  if (!token) return false

  try {
    const decoded = jwtDecode(token) as TokenPayload

    const currentTime = Date.now() / 1000

    // Check if token is expired
    return decoded.exp > currentTime
  } catch {
    return false
  }
}

// Logout function
export const logout = (): void => {
  localStorage.removeItem("authToken")
  localStorage.removeItem("userId")
  localStorage.removeItem("lastAuthProvider")
  localStorage.removeItem("user")
}
