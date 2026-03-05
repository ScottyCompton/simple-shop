import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import { BrowserRouter } from "react-router-dom"
import CartSummary from "../../../../components/shop/cart/CartSummary"
import { vi } from "vitest"
import type { CartItem } from "../../../../types"

// Mock Redux selector
const mockUseAppSelector = vi.fn()
vi.mock("@/app/hooks", () => ({
  useAppSelector: (selector: any) => mockUseAppSelector(selector),
}))

// Mock CartSummaryItem
vi.mock("../CartSummaryItem", () => ({
  default: ({
    cartItemId,
    isCheckout,
  }: {
    cartItemId: number
    isCheckout?: boolean
  }) => (
    <div data-testid={`cart-item-${cartItemId}`}>
      Item {cartItemId} {isCheckout ? "(checkout)" : ""}
    </div>
  ),
}))

// Mock ShippingSelect
vi.mock("../../../../components/ui", () => ({
  ShippingSelect: ({
    onSelectShippingType,
  }: {
    onSelectShippingType: (value: number) => void
  }) => (
    <select
      data-testid="shipping-select"
      onChange={e => onSelectShippingType(Number(e.target.value))}
    >
      <option value="5">Standard - $5</option>
      <option value="10">Express - $10</option>
    </select>
  ),
}))

const mockCartItems: CartItem[] = [
  { id: 1, name: "Product 1", price: 20, qty: 2 },
  { id: 2, name: "Product 2", price: 15, qty: 1 },
]

describe("CartSummary", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("shows empty cart message when no items", () => {
    mockUseAppSelector.mockReturnValue([])

    render(
      <BrowserRouter>
        <CartSummary />
      </BrowserRouter>,
    )

    expect(screen.getByText("Your cart is empty")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: /continue shopping/i }),
    ).toBeInTheDocument()
  })

  it("renders cart items and calculates subtotal", () => {
    mockUseAppSelector.mockReturnValue(mockCartItems)

    render(
      <BrowserRouter>
        <CartSummary />
      </BrowserRouter>,
    )

    expect(screen.getByTestId("cart-item-1")).toBeInTheDocument()
    expect(screen.getByTestId("cart-item-2")).toBeInTheDocument()
    expect(screen.getByText("Cart Subtotal:")).toBeInTheDocument()
    expect(screen.getByText("$55.00")).toBeInTheDocument() // 20*2 + 15*1 = 55
    expect(screen.getByText("Total:")).toBeInTheDocument()
    expect(screen.getByText("$55.00")).toBeInTheDocument() // no shipping
  })

  it("shows checkout buttons when not in checkout mode", () => {
    mockUseAppSelector.mockReturnValue(mockCartItems)

    render(
      <BrowserRouter>
        <CartSummary />
      </BrowserRouter>,
    )

    expect(
      screen.getByRole("link", { name: /proceed to checkout/i }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole("link", { name: /continue shopping/i }),
    ).toHaveLength(2) // one in empty state, one here
  })

  it("shows shipping selection in checkout mode", () => {
    mockUseAppSelector.mockReturnValue(mockCartItems)

    render(
      <BrowserRouter>
        <CartSummary isCheckout={true} />
      </BrowserRouter>,
    )

    expect(screen.getByTestId("shipping-select")).toBeInTheDocument()
    expect(screen.getByText("Select Shipping Method:")).toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: /proceed to checkout/i }),
    ).not.toBeInTheDocument()
  })

  it("updates total when shipping is selected", async () => {
    mockUseAppSelector.mockReturnValue(mockCartItems)

    render(
      <BrowserRouter>
        <CartSummary isCheckout={true} />
      </BrowserRouter>,
    )

    const shippingSelect = screen.getByTestId("shipping-select")
    fireEvent.change(shippingSelect, { target: { value: "10" } })

    await waitFor(() => {
      expect(screen.getByText("$65.00")).toBeInTheDocument() // 55 + 10
    })
  })

  it("passes isCheckout prop to cart items", () => {
    mockUseAppSelector.mockReturnValue(mockCartItems)

    render(
      <BrowserRouter>
        <CartSummary isCheckout={true} />
      </BrowserRouter>,
    )

    expect(screen.getByText("Item 1 (checkout)")).toBeInTheDocument()
    expect(screen.getByText("Item 2 (checkout)")).toBeInTheDocument()
  })
})
