// src/components/ui/RadixThemedButton.tsx
import { Button } from "@radix-ui/themes"
import { useTheme } from "@/context/ThemeContext"

type ThemedButtonProps = {
  children: React.ReactNode
  onClick?: () => void
  variant?: "solid" | "outline" | "ghost" | "soft"
}

const RadixThemedButton = ({
  children,
  onClick,
  variant = "solid",
}: ThemedButtonProps) => {
  const { themeConfig } = useTheme()

  return (
    <Button color={themeConfig.color} variant={variant} onClick={onClick}>
      {children}
    </Button>
  )
}

export default RadixThemedButton
