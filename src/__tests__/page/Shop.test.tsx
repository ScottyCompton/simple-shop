import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import { vi } from "vitest"
import Shop from "../../page/Shop"

vi.mock("@/components/shop/ProductList", () => ({
  default: () => <div data-testid="product-list-mock" />,
}))

const renderShop = () =>
  render(
    <BrowserRouter>
      <Shop />
    </BrowserRouter>,
  )

describe("Shop page", () => {
  it("renders the ProductList component", () => {
    renderShop()
    expect(screen.getByTestId("product-list-mock")).toBeInTheDocument()
  })

  it("applies the correct wrapper classes for responsive padding", () => {
    const { container } = renderShop()
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass("w-full", "px-4", "sm:px-6", "md:px-8")
  })
})
