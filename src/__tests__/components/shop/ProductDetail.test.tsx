import { render, screen, waitFor } from "@testing-library/react"
import ProductDetail from "../../../components/shop/ProductDetail"
import { vi } from "vitest"
import type { Product } from "../../../types"

// Mock the RTK Query hook
const mockUseGetProductDetailsQuery = vi.fn()
vi.mock("../../../features/shop/productsApiSlice", () => ({
  useGetProductDetailsQuery: (id: number) => mockUseGetProductDetailsQuery(id),
}))

// Mock QuantitySelect
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
  longDesc: "This is a detailed description of the test product.",
}

describe("ProductDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows loading state initially", () => {
    mockUseGetProductDetailsQuery.mockReturnValue({
      isLoading: true,
      isUninitialized: false,
      isError: false,
      data: null,
    })

    render(<ProductDetail id={1} />)

    expect(screen.getByText("Loading...")).toBeInTheDocument()
  })

  it("shows error state when query fails", () => {
    mockUseGetProductDetailsQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: true,
      data: null,
    })

    render(<ProductDetail id={1} />)

    expect(screen.getByText("Error Locating that product")).toBeInTheDocument()
  })

  it("renders product details when data is available", async () => {
    mockUseGetProductDetailsQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: { product: mockProduct },
    })

    render(<ProductDetail id={1} />)

    await waitFor(() => {
      expect(screen.getByText("Test Mfg Test Product")).toBeInTheDocument()
    })

    expect(screen.getByText("A great test product")).toBeInTheDocument()
    expect(screen.getByText("$29.99")).toBeInTheDocument()
    expect(
      screen.getByText("This is a detailed description of the test product."),
    ).toBeInTheDocument()
    expect(screen.getByTestId("quantity-select")).toBeInTheDocument()

    const image = screen.getByAltText("Test Mfg Test Product")
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute("src", "https://example.com/image.jpg")
  })
})
