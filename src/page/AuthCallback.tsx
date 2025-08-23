import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppDispatch } from "@/app/hooks"
import { setUser } from "@/features/shop/usersSlice"
import { Spinner, Text } from "@radix-ui/themes"
import { safeGetUserFromToken } from "@/utils/authHelpers"

const AuthCallback = () => {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const provider = searchParams.get("provider") // Get the auth provider from URL
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  useEffect(() => {
    const handleCallback = async () => {
      if (!token) {
        setError("No authentication token received")
        return
      }

      try {
        // Store token and provider info in localStorage
        localStorage.setItem("authToken", token)
        if (provider) {
          localStorage.setItem("lastAuthProvider", provider)
        }

        // Get user data from the token
        // Using try/catch block and type assertion to handle TypeScript error
        try {
          const userDataResult = await safeGetUserFromToken(token)

          if (userDataResult !== null) {
            // User data is ready to use
            const userData = userDataResult

            // Save user to Redux state
            dispatch(
              setUser({ ...userData, lastUpdate: new Date().toISOString() }),
            )

            // Check if this was a "connect account" flow from the profile page
            const authIntent = localStorage.getItem("authIntent")

            if (authIntent) {
              // Clear the intent since we've processed it
              localStorage.removeItem("authIntent")

              // Redirect back to profile page or stored redirect path
              const redirectPath =
                localStorage.getItem("authRedirect") ?? "/profile"
              localStorage.removeItem("authRedirect")

              // Navigate to the appropriate page
              void navigate(redirectPath)
            } else {
              // Regular login flow - redirect to shop or stored redirect path
              const redirectPath =
                localStorage.getItem("authRedirect") ?? "/shop"
              localStorage.removeItem("authRedirect")

              // Navigate to the appropriate page
              void navigate(redirectPath)
            }
          } else {
            setError("Failed to get user data")
          }
        } catch (userDataError) {
          console.error("Error getting user data:", userDataError)
          setError("Failed to retrieve your user information")
        }
      } catch (err) {
        console.error("Error handling auth callback:", err)
        setError("Authentication failed. Please try again.")
      }
    }

    void handleCallback()
  }, [token, provider, navigate, dispatch])

  if (error) {
    return (
      <div className="grid place-items-center h-screen">
        <div className="text-center">
          <Text size="5" color="red">
            {error}
          </Text>
          <div className="mt-4">
            <button
              onClick={() => {
                void navigate("/login")
              }}
              className="px-4 py-2 bg-blue-800 text-white rounded hover:bg-blue-700"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid place-items-center h-screen">
      <div className="text-center">
        <Spinner size="3" />
        <Text as="p" size="3" className="mt-4">
          Logging you in...
        </Text>
      </div>
    </div>
  )
}

export default AuthCallback
