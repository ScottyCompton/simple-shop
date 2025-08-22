// src/page/Profile.tsx
import { useState, useEffect } from "react"
import { useAppSelector } from "@/app/hooks"
import { selectUser } from "@/features/shop/usersSlice"
import { Card, Heading, Text, Button, Flex, Avatar } from "@radix-ui/themes"
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash, faWarning } from "@fortawesome/free-solid-svg-icons"

type AuthProvider = {
  id: number
  provider: string
  providerId: string
  avatar?: string | null
  lastUsedAt: string
}

const Profile = () => {
  const user = useAppSelector(selectUser)
  const [authProviders, setAuthProviders] = useState<AuthProvider[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL as string

  // Fetch connected auth providers
  useEffect(() => {
    const fetchAuthProviders = async () => {
      try {
        setLoading(true)
        const token = localStorage.getItem("authToken")

        if (!token) {
          setError("Not authenticated")
          setLoading(false)
          return
        }

        const response = await fetch(`${apiUrl}/user-auth`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch auth providers")
        }

        type ApiResponse = {
          data: {
            authProviders: AuthProvider[]
          }
          success: boolean
        }

        const data = (await response.json()) as ApiResponse
        setAuthProviders(data.data.authProviders)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching auth providers:", err)
        setError("Failed to load authentication providers")
        setLoading(false)
      }
    }

    void fetchAuthProviders()
  }, [apiUrl])

  // Disconnect auth provider
  const disconnectProvider = async (id: number) => {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        setError("Not authenticated")
        return
      }

      const response = await fetch(`${apiUrl}/user-auth/${id.toString()}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        type ErrorData = {
          error: string
          success: boolean
        }

        const errorData = (await response.json()) as ErrorData
        throw new Error(errorData.error || "Failed to disconnect provider")
      }

      // Remove from list on success
      setAuthProviders(prev => prev.filter(p => p.id !== id))
    } catch (err) {
      const error = err as Error
      setError(error.message || "Failed to disconnect provider")
    }
  }

  // Connect new provider
  const connectProvider = (provider: string): void => {
    // Store intent in localStorage to handle session persistence
    localStorage.setItem("authIntent", provider)
    // Store current URL to return here after auth
    localStorage.setItem("authRedirect", window.location.pathname)
    // Redirect to auth endpoint
    window.location.href = `${apiUrl}/auth/${provider}`
  }

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  // Get icon for provider
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return <FontAwesomeIcon icon={faGoogle} className="text-red-500" />
      case "github":
        return <FontAwesomeIcon icon={faGithub} />
      default:
        return null
    }
  }

  // Get display name for provider
  const getProviderName = (provider: string) => {
    switch (provider) {
      case "google":
        return "Google"
      case "github":
        return "GitHub"
      default:
        return provider.charAt(0).toUpperCase() + provider.slice(1)
    }
  }

  if (!user) {
    return <div>Please log in to view your profile.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Heading size="6" className="mb-6">
        My Profile
      </Heading>

      <div className="grid md:grid-cols-3 gap-8">
        {/* User info */}
        <Card className="p-6">
          <Heading size="3" className="mb-4">
            Account Information
          </Heading>
          <div className="flex items-center mb-4">
            <Avatar
              size="6"
              src={user.avatar ?? undefined}
              fallback={user.firstName.charAt(0) + user.lastName.charAt(0)}
              className="mr-4"
            />
            <div>
              <Text size="4" weight="bold">
                {user.firstName} {user.lastName}
              </Text>
              <Text size="2" color="gray">
                {user.email}
              </Text>
            </div>
          </div>
        </Card>

        {/* Authentication providers */}
        <Card className="p-6 md:col-span-2">
          <Heading size="3" className="mb-4">
            Connected Accounts
          </Heading>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-4">
              <Flex align="center" gap="2">
                <FontAwesomeIcon icon={faWarning} />
                <Text>{error}</Text>
              </Flex>
            </div>
          )}

          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              {authProviders.length === 0 ? (
                <Text color="gray">No connected accounts found.</Text>
              ) : (
                <div className="space-y-3">
                  {authProviders.map(provider => (
                    <div
                      key={provider.id}
                      className="border rounded-md p-4 flex justify-between items-center"
                    >
                      <div className="flex items-center">
                        {provider.avatar ? (
                          <Avatar
                            size="3"
                            src={provider.avatar}
                            fallback={getProviderName(provider.provider).charAt(
                              0,
                            )}
                            className="mr-3"
                          />
                        ) : (
                          <div className="w-8 text-lg">
                            {getProviderIcon(provider.provider)}
                          </div>
                        )}
                        <div>
                          <Text weight="medium">
                            {getProviderName(provider.provider)}
                          </Text>
                          <Text size="1" color="gray">
                            Last used: {formatDate(provider.lastUsedAt)}
                          </Text>
                        </div>
                      </div>
                      <Button
                        color="red"
                        variant="soft"
                        size="1"
                        onClick={() => {
                          void disconnectProvider(provider.id)
                        }}
                        disabled={authProviders.length <= 1}
                      >
                        <FontAwesomeIcon icon={faTrash} className="mr-1" />{" "}
                        Disconnect
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-6">
                <Heading size="2" className="mb-3">
                  Connect New Account
                </Heading>
                <Flex gap="3">
                  {!authProviders.some(p => p.provider === "google") && (
                    <Button
                      onClick={() => {
                        connectProvider("google")
                      }}
                      variant="outline"
                    >
                      <FontAwesomeIcon
                        icon={faGoogle}
                        className="mr-2 text-red-500"
                      />{" "}
                      Connect Google
                    </Button>
                  )}

                  {!authProviders.some(p => p.provider === "github") && (
                    <Button
                      onClick={() => {
                        connectProvider("github")
                      }}
                      variant="outline"
                    >
                      <FontAwesomeIcon icon={faGithub} className="mr-2" />{" "}
                      Connect GitHub
                    </Button>
                  )}
                </Flex>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  )
}

export default Profile
