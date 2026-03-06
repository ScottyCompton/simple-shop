import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { vi } from "vitest"
import { ThemeProvider, useTheme } from "@/context/ThemeContext"
import type { ThemeName } from "../../../types/theme"

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
})

// Mock document methods
const mockDocumentElement = {
  classList: {
    add: vi.fn(),
    remove: vi.fn(),
    contains: vi.fn(),
  },
}
Object.defineProperty(document, "documentElement", {
  value: mockDocumentElement,
})

// Mock logCSSVariables
vi.mock("@/utils/debugTheme", () => ({
  logCSSVariables: vi.fn(),
}))

// Test component that uses the hook
const TestComponent = () => {
  const { currentTheme, setTheme, themeConfig } = useTheme()
  return (
    <div>
      <span data-testid="current-theme">{currentTheme}</span>
      <span data-testid="theme-appearance">{themeConfig.appearance}</span>
      <button
        onClick={() => {
          setTheme("blue-dark" as ThemeName)
        }}
      >
        Set Dark Blue
      </button>
    </div>
  )
}

describe("ThemeContext", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
  })

  it("provides default theme when no saved theme", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    )

    expect(screen.getByTestId("current-theme")).toHaveTextContent("blue-light")
    expect(localStorageMock.getItem).toHaveBeenCalledWith("theme")
  })

  it("loads saved theme from localStorage", () => {
    localStorageMock.getItem.mockReturnValue("blue-dark")

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    )

    expect(screen.getByTestId("current-theme")).toHaveTextContent("blue-dark")
  })

  it("ignores invalid saved theme", () => {
    localStorageMock.getItem.mockReturnValue("invalid-theme")

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    )

    expect(screen.getByTestId("current-theme")).toHaveTextContent("blue-light")
  })

  it("saves theme to localStorage when changed", async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    )

    const button = screen.getByRole("button", { name: /set dark blue/i })
    fireEvent.click(button)

    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "theme",
        "blue-dark",
      )
    })

    expect(screen.getByTestId("current-theme")).toHaveTextContent("blue-dark")
  })

  it("applies theme class to document element", () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>,
    )

    expect(mockDocumentElement.classList.add).toHaveBeenCalledWith(
      "theme-blue-light",
    )
  })

  it("throws error when useTheme is used outside provider", () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {})

    expect(() => render(<TestComponent />)).toThrow(
      "useTheme must be used within a ThemeProvider",
    )

    consoleSpy.mockRestore()
  })
})
