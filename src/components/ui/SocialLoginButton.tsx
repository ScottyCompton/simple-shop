import { Button } from "@radix-ui/themes"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faGoogle, faGithub } from "@fortawesome/free-brands-svg-icons"

type SocialLoginButtonProps = {
  loginType: "Google" | "GitHub"
}

const SocialLoginButton: React.FC<SocialLoginButtonProps> = ({
  loginType,
}: SocialLoginButtonProps) => {
  const apiUrl = import.meta.env.VITE_API_URL as string

  const handleClick = () => {
    // Store intent in localStorage to handle session persistence
    localStorage.setItem("authIntent", loginType.toLowerCase())
    // Store redirect path for after authentication
    const searchParams = new URLSearchParams(window.location.search)
    const redirect = searchParams.get("redirect")
    if (redirect) {
      localStorage.setItem("authRedirect", redirect)
    }
    window.location.href = `${apiUrl}/auth/${loginType.toLowerCase()}`
  }

  return (
    <div>
      <Button
        type="button"
        className="!w-full bg-gray-800 hover:bg-gray-900 !cursor-pointer"
        onClick={handleClick}
      >
        {loginType === "Google" && (
          <FontAwesomeIcon icon={faGoogle} className="mr-2" />
        )}
        {loginType === "GitHub" && (
          <FontAwesomeIcon icon={faGithub} className="mr-2" />
        )}
        Sign in with {loginType}
      </Button>
    </div>
  )
}

export default SocialLoginButton
