import {
  Button,
  TextField,
  Heading,
  Card,
  Flex,
  Text,
  Spinner,
} from "@radix-ui/themes"
import { useAuthenticateUserMutation } from "@/features/shop/userApiSlice"
import { setUser } from "@/features/shop/usersSlice"
import { useAppDispatch } from "@/app/hooks"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLock, faSackDollar } from "@fortawesome/free-solid-svg-icons"
import SocialLoginButton from "@/components/ui/SocialLoginButton"

const Login = () => {
  const [authenticateUser] = useAuthenticateUserMutation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const { data } = await authenticateUser({ email, password })

      if (data) {
        console.log("Login successful:", data)
        dispatch(setUser(data.user))
        const prev = document.referrer
        if (prev.includes("/checkout")) {
          void navigate("/checkout")
        } else {
          void navigate("/shop")
        }
      } else {
        setError("Invalid email or password")
      }
    } catch {
      setError("Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid place-items-center h-[70vh]">
      <Card className="w-full max-w-md mx-4">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-blue-800 text-white p-4 rounded-full mb-4">
              <FontAwesomeIcon icon={faSackDollar} size="lg" />
            </div>
            <Heading size="5">Sign in to your account</Heading>
            <Text color="gray" size="2" className="text-center mt-1">
              Enter your credentials to access your account
            </Text>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4 text-sm">
              {error}
            </div>
          )}

          <form
            onSubmit={e => {
              void handleLogin(e)
            }}
            className="space-y-4"
          >
            <Flex direction="column" gap="2">
              <div>
                <div>
                  <Text
                    as="label"
                    size="2"
                    weight="medium"
                    className="block mb-1.5"
                  >
                    Email
                  </Text>
                  <Flex>
                    <div className="flex items-center justify-center bg-gray-100 px-3 rounded-l-md border border-r-0 border-gray-300">
                      <FontAwesomeIcon
                        icon={faSackDollar}
                        className="text-gray-500"
                      />
                    </div>
                    <TextField.Root
                      placeholder="you@youremail.com"
                      value={email}
                      onChange={e => {
                        setEmail(e.target.value)
                      }}
                      className="flex-1 rounded-l-none !border-l-0"
                      required
                    />
                  </Flex>
                </div>

                <div>
                  <Text
                    as="label"
                    size="2"
                    weight="medium"
                    className="block mb-1.5"
                  >
                    Password
                  </Text>
                  <Flex>
                    <div className="flex items-center justify-center bg-gray-100 px-3 rounded-l-md border border-r-0 border-gray-300">
                      <FontAwesomeIcon
                        icon={faLock}
                        className="text-gray-500"
                      />
                    </div>
                    <TextField.Root
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={e => {
                        setPassword(e.target.value)
                      }}
                      className="flex-1 rounded-l-none !border-l-0"
                      required
                    />
                  </Flex>
                </div>
              </div>
              <div>
                <Button
                  type="submit"
                  className="!w-full bg-blue-800 hover:bg-blue-700 !cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading && <Spinner />} Sign in
                </Button>
              </div>
            </Flex>
            <div className="flex items-center my-4">
              <div className="flex-1 border-t border-gray-300"></div>
              <Text size="2" color="gray" className="mx-4">
                OR
              </Text>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            <Flex direction="column" gap="2">
              <div className="flex-1 w-full my-4">
                <SocialLoginButton loginType="Google" />
              </div>
              <div className="flex-1 w-full">
                <SocialLoginButton loginType="GitHub" />
              </div>
            </Flex>
            <div className="text-center mt-4">
              <Text size="1" color="gray">
                Don't have an account?{" "}
                <Text as="span" color="blue">
                  Create one
                </Text>
              </Text>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

export default Login
