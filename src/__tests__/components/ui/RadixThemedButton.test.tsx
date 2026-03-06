import { render, screen, fireEvent } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { vi } from "vitest"
import RadixThemedButton from "../../../components/ui/RadixThemedButton"

vi.mock("@/context/ThemeContext", () => ({
  useTheme: () => ({
    themeConfig: { color: "blue", appearance: "light" },
    currentTheme: "blue-light",
    setTheme: vi.fn(),
  }),
}))

describe("RadixThemedButton", () => {
  it("renders children text", () => {
    render(<RadixThemedButton>Click Me</RadixThemedButton>)
    expect(
      screen.getByRole("button", { name: /click me/i }),
    ).toBeInTheDocument()
  })

  it("renders ReactNode children (JSX element)", () => {
    render(
      <RadixThemedButton>
        <span data-testid="child-span">Icon</span>
      </RadixThemedButton>,
    )
    expect(screen.getByTestId("child-span")).toBeInTheDocument()
  })

  it("calls onClick when clicked", async () => {
    const handleClick = vi.fn()
    render(
      <RadixThemedButton onClick={handleClick}>Click Me</RadixThemedButton>,
    )
    await userEvent.click(screen.getByRole("button"))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it("does not throw when onClick is omitted", () => {
    render(<RadixThemedButton>No Handler</RadixThemedButton>)
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow()
  })

  it("defaults to the solid variant", () => {
    render(<RadixThemedButton>Solid</RadixThemedButton>)
    expect(screen.getByRole("button")).toHaveClass("rt-variant-solid")
  })

  it("renders with the outline variant", () => {
    render(<RadixThemedButton variant="outline">Outline</RadixThemedButton>)
    expect(screen.getByRole("button")).toHaveClass("rt-variant-outline")
  })

  it("renders with the ghost variant", () => {
    render(<RadixThemedButton variant="ghost">Ghost</RadixThemedButton>)
    expect(screen.getByRole("button")).toHaveClass("rt-variant-ghost")
  })

  it("renders with the soft variant", () => {
    render(<RadixThemedButton variant="soft">Soft</RadixThemedButton>)
    expect(screen.getByRole("button")).toHaveClass("rt-variant-soft")
  })

  it("applies the color from themeConfig", () => {
    render(<RadixThemedButton>Colored</RadixThemedButton>)
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-accent-color",
      "blue",
    )
  })
})
