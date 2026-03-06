import { render, screen } from "@testing-library/react"
import { vi } from "vitest"
import ProductDetails from "../../page/ProductDetails"

const mockUseLocation = vi.fn()

vi.mock("react-router", async () => {
  const actual =
    await vi.importActual<typeof import("react-router")>("react-router")
  return { ...actual, useLocation: () => mockUseLocation() }
})

vi.mock("@/components/shop/ProductDetail", () => ({
  default: ({ id }: { id: number }) => (
    <div data-testid="product-detail-mock" data-id={id} />
  ),
}))

const renderWithPath = (pathname: string) => {
  mockUseLocation.mockReturnValue({ pathname })
  return render(<ProductDetails />)
}

describe("ProductDetails page", () => {
  it("renders the ProductDetail component when a numeric id is in the path", () => {
    renderWithPath("/products/42")
    expect(screen.getByTestId("product-detail-mock")).toBeInTheDocument()
  })

  it("passes the correct numeric id to ProductDetail", () => {
    renderWithPath("/products/7")
    expect(screen.getByTestId("product-detail-mock")).toHaveAttribute(
      "data-id",
      "7",
    )
  })

  it("passes the correct id for a different product", () => {
    renderWithPath("/shop/electronics/123")
    expect(screen.getByTestId("product-detail-mock")).toHaveAttribute(
      "data-id",
      "123",
    )
  })

  it("applies the correct wrapper classes", () => {
    const { container } = renderWithPath("/products/1")
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass("w-full", "max-w-full")
  })

  it("does not render ProductDetail when the path ends with an empty segment", () => {
    renderWithPath("/products/")
    expect(screen.queryByTestId("product-detail-mock")).not.toBeInTheDocument()
  })
})
