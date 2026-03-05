import { render, screen, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import CartSummaryItem from "../../../../components/shop/cart/CartSummaryItem"
import { vi } from "vitest"
import type { Product, CartItem } from "../../../../types"

// Mock the RTK Query hook
const mockUseGetProductDetailsQuery = vi.fn()
vi.mock("../../../../features/shop/productsApiSlice", () => ({
  useGetProductDetailsQuery: (id: number) => mockUseGetProductDetailsQuery(id),
}))

// Mock Redux selector
const mockUseAppSelector = vi.fn()
vi.mock("../../../../app/hooks", () => ({
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}))

// Mock QuantitySelect
vi.mock("../../../../components/ui/QuantitySelect", () => ({
  default: ({
    product,
    className,
  }: {
    product: Product
    className?: string
  }) => (
    <div data-testid="quantity-select" className={className}>
      Quantity for {product.name}
    </div>
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

const mockCartItem: CartItem = {
  id: 1,
  name: "Test Product",
  price: 29.99,
  qty: 2,
}

describe("CartSummaryItem", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseAppSelector.mockReturnValue([mockCartItem])
  })

  it("shows loading state initially", () => {
    mockUseGetProductDetailsQuery.mockReturnValue({
      isLoading: true,
      isUninitialized: false,
      isError: false,
      data: null,
    })

    render(
      <BrowserRouter>
        <CartSummaryItem cartItemId={1} />
      </BrowserRouter>,
    )

    expect(
      screen.queryByText(/error loading product details/i),
    ).not.toBeInTheDocument()
    // Check for animate-pulse class on the loading div
    const loadingDiv = document.querySelector(".animate-pulse")
    expect(loadingDiv).toBeInTheDocument()
  })

  it("shows error state when query fails", () => {
    mockUseGetProductDetailsQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: true,
      data: null,
    })

    render(
      <BrowserRouter>
        <CartSummaryItem cartItemId={1} />
      </BrowserRouter>,
    )

    expect(
      screen.getByText("Error loading product details"),
    ).toBeInTheDocument()
  })

  it("shows error when cart item not found", () => {
    mockUseGetProductDetailsQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: { product: mockProduct },
    })
    mockUseAppSelector.mockReturnValue([])

    render(
      <BrowserRouter>
        <CartSummaryItem cartItemId={1} />
      </BrowserRouter>,
    )

    expect(
      screen.getByText("Error loading product details"),
    ).toBeInTheDocument()
  })

  it("renders product details in non-checkout mode", async () => {
    mockUseGetProductDetailsQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: { product: mockProduct },
    })

    render(
      <BrowserRouter>
        <CartSummaryItem cartItemId={1} />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getAllByText("Test Mfg Test Product")).toHaveLength(2) // mobile and desktop links
    })

    expect(screen.getAllByText("A great test product")).toHaveLength(2)
    expect(screen.getByText("$29.99")).toBeInTheDocument()
    expect(screen.getByText("$59.98")).toBeInTheDocument() // 29.99 * 2
    expect(screen.getByTestId("quantity-select")).toBeInTheDocument()
  })

  it("renders product details in checkout mode", async () => {
    mockUseGetProductDetailsQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: { product: mockProduct },
    })

    render(
      <BrowserRouter>
        <CartSummaryItem cartItemId={1} isCheckout={true} />
      </BrowserRouter>,
    )

    await waitFor(() => {
      expect(screen.getAllByText("2")).toHaveLength(2) // quantity displayed as text in both layouts
    })

    expect(screen.queryByTestId("quantity-select")).not.toBeInTheDocument()
  })

  it("has correct links to product page", async () => {
    mockUseGetProductDetailsQuery.mockReturnValue({
      isLoading: false,
      isUninitialized: false,
      isError: false,
      data: { product: mockProduct },
    })

    render(
      <BrowserRouter>
        <CartSummaryItem cartItemId={1} />
      </BrowserRouter>,
    )

    await waitFor(() => {
      const links = screen.getAllByRole("link")
      expect(links).toHaveLength(4) // 2 image links and 2 name links (mobile and desktop)
      links.forEach(link => {
        expect(link).toHaveAttribute("href", "/shop/products/1")
      })
    })
  })
})
