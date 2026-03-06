import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import Header from "../../components/Header"
import { vi } from "vitest"

// Mock the subcomponents to isolate Header testing
vi.mock("../../components/ui/CartContents", () => ({
  default: () => <div data-testid="cart-contents">Cart</div>,
}))

vi.mock("../../components/ui/UserDisplay", () => ({
  default: () => <div data-testid="user-display">User</div>,
}))

vi.mock("../../components/ui/CategorySelect", () => ({
  default: () => <div data-testid="category-select">Categories</div>,
}))

describe("Header", () => {
  it("renders the header with logo and navigation elements", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    // Check if the logo link is present
    const logoLink = screen.getByRole("link", { name: /simple shop/i })
    expect(logoLink).toBeInTheDocument()
    expect(logoLink).toHaveAttribute("href", "/")

    // Check if the logo icon is present
    expect(screen.getByTestId("cart-contents")).toBeInTheDocument()
    expect(screen.getByTestId("user-display")).toBeInTheDocument()

    // There are two CategorySelect components (desktop and mobile)
    const categorySelects = screen.getAllByTestId("category-select")
    expect(categorySelects).toHaveLength(2)

    // Check for "Explore" text (appears twice, once for each category select)
    const exploreTexts = screen.getAllByText("Explore")
    expect(exploreTexts).toHaveLength(2)
  })

  it("displays the correct title", () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>,
    )

    expect(screen.getByText("[Simple Shop]")).toBeInTheDocument()
  })
})
