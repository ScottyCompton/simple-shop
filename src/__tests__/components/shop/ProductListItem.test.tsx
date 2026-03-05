import { render, screen } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import ProductListItem from "../../../components/shop/ProductListItem"
import { vi } from "vitest"
import type { Product } from "../../../types"

// Mock QuantitySelect component
vi.mock("../../../components/ui/QuantitySelect", () => ({
  default: ({ product }: { product: Product }) => (
    <div data-testid="quantity-select">Quantity for {product.name}</div>
  ),
}))

const mockProduct: Product = {
  id: 1,
  name: "Test Product",
  price: 29.99,
  category: "Electronics",
  shortDesc: "A great test product",
  inStock: true,
  imgUrl: "https://example.com/image.jpg",
  mfgName: "Test Mfg",
}

describe("ProductListItem", () => {
  it("renders product information correctly", () => {
    render(
      <BrowserRouter>
        <ProductListItem product={mockProduct} />
      </BrowserRouter>,
    )

    // Check product name and manufacturer
    expect(screen.getByText("Test Mfg Test Product")).toBeInTheDocument()

    // Check short description
    expect(screen.getByText("A great test product")).toBeInTheDocument()

    // Check price
    expect(screen.getByText("$29.99")).toBeInTheDocument()

    // Check quantity select
    expect(screen.getByTestId("quantity-select")).toBeInTheDocument()
  })

  it("renders product image with correct attributes", () => {
    render(
      <BrowserRouter>
        <ProductListItem product={mockProduct} />
      </BrowserRouter>,
    )

    const image = screen.getByAltText("Test Mfg Test Product")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg")
  })

  it("has correct links to product detail page", () => {
    render(
      <BrowserRouter>
        <ProductListItem product={mockProduct} />
      </BrowserRouter>,
    )

    const links = screen.getAllByRole("link")
    expect(links).toHaveLength(2) // Image link and name link
    links.forEach(link => {
      expect(link).toHaveAttribute("href", "/shop/product/1")
    })
  })
})
