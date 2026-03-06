import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"
import Cart from "../../page/Cart"

// Mock CartSummary to isolate Cart rendering
vi.mock("@/components/shop/cart/CartSummary", () => ({
  default: () => <div data-testid="cart-summary-mock" />,
}))

const renderCart = () =>
  render(
    <BrowserRouter>
      <Cart />
    </BrowserRouter>,
  )

describe("Cart page", () => {
  it("renders the Cart Contents heading", () => {
    renderCart()
    expect(
      screen.getByRole("heading", { level: 1, name: "Cart Contents" }),
    ).toBeInTheDocument()
  })

  it("renders the CartSummary component", () => {
    renderCart()
    expect(screen.getByTestId("cart-summary-mock")).toBeInTheDocument()
  })

  it("applies the correct wrapper classes for responsive padding", () => {
    const { container } = renderCart()
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass("w-full", "px-4", "sm:px-6", "md:px-8")
  })
})
