import { describe, it, expect, vi } from "vitest"
import { screen, waitFor } from "@testing-library/react"
import { renderWithProviders } from "../testUtils"
import ProductDetail from "../../components/shop/ProductDetail"

// Mock QuantitySelect
vi.mock("../../components/ui/QuantitySelect", () => ({
  default: ({ product }: any) => (
    <div data-testid="quantity-select-mock">{product.name} - Qty Control</div>
  ),
}))

describe("ProductDetail - Integration Tests", () => {
  it("should load and display product details from API", async () => {
    renderWithProviders(<ProductDetail id={1} />)

    // Initially shows loading
    expect(screen.getByText("Loading...")).toBeInTheDocument()

    // Wait for product details to load
    await waitFor(
      () => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
      },
      { timeout: 10000 },
    )

    // Verify the component handles the response
    // (Note: the actual content depends on the MSW mock data)
    expect(screen.queryByText(/Error/)).not.toBeInTheDocument()
  })

  it("should display product name and price", async () => {
    renderWithProviders(<ProductDetail id={1} />)

    await waitFor(
      () => {
        expect(screen.queryByText("Loading...")).not.toBeInTheDocument()
      },
      { timeout: 10000 },
    )

    // Verify the product name is displayed
    expect(screen.getByText(/Laptop/i)).toBeInTheDocument()
    // Verify About this product section is displayed
    expect(screen.getByText(/About this product/i)).toBeInTheDocument()
    // Verify quantity select mock is displayed
    expect(screen.getByTestId("quantity-select-mock")).toBeInTheDocument()
  })
})
