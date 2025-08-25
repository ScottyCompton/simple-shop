// src/components/ui/ThemeSwitcher.tsx
import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"
import { type ThemeName, THEMES } from "@/types/theme"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSun, faMoon, faChevronDown } from "@fortawesome/free-solid-svg-icons"

const ThemeSwitcher = () => {
  const { currentTheme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)

  console.log("Current Theme:", currentTheme)

  const toggleDropdown = () => {
    console.log("Toggle dropdown", isOpen)
    setIsOpen(!isOpen)
  }

  const handleThemeChange = (themeName: ThemeName) => {
    console.log("Changing theme to:", themeName)
    setTheme(themeName)
    setIsOpen(false)
  }

  const getThemeIcon = (themeName: ThemeName) => {
    return themeName.includes("dark") ? (
      <FontAwesomeIcon icon={faMoon} className="mr-2" />
    ) : (
      <FontAwesomeIcon icon={faSun} className="mr-2" />
    )
  }

  const getThemeLabel = (themeName: ThemeName) => {
    const [color, appearance] = themeName.split("-")
    return `${color.charAt(0).toUpperCase() + color.slice(1)} (${appearance})`
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center gap-2 bg-white/20 text-white hover:bg-white/30 transition-colors py-1 px-3 rounded-md border border-white/30"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {getThemeIcon(currentTheme)}
        <span className="hidden sm:inline">{getThemeLabel(currentTheme)}</span>
        <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 py-2 w-56 bg-white rounded-md shadow-xl z-50 border border-gray-200 text-gray-800">
          {Object.keys(THEMES).map(themeName => (
            <button
              key={themeName}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center ${
                themeName === currentTheme ? "bg-gray-100 font-medium" : ""
              }`}
              onClick={() => {
                handleThemeChange(themeName as ThemeName)
              }}
            >
              {getThemeIcon(themeName as ThemeName)}
              {getThemeLabel(themeName as ThemeName)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ThemeSwitcher
