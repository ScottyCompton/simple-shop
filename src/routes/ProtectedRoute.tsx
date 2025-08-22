// @src/components/ProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom"
import { useAppSelector, useAppDispatch } from "@/app/hooks"
import { selectUser, setUser } from "@/features/shop/usersSlice"
import {
  isAuthenticated as checkAuthToken,
  fetchUserData,
} from "@/utils/authUtils"
import { useEffect, useState, type ReactNode } from "react"
import type { User } from "@/types"

type ProtectedRouteProps = {
  children?: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}: ProtectedRouteProps) => {
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const [isChecking, setIsChecking] = useState(true)
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false)

  // First check for user in Redux store
  useEffect(() => {
    const checkAuth = async () => {
      // If user is already in the Redux store, we're authenticated
      if (user) {
        setIsUserAuthenticated(true)
        setIsChecking(false)
        return
      }

      // Check local storage for user data
      const localUserData: User | null = JSON.parse(
        localStorage.getItem("user") ?? "null",
      ) as User | null

      if (localUserData) {
        dispatch(setUser(localUserData))
        setIsUserAuthenticated(true)
        setIsChecking(false)
        return
      }

      // Check for JWT token
      const token = localStorage.getItem("authToken")
      if (token && checkAuthToken()) {
        try {
          // Fetch user data using the token
          const userId = parseInt(localStorage.getItem("userId") ?? "0")
          if (userId) {
            const userData = await fetchUserData(userId)
            if (userData) {
              dispatch(setUser(userData))
              setIsUserAuthenticated(true)
              setIsChecking(false)
              return
            }
          }
        } catch (error) {
          console.error("Error verifying authentication:", error)
        }
      }

      // If we get here, user is not authenticated
      setIsUserAuthenticated(false)
      setIsChecking(false)
    }

    void checkAuth()
  }, [dispatch, user])

  // Show loading state while checking authentication
  if (isChecking) {
    return <div>Loading...</div>
  }

  // Redirect to login if not authenticated
  if (!isUserAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Render child routes or outlet for nested routes
  return children ?? <Outlet />
}

export default ProtectedRoute
