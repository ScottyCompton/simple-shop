// src/context/ThemeContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react"
import { Theme } from "@radix-ui/themes"
import { type ThemeConfig, type ThemeName, THEMES } from "@/types/theme"
import { logCSSVariables } from "@/utils/debugTheme"

type ThemeContextType = {
  currentTheme: ThemeName
  setTheme: (theme: ThemeName) => void
  themeConfig: ThemeConfig
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

// Default theme
const DEFAULT_THEME: ThemeName = "blue-light"

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [currentTheme, setCurrentTheme] = useState<ThemeName>(() => {
    // Get from localStorage or use default
    const savedTheme = localStorage.getItem("theme") as ThemeName | null
    return savedTheme && Object.keys(THEMES).includes(savedTheme)
      ? savedTheme
      : DEFAULT_THEME
  })

  const themeConfig = THEMES[currentTheme]

  useEffect(() => {
    // Save theme to localStorage when it changes
    localStorage.setItem("theme", currentTheme)

    console.log("Theme changed to:", currentTheme)

    // Apply theme class to document element
    // First, remove any existing theme classes
    const html = document.documentElement
    const existingClasses = Array.from(html.classList)
    existingClasses.forEach(cls => {
      if (cls.startsWith("theme-")) {
        html.classList.remove(cls)
      }
    })

    // Add the new theme class
    html.classList.add(`theme-${currentTheme}`)

    // Log CSS variables for debugging
    logCSSVariables()

    // Force a re-render of the styles by adding and removing a temporary class
    html.classList.add("theme-refresh")
    setTimeout(() => {
      html.classList.remove("theme-refresh")
      logCSSVariables()
    }, 10)
  }, [currentTheme])

  const setTheme = (theme: ThemeName) => {
    setCurrentTheme(theme)
  }

  // Initialize theme on mount
  useEffect(() => {
    // Apply initial theme class to document element immediately on mount
    console.log("Initializing theme to:", currentTheme)
    document.documentElement.classList.add(`theme-${currentTheme}`)
    logCSSVariables()
  }, [currentTheme])

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, themeConfig }}>
      <Theme
        appearance={themeConfig.appearance}
        accentColor={themeConfig.color}
      >
        {children}
      </Theme>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
